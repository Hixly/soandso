import { redirect } from 'next/navigation'
import type { UIMessage } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { ChatRuntimeProvider } from '@/components/chat/ChatRuntimeProvider'
import { Thread } from '@/components/chat/Thread'
import { BrandLogo } from '@/components/BrandLogo'
import { BottomNav } from '@/components/BottomNav'
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

  // Seed the assistant-ui thread with stored history as UI messages.
  const initialMessages: UIMessage[] = (rows ?? []).reverse().map((m, i) => {
    const parts: UIMessage['parts'] = [{ type: 'text', text: m.content }]
    if (m.role === 'assistant' && Array.isArray(m.sources)) {
      for (const s of m.sources as Source[]) {
        parts.push({ type: 'source-url', sourceId: s.url, url: s.url, title: s.title })
      }
    }
    return { id: `seed-${i}`, role: m.role as 'user' | 'assistant', parts }
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-start border-b border-brand-ink/10 px-5 py-2.5">
        <BrandLogo width={26} />
      </header>
      <ChatRuntimeProvider initialMessages={initialMessages}>
        <Thread />
      </ChatRuntimeProvider>
      <BottomNav />
    </div>
  )
}
