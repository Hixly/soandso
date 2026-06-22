// Gemini backend for the So&So model adapter.
//
// SDK: @google/genai (unified GoogleGenAI client).
//   const ai = new GoogleGenAI({ apiKey })
//   ai.models.generateContent({ model, contents, config })
// Grounding: config.tools = [{ googleSearch: {} }]; source URLs come back on
//   response.candidates[0].groundingMetadata.groundingChunks[].web.{uri,title}
//
// Model IDs are env-overridable so they can be corrected without code changes.
// Defaults reflect the current AI Studio tiers (verify slugs in Google AI Studio):
//   default  : gemini-3.1-flash-lite  (most cost-efficient — runs most turns + classifier)
//   escalate : gemini-3.5-flash       (most intelligent free-tier — hard questions)
import { GoogleGenAI } from '@google/genai'
import type { ChatInput, ModelBackend } from './model'
import type { Source } from './types'

const DEFAULT_MODEL = process.env.GEMINI_MODEL_DEFAULT || 'gemini-3.1-flash-lite'
const ESCALATE_MODEL = process.env.GEMINI_MODEL_ESCALATE || 'gemini-3.5-flash'
const MAX_OUTPUT_TOKENS = 800

function buildContents(input: ChatInput) {
  const memoryBlock = input.memories.length
    ? `What you remember about this user:\n- ${input.memories.join('\n- ')}`
    : 'You have no saved memories about this user yet.'
  const turns = input.history.map((h) => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }],
  }))
  return {
    systemInstruction: `${input.system}\n\n${memoryBlock}`,
    contents: [...turns, { role: 'user', parts: [{ text: input.message }] }],
  }
}

function extractSources(response: unknown): Source[] | null {
  const candidates = (response as { candidates?: unknown[] })?.candidates
  const meta = (candidates?.[0] as { groundingMetadata?: { groundingChunks?: unknown[] } })
    ?.groundingMetadata
  const chunks = meta?.groundingChunks
  if (!chunks?.length) return null
  const seen = new Set<string>()
  const sources: Source[] = []
  for (const chunk of chunks) {
    const web = (chunk as { web?: { uri?: string; title?: string } }).web
    if (web?.uri && !seen.has(web.uri)) {
      seen.add(web.uri)
      sources.push({ title: web.title || new URL(web.uri).hostname, url: web.uri })
    }
  }
  return sources.length ? sources : null
}

export function geminiBackend(): ModelBackend {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

  return {
    backend: 'gemini',
    async chat(input) {
      const { systemInstruction, contents } = buildContents(input)
      const response = await ai.models.generateContent({
        model: input.escalate ? ESCALATE_MODEL : DEFAULT_MODEL,
        contents,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      })
      return { content: response.text ?? '', sources: extractSources(response) }
    },

    async classify(message) {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Classify this user message as HARD (multi-step reasoning, comparison, planning, or deep explanation) or EASY (everything else). Reply with exactly one word: HARD or EASY.\n\nMessage: ${message}`,
              },
            ],
          },
        ],
        config: { maxOutputTokens: 4 },
      })
      return /HARD/i.test(response.text ?? '')
    },

    async extractMemory(userMsg, botMsg) {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Did the user reveal a durable fact about themselves worth remembering long-term? Reply with ONE short factual sentence (e.g. "User is training for a 5k") or the single word NONE.\n\nUser: ${userMsg}\nAssistant: ${botMsg}`,
              },
            ],
          },
        ],
        config: { maxOutputTokens: 40 },
      })
      const out = (response.text ?? '').trim()
      return !out || /^NONE/i.test(out) ? null : out
    },
  }
}
