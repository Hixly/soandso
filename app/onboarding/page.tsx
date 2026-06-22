'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReversibleMark } from '@/components/ReversibleMark'
import { ProgressDots } from '@/components/ProgressDots'
import { ChipGroup } from '@/components/ChipGroup'
import { PersonalitySliders } from '@/components/PersonalitySliders'
import { TonePreview } from '@/components/TonePreview'
import { surpriseName } from '@/lib/names'
import type { Personality } from '@/lib/types'

const JOBS = [
  'Stay on my goals',
  'Help me write',
  'Talk things through',
  'Answer my questions',
  'Keep me organized',
  'Something else',
]

const NAME_HINTS = ['Sage', 'Coach', 'Buddy', 'So&So']
const CENTER = 'flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center'
const PRIMARY = 'rounded-xl bg-brand-ink px-6 py-3 font-medium text-brand-bg disabled:opacity-40'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [job, setJob] = useState<string | null>(null)
  const [jobCustom, setJobCustom] = useState('')
  const [name, setName] = useState('')
  const [personality, setPersonality] = useState<Personality>({
    gentle_blunt: 50,
    chill_energy: 50,
    brief_detailed: 50,
  })
  const [goal, setGoal] = useState('')
  const [keepInMind, setKeepInMind] = useState('')
  const [hint, setHint] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % NAME_HINTS.length), 1500)
    return () => clearInterval(id)
  }, [])

  const next = () => setStep((s) => s + 1)

  async function finish() {
    setSubmitting(true)
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job, jobCustom, name, personality, goal, keepInMind }),
    })
    if (res.ok) router.push('/chat')
    else setSubmitting(false)
  }

  return (
    <main className={CENTER}>
      <ProgressDots step={step} />
      <ReversibleMark progress={step / 5} name={step >= 2 && name ? name : undefined} />

      {step === 0 && (
        <>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Let&apos;s build your So&amp;So.</h1>
            <p className="opacity-70">A chatbot that&apos;s actually yours. Takes about a minute.</p>
          </div>
          <button className={PRIMARY} onClick={next}>
            Start →
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <h2 className="text-2xl font-medium">What do you want your So&amp;So to help with?</h2>
          <ChipGroup options={JOBS} value={job} onChange={setJob} />
          {job === 'Something else' && (
            <input
              autoFocus
              value={jobCustom}
              onChange={(e) => setJobCustom(e.target.value)}
              placeholder="Tell me in a few words…"
              className="w-full max-w-sm rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 text-center outline-none focus:border-brand-ink"
            />
          )}
          <button
            className={PRIMARY}
            disabled={!job || (job === 'Something else' && !jobCustom.trim())}
            onClick={next}
          >
            Next →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-medium">Give it a name.</h2>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${NAME_HINTS[hint]}…`}
            className="w-full max-w-sm rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 text-center text-lg outline-none focus:border-brand-ink"
          />
          <button className="text-sm underline opacity-70" onClick={() => setName(surpriseName())}>
            Surprise me
          </button>
          <button className={PRIMARY} disabled={!name.trim()} onClick={next}>
            Next →
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-2xl font-medium">How should it talk to you?</h2>
          <PersonalitySliders value={personality} onChange={setPersonality} />
          <TonePreview personality={personality} />
          <button className={PRIMARY} onClick={next}>
            Next →
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <h2 className="text-2xl font-medium">
            Last thing — tell your So&amp;So a little about you.
          </h2>
          <p className="opacity-60">(Optional)</p>
          <div className="flex w-full max-w-sm flex-col gap-3">
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What's your main goal right now?"
              className="rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 outline-none focus:border-brand-ink"
            />
            <input
              value={keepInMind}
              onChange={(e) => setKeepInMind(e.target.value)}
              placeholder="Anything it should always keep in mind?"
              className="rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 outline-none focus:border-brand-ink"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm underline opacity-70" onClick={next}>
              Skip
            </button>
            <button className={PRIMARY} onClick={next}>
              Next →
            </button>
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <h2 className="text-2xl font-medium">Meet {name}.</h2>
          <button className={PRIMARY} disabled={submitting} onClick={finish}>
            {submitting ? 'Waking up…' : `Start chatting →`}
          </button>
        </>
      )}
    </main>
  )
}
