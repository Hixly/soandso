'use client'

import { useState } from 'react'
import { PersonalitySliders } from '@/components/PersonalitySliders'
import { TonePreview } from '@/components/TonePreview'
import type { Personality } from '@/lib/types'

// A live taste of the core idea, right on the landing page: drag the dials and
// watch the voice change. This is the exact component used in onboarding.
export function SliderDemo() {
  const [personality, setPersonality] = useState<Personality>({
    gentle_blunt: 35,
    chill_energy: 55,
    brief_detailed: 45,
  })
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-brand-ink/15 bg-brand-ink/[0.02] px-6 py-8">
      <PersonalitySliders value={personality} onChange={setPersonality} />
      <TonePreview personality={personality} />
    </div>
  )
}
