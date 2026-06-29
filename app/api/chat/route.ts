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
import { detectReminder, extractUrl, wantsSummary } from '@/lib/actions'
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

  // Action 1: save a reminder.
  const reminderText = detectReminder(message)
  if (reminderText) {
    await supabase.from('reminders').insert({ user_id: user.id, text: reminderText })
    const content = `Got it — I'll remind you to ${reminderText}.`
    await supabase.from('messages').insert({ user_id: user.id, role: 'assistant', content })
    return streamPlain(content)
  }

  // Action 2: summarize a pasted URL.
  const url = extractUrl(message)
  if (url && wantsSummary(message)) {
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
    const content = `${summary.content}\n\n(Tell me "save that" to keep this as a memory.)`
    await supabase.from('messages').insert({ user_id: user.id, role: 'assistant', content })
    return streamPlain(content)
  }

  const escalate = heuristicHard(message) || (await model.classify(message))

  const memoryBlock = memories.length
    ? `What you remember about this user:\n- ${memories.join('\n- ')}`
    : 'You have no saved memories about this user yet.'
  const system = `${soandso.system_prompt}\n\n${memoryBlock}`

  // Fire-and-forget durable-fact extraction, shared by both backends.
  const extractMemory = (botMsg: string) =>
    void (async () => {
      try {
        const fact = await model.extractMemory(message, botMsg)
        if (fact && dedupeMemory(fact, memories)) {
          await supabase.from('memories').insert({ user_id: user.id, content: fact, source: 'chat' })
        }
      } catch {
        // best-effort; never block the response on memory extraction
      }
    })()

  // Mock backend (no GEMINI_API_KEY): generate once, then stream the text.
  if (model.backend === 'mock') {
    const result = await model.chat({ system, memories, history: [], message, escalate })
    await supabase.from('messages').insert({
      user_id: user.id,
      role: 'assistant',
      content: result.content,
      sources: result.sources,
    })
    extractMemory(result.content)
    return streamPlain(result.content)
  }

  // Google Search grounding requires a billing-enabled key, so it's opt-in.
  // Set GEMINI_GROUNDING=true once billing is on to get live web citations.
  const grounding =
    process.env.GEMINI_GROUNDING === 'true'
      ? ({ google_search: google.tools.googleSearch({}) } as Parameters<typeof streamText>[0]['tools'])
      : undefined

  // Live Gemini via the AI SDK — token-streamed.
  const result = streamText({
    model: google(escalate ? ESCALATE_MODEL : DEFAULT_MODEL),
    system,
    messages: await convertToModelMessages(messages),
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
      extractMemory(text)
    },
  })

  return result.toUIMessageStreamResponse()
}
