'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrandLogo } from '@/components/BrandLogo'
import { ReversibleMark } from '@/components/ReversibleMark'
import { ProgressDots } from '@/components/ProgressDots'
import { ChipGroup } from '@/components/ChipGroup'
import { PersonalitySliders } from '@/components/PersonalitySliders'
import { TonePreview } from '@/components/TonePreview'
import { surpriseName, NAMES } from '@/lib/names'
import type { Personality } from '@/lib/types'

const JOBS = [
  'Stay on my goals',
  'Help me write',
  'Talk things through',
  'Answer my questions',
  'Keep me organized',
  'Something else',
]

const NAME_HINTS = NAMES
const PRIMARY =
  'rounded-2xl bg-brand-ink px-8 py-3.5 text-sm font-semibold tracking-wide text-brand-bg shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:hover:shadow-sm'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [jobs, setJobs] = useState<string[]>([])
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
      body: JSON.stringify({ jobs, jobCustom, name, personality, goal, keepInMind }),
    })
    if (res.ok) router.push('/chat')
    else setSubmitting(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-6 pt-[14vh] text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        {step === 0 ? (
          <BrandLogo width={160} />
        ) : (
          <ReversibleMark progress={step / 5} name={step >= 2 && name ? name : undefined} size={160} />
        )}
        <ProgressDots step={step} />

        {step === 0 && (
          <>
            <div className="space-y-3">
              <h1 className="font-display text-3xl font-semibold tracking-tight">Let&apos;s build your So&amp;So.</h1>
              <p className="text-sm opacity-60">A chatbot that&apos;s actually yours. Takes about a minute.</p>
            </div>
            <button className={PRIMARY} onClick={next}>
              Start →
            </button>
          </>
        )}

      {step === 1 && (
        <>
          <h2 className="font-display text-2xl font-medium">What do you want your So&amp;So to help with?</h2>
          <ChipGroup options={JOBS} value={jobs} onChange={setJobs} />
          {jobs.includes('Something else') && (
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
            disabled={jobs.length === 0 || (jobs.includes('Something else') && !jobCustom.trim())}
            onClick={next}
          >
            Next →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="font-display text-2xl font-medium">Give it a name.</h2>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${NAME_HINTS[hint]}…`}
            className="w-full max-w-sm rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 text-center text-lg outline-none focus:border-brand-ink"
          />
          <button
            className="text-xs font-medium uppercase tracking-widest opacity-50 transition-opacity hover:opacity-80"
            onClick={() => setName(surpriseName(name))}
          >
            Surprise me
          </button>
          <button className={PRIMARY} disabled={!name.trim()} onClick={next}>
            Next →
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="font-display text-2xl font-medium">How should it talk to you?</h2>
          <PersonalitySliders value={personality} onChange={setPersonality} />
          <TonePreview personality={personality} />
          <button className={PRIMARY} onClick={next}>
            Next →
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <h2 className="font-display text-2xl font-medium">
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
          <div className="flex items-center gap-5">
            <button
              className="text-xs font-medium uppercase tracking-widest opacity-50 transition-opacity hover:opacity-80"
              onClick={next}
            >
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
          <h2 className="font-display text-2xl font-medium">Meet {name}.</h2>
          <button className={PRIMARY} disabled={submitting} onClick={finish}>
            {submitting ? 'Waking up…' : `Start chatting →`}
          </button>
        </>
      )}
      </div>
    </main>
  )
}
