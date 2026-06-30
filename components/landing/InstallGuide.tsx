'use client'

import { useState } from 'react'

type Platform = 'ios' | 'android'

const STEPS: Record<Platform, { label: string; steps: string[] }> = {
  ios: {
    label: 'iPhone / iPad',
    steps: [
      'Open So&So in Safari.',
      'Tap the Share button (the square with an upward arrow).',
      'Scroll down and tap “Add to Home Screen.”',
      'Tap “Add” — So&So now lives on your home screen like an app.',
    ],
  },
  android: {
    label: 'Android',
    steps: [
      'Open So&So in Chrome.',
      'Tap the ⋮ menu in the top-right corner.',
      'Tap “Add to Home screen” (or “Install app”).',
      'Confirm — So&So appears on your home screen like an app.',
    ],
  },
}

export function InstallGuide() {
  const [platform, setPlatform] = useState<Platform>('ios')
  const active = STEPS[platform]

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Pill tabs */}
      <div className="mx-auto inline-flex rounded-full border border-brand-ink/15 p-1">
        {(Object.keys(STEPS) as Platform[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              platform === p ? 'bg-brand-ink text-brand-bg' : 'opacity-60 hover:opacity-100'
            }`}
          >
            {STEPS[p].label}
          </button>
        ))}
      </div>

      <ol className="mt-7 flex flex-col gap-4 text-left">
        {active.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-brand-ink/25 font-display text-sm">
              {i + 1}
            </span>
            <span className="pt-0.5 text-sm opacity-80">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
