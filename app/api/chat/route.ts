import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getModel } from '@/lib/model'
import { heuristicHard } from '@/lib/classify'
import { dedupeMemory, RECENT_N } from '@/lib/memory'

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { message } = (await req.json()) as { message: string }
  if (!message?.trim()) return NextResponse.json({ error: 'empty message' }, { status: 400 })

  const { data: soandso } = await supabase
    .from('soandso')
    .select('system_prompt')
    .eq('user_id', user.id)
    .single()
  if (!soandso) return NextResponse.json({ error: 'no soandso' }, { status: 404 })

  const { data: memRows } = await supabase
    .from('memories')
    .select('content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(RECENT_N)
  const memories = (memRows ?? []).map((m) => m.content)

  const { data: histRows } = await supabase
    .from('messages')
    .select('role, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(RECENT_N)
  const history = (histRows ?? [])
    .reverse()
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  await supabase.from('messages').insert({ user_id: user.id, role: 'user', content: message })

  const model = getModel()
  const escalate = heuristicHard(message) || (await model.classify(message))
  const result = await model.chat({
    system: soandso.system_prompt,
    memories,
    history,
    message,
    escalate,
  })

  await supabase.from('messages').insert({
    user_id: user.id,
    role: 'assistant',
    content: result.content,
    sources: result.sources,
  })

  // Fire-and-forget durable-fact extraction (de-duped against existing memories).
  void (async () => {
    try {
      const fact = await model.extractMemory(message, result.content)
      if (fact && dedupeMemory(fact, memories)) {
        await supabase.from('memories').insert({ user_id: user.id, content: fact, source: 'chat' })
      }
    } catch {
      // best-effort; never block the chat response on memory extraction
    }
  })()

  return NextResponse.json({ content: result.content, sources: result.sources })
}
