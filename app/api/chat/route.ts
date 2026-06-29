import { createGoogleGenerativeAI } from '@ai-sdk/google'
import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai'
import { createClient } from '@/lib/supabase/server'
import { getModel } from '@/lib/model'
import { heuristicHard } from '@/lib/classify'
import { dedupeMemory, RECENT_N } from '@/lib/memory'
import { detectReminder, detectSave, extractUrl, wantsSummary } from '@/lib/actions'
import type { Source } from '@/lib/types'

export const maxDuration = 30

const DEFAULT_MODEL = process.env.GEMINI_MODEL_DEFAULT || 'gemini-3.1-flash-lite'
const ESCALATE_MODEL = process.env.GEMINI_MODEL_ESCALATE || 'gemini-3.5-flash'

// The AI SDK Google provider defaults to GOOGLE_GENERATIVE_AI_API_KEY; point it at
// our GEMINI_API_KEY so a single key drives both this and the @google/genai adapter.
const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000)
}

// Pull the plain text out of the most recent user message in a UI thread.
function lastUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === 'user')
  if (!last) return ''
  return last.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join(' ')
    .trim()
}

function textOf(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join(' ')
    .trim()
}

// The exchange a "save this" command refers to: the most recent assistant reply
// and the user message that prompted it (skipping the save command itself).
function lastExchange(messages: UIMessage[]): { user: string; assistant: string } | null {
  let ai = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      ai = i
      break
    }
  }
  if (ai === -1) return null
  let user = ''
  for (let i = ai - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      user = textOf(messages[i])
      break
    }
  }
  return { user, assistant: textOf(messages[ai]) }
}

// Swap the text of the latest user message — lets a combined "answer this + save it"
// turn send the cleaned request to the model instead of the raw "…save this" text.
function replaceLastUserText(messages: UIMessage[], text: string): UIMessage[] {
  let li = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      li = i
      break
    }
  }
  if (li === -1) return messages
  return messages.map((m, i) =>
    i === li ? { ...m, parts: [{ type: 'text', text }] as UIMessage['parts'] } : m,
  )
}

