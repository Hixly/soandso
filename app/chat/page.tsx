import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatThread } from '@/components/ChatThread'
import { RECENT_N } from '@/lib/memory'
import type { Source } from '@/lib/types'

export default async function ChatPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: soandso } = await supabase
    .from('soandso')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!soandso) redirect('/onboarding')

  const { data: rows } = await supabase
    .from('messages')
    .select('role, content, sources')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(RECENT_N)

  const initial = (rows ?? []).reverse().map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
    sources: m.sources as Source[] | null,
  }))

  return <ChatThread initial={initial} />
}
