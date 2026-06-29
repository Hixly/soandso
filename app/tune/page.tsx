'use client'

import { useEffect, useState } from 'react'
import { PersonalitySliders } from '@/components/PersonalitySliders'
import { TonePreview } from '@/components/TonePreview'
import { BottomNav } from '@/components/BottomNav'
import type { Personality } from '@/lib/types'

export default function TunePage() {
  const [name, setName] = useState('')
  const [job, setJob] = useState('')
  const [personality, setPersonality] = useState<Personality>({
    gentle_blunt: 50,
    chill_energy: 50,
    brief_detailed: 50,
  })
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/tune')
      .then((r) => r.json())
      .then((d) => {
        if (d.soandso) {
          setName(d.soandso.name)
          setJob(d.soandso.job)
          setPersonality(d.soandso.personality)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  // Any edit drops the "Saved ✓" confirmation so it never lies about stale state.
  const edited = () => setStatus((s) => (s === 'saved' ? 'idle' : s))

  async function save() {
    setStatus('saving')
    try {
      const res = await fetch('/api/tune', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, job, personality }),
      })
      setStatus(res.ok ? 'saved' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <p className="m-auto opacity-50">Loading…</p>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-6">
        <h1 className="text-2xl font-semibold">Tune your So&amp;So</h1>

        <label className="flex flex-col gap-1 text-sm opacity-70">
          Name
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              edited()
            }}
            className="rounded-xl border border-brand-ink/20 bg-transparent px-4 py-2.5 text-base text-brand-ink outline-none focus:border-brand-ink"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm opacity-70">
          What it helps with
          <input
            value={job}
            onChange={(e) => {
              setJob(e.target.value)
              edited()
            }}
            className="rounded-xl border border-brand-ink/20 bg-transparent px-4 py-2.5 text-base text-brand-ink outline-none focus:border-brand-ink"
          />
        </label>

        <div className="flex flex-col items-center gap-4 pt-2">
          <PersonalitySliders
            value={personality}
            onChange={(p) => {
              setPersonality(p)
              edited()
            }}
          />
          <TonePreview personality={personality} />
        </div>

        <button
          onClick={save}
          disabled={status === 'saving' || status === 'saved'}
          className="rounded-xl bg-brand-ink px-6 py-3 font-medium text-brand-bg transition-opacity disabled:opacity-70"
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
        </button>
        {status === 'error' && (
          <p className="text-center text-sm text-red-700">Couldn&apos;t save — try again.</p>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