// Stream a fixed string back in the assistant-ui (UI message) protocol — used for
// the mock backend and for canned action replies, which aren't token-streamed.
function streamPlain(text: string) {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = crypto.randomUUID()
      writer.write({ type: 'text-start', id })
      writer.write({ type: 'text-delta', id, delta: text })
      writer.write({ type: 'text-end', id })
    },
  })
  return createUIMessageStreamResponse({ stream })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('unauthorized', { status: 401 })

  const { messages } = (await req.json()) as { messages: UIMessage[] }
  const message = lastUserText(messages)
  if (!message) return new Response('empty message', { status: 400 })

  const { data: soandso } = await supabase
    .from('soandso')
    .select('system_prompt')
    .eq('user_id', user.id)
    .single()
  if (!soandso) return new Response('no soandso', { status: 404 })

  const { data: memRows } = await supabase
    .from('memories')
    .select('content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(RECENT_N)
  const memories = (memRows ?? []).map((m) => m.content)

  // Persist the incoming user message.
  await supabase.from('messages').insert({ user_id: user.id, role: 'user', content: message })

  const model = getModel()

  // Save intent: "save this" (optionally with a label and/or an inline request).
  const save = detectSave(message)

  // Standalone save — nothing else was asked, so just file the previous exchange.
  if (save && !save.remainder) {
    const exchange = lastExchange(messages)
    if (!exchange?.assistant) {
      const content = "There's nothing to save yet — ask me something first, then say \"save this.\""
      await supabase.from('messages').insert({ user_id: user.id, role: 'assistant', content })
      return streamPlain(content)
    }
    await supabase.from('saved_items').insert({
      user_id: user.id,
      label: save.label,
      user_message: exchange.user,
      assistant_message: exchange.assistant,
    })
    const content = `Saved to your ${save.label} collection. ✓ Tap the bookmark up top to revisit it.`
    await supabase.from('messages').insert({ user_id: user.id, role: 'assistant', content })
    return streamPlain(content)
  }

  // Combined save — a real request rode along with "save this"; answer it, then
  // save that fresh exchange. `prompt` is the cleaned request we send the model.
  const combinedSave = save && save.remainder ? save : null
  const prompt = combinedSave ? combinedSave.remainder : message

  const persistSaved = async (assistantText: string) => {
    if (!combinedSave) return
    const { error } = await supabase.from('saved_items').insert({
      user_id: user.id,
      label: combinedSave.label,
      user_message: prompt,
      assistant_message: assistantText.replace(/\n*\(Saved to your[^)]*\)\s*$/i, '').trim(),
    })
    if (error) console.error('[saved_items insert]', error.message)
  }

  // Action 1: save a reminder.
  const reminderText = detectReminder(prompt)
  if (reminderText) {
    await supabase.from('reminders').insert({ user_id: user.id, text: reminderText })
    const content = `Got it — I'll remind you to ${reminderText}.`
    await supabase.from('messages').insert({ user_id: user.id, role: 'assistant', content })
    return streamPlain(content)
  }

  // Action 2: summarize a pasted URL.
  const url = extractUrl(prompt)
  if (url && wantsSummary(prompt)) {
    let pageText = ''
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'SoAndSo/1.0' } })
      pageText = htmlToText(await res.text())
    } catch {
      // fall through to summarizing the URL itself if the fetch fails
    }
    const summary = await model.chat({
      system: 'Summarize the following web page in 3-4 concise sentences. Be factual and neutral.',
      memories: [],
      history: [],
      message: pageText || url,
      escalate: false,
    })
    const content = summary.content
    await supabase.from('messages').insert({ user_id: user.id, role: 'assistant', content })
    await persistSaved(content)
    return streamPlain(content)
  }

  const escalate = heuristicHard(prompt) || (await model.classify(prompt))

  const memoryBlock = memories.length
    ? `What you remember about this user:\n- ${memories.join('\n- ')}`
    : 'You have no saved memories about this user yet.'
  const saveNote = combinedSave
    ? `\n\nThe user also asked to save this reply to their "${combinedSave.label}" collection. End your response with this line on its own: "(Saved to your ${combinedSave.label}. ✓)"`
    : ''
  const system = `${soandso.system_prompt}\n\n${memoryBlock}${saveNote}`

  // Fire-and-forget durable-fact extraction, shared by both backends.
  const extractMemory = (botMsg: string) =>
    void (async () => {
      try {
        const fact = await model.extractMemory(prompt, botMsg)
        if (fact && dedupeMemory(fact, memories)) {
          await supabase.from('memories').insert({ user_id: user.id, content: fact, source: 'chat' })
        }
      } catch {
        // best-effort; never block the response on memory extraction
      }
    })()

  // Mock backend (no GEMINI_API_KEY): generate once, then stream the text.
  if (model.backend === 'mock') {
    const result = await model.chat({ system, memories, history: [], message: prompt, escalate })
    const content = combinedSave
      ? `${result.content}\n\n(Saved to your ${combinedSave.label}. ✓)`
      : result.content
    await supabase.from('messages').insert({
      user_id: user.id,
      role: 'assistant',
      content,
      sources: result.sources,
    })
    await persistSaved(result.content)
    extractMemory(content)
    return streamPlain(content)
  }

  // Google Search grounding requires a billing-enabled key, so it's opt-in.
  // Set GEMINI_GROUNDING=true once billing is on to get live web citations.
  const grounding =
    process.env.GEMINI_GROUNDING === 'true'
      ? ({ google_search: google.tools.googleSearch({}) } as Parameters<typeof streamText>[0]['tools'])
      : undefined

  // For a combined save, send the model the cleaned request (not the "…save this" text).
  const modelMessages = combinedSave ? replaceLastUserText(messages, prompt) : messages

  // Live Gemini via the AI SDK — token-streamed.
  const result = streamText({
    model: google(escalate ? ESCALATE_MODEL : DEFAULT_MODEL),
    system,
    messages: await convertToModelMessages(modelMessages),
    tools: grounding,
    onFinish: async ({ text, sources }) => {
      const mapped: Source[] | null =
        sources && sources.length
          ? sources
              .filter((s): s is typeof s & { url: string } => 'url' in s && Boolean(s.url))
              .map((s) => ({ title: s.title || new URL(s.url).hostname, url: s.url }))
          : null
      await supabase.from('messages').insert({
        user_id: user.id,
        role: 'assistant',
        content: text,
        sources: mapped,
      })
      await persistSaved(text)
      extractMemory(text)
    },
  })

  return result.toUIMessageStreamResponse()
}
