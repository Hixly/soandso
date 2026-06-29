import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { JOB_PRESETS, buildSystemPrompt } from '@/lib/prompt'
import type { Personality } from '@/lib/types'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data } = await supabase
    .from('soandso')
    .select('name, job, personality')
    .eq('user_id', user.id)
    .single()
  return NextResponse.json({ soandso: data })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await req.json()) as {
    name: string
    jobs?: string[]
    job?: string
    jobCustom?: string
    personality: Personality
  }
  // Accept either an onboarding-style chip array (`jobs`) or a free-text `job`
  // string (the Tune screen edits the composed role sentence directly).
  let job: string
  if (Array.isArray(body.jobs) && body.jobs.length) {
    const roles = body.jobs
      .map((j) =>
        j === 'Something else'
          ? String(body.jobCustom || 'a helpful personal assistant')
          : (JOB_PRESETS[j] ?? j),
      )
      .filter(Boolean)
    job = roles.length ? roles.join(', and ') : 'a helpful personal assistant'
  } else {
    job = body.job?.trim() || 'a helpful personal assistant'
  }

  const system_prompt = buildSystemPrompt(body.name, job, body.personality)
  const { error } = await supabase
    .from('soandso')
    .update({ name: body.name, job, personality: body.personality, system_prompt })
    .eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
