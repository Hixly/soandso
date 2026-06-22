'use client'

import { useEffect, useState } from 'react'
import { BottomNav } from '@/components/BottomNav'

type Mem = { id: string; content: string; source: string }

export default function MemoryPage() {
  const [memories, setMemories] = useState<Mem[]>([])
  const [adding, setAdding] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/memories')
      .then((r) => r.json())
      .then((d) => setMemories(d.memories ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function add() {
    const content = adding.trim()
    if (!content) return
    setAdding('')
    const res = await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    const d = await res.json()
    if (d.memory) setMemories((m) => [d.memory, ...m])
  }

  async function saveEdit(id: string) {
    const content = editText.trim()
    if (!content) return
    await fetch('/api/memories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, content }),
    })
    setMemories((m) => m.map((x) => (x.id === id ? { ...x, content } : x)))
    setEditingId(null)
  }

  async function remove(id: string) {
    await fetch('/api/memories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setMemories((m) => m.filter((x) => x.id !== id))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-2xl font-semibold">Everything it remembers about you</h1>
        <p className="mb-5 text-sm opacity-60">Edit or delete anything. Add your own facts too.</p>

        <div className="mb-5 flex gap-2">
          <input
            value={adding}
            onChange={(e) => setAdding(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Add something to remember…"
            className="flex-1 rounded-xl border border-brand-ink/20 bg-transparent px-4 py-2.5 outline-none focus:border-brand-ink"
          />
          <button onClick={add} className="rounded-xl bg-brand-ink px-4 py-2.5 text-brand-bg">
            + Add
          </button>
        </div>

        {loading ? (
          <p className="opacity-50">Loading…</p>
        ) : memories.length === 0 ? (
          <p className="opacity-50">Nothing yet — it&apos;ll remember things as you chat.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {memories.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 rounded-xl border border-brand-ink/15 px-4 py-3"
              >
                {editingId === m.id ? (
                  <>
                    <input
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(m.id)}
                      className="flex-1 bg-transparent outline-none"
                    />
                    <button onClick={() => saveEdit(m.id)} className="text-sm underline">
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{m.content}</span>
                    <button
                      onClick={() => {
                        setEditingId(m.id)
                        setEditText(m.content)
                      }}
                      className="text-sm opacity-60 hover:opacity-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      className="text-sm opacity-60 hover:opacity-100"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
