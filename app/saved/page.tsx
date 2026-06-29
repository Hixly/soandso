'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/components/BottomNav'

type SavedItem = {
  id: string
  label: string
  user_message: string | null
  assistant_message: string
  created_at: string
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/saved')
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function remove(id: string) {
    await fetch('/api/saved', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setItems((s) => s.filter((x) => x.id !== id))
  }

  // Group by label, preserving newest-first order within each group.
  const groups = items.reduce<Record<string, SavedItem[]>>((acc, it) => {
    ;(acc[it.label] ??= []).push(it)
    return acc
  }, {})
  const labels = Object.keys(groups)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-brand-ink/10 px-5 py-2.5">
        <Link href="/chat" className="text-lg opacity-60 hover:opacity-100" aria-label="Back to chat">
          ←
        </Link>
        <span className="font-display text-lg font-semibold">Saved</span>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {loading ? (
          <p className="opacity-50">Loading…</p>
        ) : items.length === 0 ? (
          <p className="opacity-60">
            Nothing saved yet. In a chat, just say <em>&ldquo;save this&rdquo;</em> or{' '}
            <em>&ldquo;bookmark this&rdquo;</em> — add <em>&ldquo;as a recipe&rdquo;</em> to file it
            under a label.
          </p>
        ) : (
          <div className="flex flex-col gap-8">
            {labels.map((label) => (
              <section key={label} className="flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest opacity-50">
                  {label}
                </h2>
                {groups[label].map((it) => (
                  <article
                    key={it.id}
                    className="flex flex-col gap-2 rounded-2xl border border-brand-ink/15 px-4 py-3"
                  >
                    {it.user_message && (
                      <p className="text-sm opacity-55">You: {it.user_message}</p>
                    )}
                    <p className="whitespace-pre-wrap text-sm">{it.assistant_message}</p>
                    <button
                      onClick={() => remove(it.id)}
                      className="self-end text-xs opacity-50 hover:opacity-100"
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
