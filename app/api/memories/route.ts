import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function GET() {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data, error } = await supabase
    .from('memories')
    .select('id, content, source, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ memories: data })
}

export async function POST(req: Request) {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { content } = (await req.json()) as { content: string }
  if (!content?.trim()) return NextResponse.json({ error: 'empty' }, { status: 400 })
  const { data, error } = await supabase
    .from('memories')
    .insert({ user_id: user.id, content: content.trim(), source: 'manual' })
    .select('id, content, source, created_at')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ memory: data })
}

export async function PATCH(req: Request) {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id, content } = (await req.json()) as { id: string; content: string }
  if (!id || !content?.trim()) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const { error } = await supabase
    .from('memories')
    .update({ content: content.trim() })
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = (await req.json()) as { id: string }
  if (!id) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const { error } = await supabase.from('memories').delete().eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
