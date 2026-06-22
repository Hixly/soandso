import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { JOB_PRESETS, buildSystemPrompt } from '@/lib/prompt'
import type { Personality } from '@/lib/types'

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await req.json()) as {
    job: string
    jobCustom?: string
    name: string
    personality: Personality
    goal?: string
    keepInMind?: string
  }

  const job =
    body.job === 'Something else'
      ? String(body.jobCustom || 'a helpful personal assistant')
      : (JOB_PRESETS[body.job] ?? 'a helpful personal assistant')

  const system_prompt = buildSystemPrompt(body.name, job, body.personality)

  const { error } = await supabase.from('soandso').insert({
    user_id: user.id,
    name: body.name,
    job,
    personality: body.personality,
    system_prompt,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const seeds = [body.goal, body.keepInMind]
    .filter((s): s is string => Boolean(s && s.trim()))
    .map((content) => ({ user_id: user.id, content: content.trim(), source: 'manual' as const }))
  if (seeds.length) await supabase.from('memories').insert(seeds)

  // Seed a personalized first message that proves personality + purpose + memory at once.
  const seedMemory = seeds[0]?.content
  const firstMessage = `Hey — I'm ${body.name}. I'm here to help you as ${job}. ${
    seedMemory ? `You mentioned "${seedMemory}". Want to start there?` : "What's on your mind?"
  }`
  await supabase.from('messages').insert({
    user_id: user.id,
    role: 'assistant',
    content: firstMessage,
  })

  return NextResponse.json({ ok: true })
}
