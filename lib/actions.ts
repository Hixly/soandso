// Lightweight intent detection for the 3 v1 actions. Works with or without a model key.

export function extractUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s]+/i)
  return m ? m[0] : null
}

export function detectReminder(text: string): string | null {
  const m = text.match(/\bremind me (?:to )?(.+)/i)
  return m ? m[1].trim().replace(/[.!?]+$/, '') : null
}

export function wantsSummary(text: string): boolean {
  return /\b(summari[sz]e|tl;?dr|sum up)\b/i.test(text)
}
