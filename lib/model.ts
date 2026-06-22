import type { Source } from './types'
import { mockBackend } from './model.mock'

export type ChatInput = {
  system: string
  memories: string[]
  history: { role: 'user' | 'assistant'; content: string }[]
  message: string
  escalate: boolean
}

export type ChatResult = { content: string; sources: Source[] | null }

export type ModelBackend = {
  backend: 'gemini' | 'mock'
  chat(input: ChatInput): Promise<ChatResult>
  classify(message: string): Promise<boolean> // true = hard → escalate
  extractMemory(userMsg: string, botMsg: string): Promise<string | null>
}

export function getModel(): ModelBackend {
  if (process.env.GEMINI_API_KEY) {
    // Lazy require so the Gemini SDK is never loaded in keyless/mock dev.
    const { geminiBackend } = require('./model.gemini') as typeof import('./model.gemini')
    return geminiBackend()
  }
  return mockBackend()
}
