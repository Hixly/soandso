'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageBubble } from './MessageBubble'
import { BottomNav } from './BottomNav'
import type { Source } from '@/lib/types'

type ChatMessage = { role: 'user' | 'assistant'; content: string; sources?: Source[] | null }

export function ChatThread({ initial }: { initial: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setSending(true)
    setMessages((m) => [...m, { role: 'user', content: text }])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.content ?? '…', sources: data.sources ?? null },
      ])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-6">
        {messages.length === 0 && (
          <p className="m-auto text-center opacity-50">Say hello to get started.</p>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} sources={m.sources} />
        ))}
        {sending && <p className="text-sm opacity-50">…</p>}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="mx-auto flex w-full max-w-2xl gap-2 px-4 pb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message your So&So…"
          className="flex-1 rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 outline-none focus:border-brand-ink"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-xl bg-brand-ink px-5 py-3 font-medium text-brand-bg disabled:opacity-40"
        >
          Send
        </button>
      </form>
      <BottomNav />
    </div>
  )
}
