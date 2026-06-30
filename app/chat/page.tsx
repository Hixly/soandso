import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { UIMessage } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { ChatRuntimeProvider } from '@/components/chat/ChatRuntimeProvider'
import { Thread } from '@/components/chat/Thread'
import { LogoMark } from '@/components/LogoMark'
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
      <header className="flex items-center justify-between border-b border-brand-ink/10 px-5 py-2.5">
        <LogoMark width={26} />
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="Home"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 11.5l9-8 9 8" />
              <path d="M5 10v10h5v-6h4v6h5V10" />
            </svg>
          </Link>
          <Link
            href="/saved"
            aria-label="Saved"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </Link>
        </div>
      </header>
      <ChatRuntimeProvider initialMessages={initialMessages}>
        <Thread />
      </ChatRuntimeProvider>
      <BottomNav />
    </div>
  )
}
