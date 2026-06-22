import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { text, due_at } = (await req.json()) as { text: string; due_at?: string | null }
  if (!text?.trim()) return NextResponse.json({ error: 'empty' }, { status: 400 })

  const { data, error } = await supabase
    .from('reminders')
    .insert({ user_id: user.id, text: text.trim(), due_at: due_at ?? null })
    .select('id, text, due_at')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ reminder: data })
}
