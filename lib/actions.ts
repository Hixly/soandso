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

// Detects an explicit "save this" request anywhere in a message and splits it
// into the label and the leftover request ("remainder").
//   "save this"                          -> { label: 'Saved',  remainder: '' }
//   "save this as a recipe"              -> { label: 'Recipe', remainder: '' }
//   "recommend a game? save this"        -> { label: 'Saved',  remainder: 'recommend a game' }
//   "give me a pasta recipe, save it as a recipe"
//                                        -> { label: 'Recipe', remainder: 'give me a pasta recipe' }
// Empty remainder => save the previous exchange. Non-empty => answer it, then save that.
// To avoid firing on phrases like "how do I save this file", the save command must
// sit at the start (after filler), at the end, or carry an "as/to/under <label>" clause.
export function detectSave(text: string): { label: string; remainder: string } | null {
  const t = text.trim()
  // Trigger verbs: "save", "bookmark", or "pin" — followed by this/that/it/etc.
  const cmd =
    /\b(?:save|bookmark|pin)\s+(?:this|that|it|the\s+(?:last|above|previous)(?:\s+\w+)?)\b(\s+(?:as|to|under|into|in|for)\b[\w\s]*)?/i
  const m = t.match(cmd)
  if (!m || m.index === undefined) return null

  const before = t.slice(0, m.index).trim()
  const after = t.slice(m.index + m[0].length).trim()
  const hasLabelClause = Boolean(m[1] && m[1].trim())
  const atStart =
    before.replace(
      /^(?:ok(?:ay)?|yes|yeah|sure|hey|please|pls|now|can you|could you|go ahead(?:\s+and)?|and|also|then)\b[\s,]*/gi,
      '',
    ).trim() === ''
  const atEnd = after === '' || /^(?:please|thanks?|thank you|too|as well)\b/i.test(after)
  if (!hasLabelClause && !atStart && !atEnd) return null

  // The remaining request is whichever side holds the real content.
  let remainder = atStart ? after : before
  remainder = remainder
    .replace(/[\s,;:?!.&-]+$/g, '')
    .replace(/\b(?:and|also|then|please)\s*$/i, '')
    .trim()

  // Label from the "as/to/under …" clause; default "Saved".
  let tail = (m[1] || '')
    .replace(/\b(as|to|under|into|in|for|my|a|an|the)\b/gi, ' ')
    .replace(/[^\w ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  tail = tail.split(' ').slice(0, 3).join(' ').trim()
  const label = tail ? tail.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Saved'

  return { label, remainder }
}
