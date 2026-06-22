import type { ModelBackend } from './model'

const CURRENT = /(latest|today|news|current|now|2026|weather|price|score)/i

export function mockBackend(): ModelBackend {
  return {
    backend: 'mock',
    async chat({ message, escalate }) {
      const sources = CURRENT.test(message)
        ? [{ title: 'Example source', url: 'https://example.com/article' }]
        : null
      const tag = escalate ? '[thinking it through] ' : ''
      return {
        content: `${tag}(mock reply) You said: "${message}". Add a GEMINI_API_KEY to go live.`,
        sources,
      }
    },
    async classify(message) {
      return message.length > 140 || /why|how|plan|compare|explain/i.test(message)
    },
    async extractMemory(userMsg) {
      const m = userMsg.match(/my (goal|name) is ([^.!?]+)/i)
      return m ? `User's ${m[1]} is ${m[2].trim()}` : null
    },
  }
}
