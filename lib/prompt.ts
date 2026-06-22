import type { Personality } from './types'

export const JOB_PRESETS: Record<string, string> = {
  'Stay on my goals': 'an accountability coach who keeps the user on track toward their goals',
  'Help me write': 'a writing partner who helps the user draft and refine their writing',
  'Talk things through': 'a thoughtful sounding board who helps the user think things through',
  'Answer my questions': "a knowledgeable assistant who answers the user's questions clearly",
  'Keep me organized': 'an organized assistant who helps the user plan and stay on top of things',
}

export function buildSystemPrompt(name: string, job: string, p: Personality): string {
  const tone: string[] = []
  tone.push(
    p.gentle_blunt > 60
      ? "Be direct and blunt; don't cushion things."
      : p.gentle_blunt < 40
        ? 'Be warm, gentle, and encouraging.'
        : 'Be balanced and matter-of-fact.',
  )
  tone.push(
    p.chill_energy > 60
      ? 'Keep an upbeat, high-energy vibe.'
      : p.chill_energy < 40
        ? 'Stay calm and low-key.'
        : 'Keep an even, steady tone.',
  )
  tone.push(
    p.brief_detailed > 60
      ? 'Give thorough, detailed answers.'
      : p.brief_detailed < 40
        ? 'Keep answers short and to the point.'
        : 'Match answer length to the question.',
  )

  return `You are ${name}, a personal AI for one user. Your job: ${job}.
${tone.join(' ')}
You remember things about this user; relevant memories are provided each turn — use them naturally, never robotically.
When a question depends on current or verifiable facts, use web search and cite the source.
Never claim to be human. Never invent facts. If unsure, say so.`
}

const zone = (v: number) => (v > 60 ? 'hi' : v < 40 ? 'lo' : 'mid')

export function tonePreview(p: Personality): string {
  const g = zone(p.gentle_blunt)
  const e = zone(p.chill_energy)
  const d = zone(p.brief_detailed)
  if (g === 'hi' && e === 'hi' && d === 'lo') return "Nope, that won't work. Next idea—go."
  if (g === 'lo' && e === 'lo' && d === 'hi')
    return "Hey, no rush — let's gently walk through this together, step by step."
  const lead = g === 'hi' ? 'Straight up:' : g === 'lo' ? 'Hey, gently:' : 'Okay:'
  const body = e === 'hi' ? "let's get after it" : e === 'lo' ? "let's take it easy" : "here's the plan"
  const tail =
    d === 'hi' ? ", and I'll walk through every detail." : d === 'lo' ? '.' : ' — as much detail as you need.'
  return `${lead} ${body}${tail}`
}
