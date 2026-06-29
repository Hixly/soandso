import type { Personality } from '@/lib/types'

type Row = {
  key: keyof Personality
  left: string
  right: string
  // Five descriptors across the range, from low (0) to high (100).
  descriptors: [string, string, string, string, string]
}

const ROWS: Row[] = [
  {
    key: 'gentle_blunt',
    left: 'Gentle',
    right: 'Blunt',
    descriptors: [
      'Soft and nurturing — cushions everything kindly',
      'Warm and encouraging — leads with care',
      'Honest but kind — balanced and fair',
      'Direct and candid — says it straight',
      'Blunt and unfiltered — no sugarcoating',
    ],
  },
  {
    key: 'chill_energy',
    left: 'Chill',
    right: 'High-energy',
    descriptors: [
      'Calm and mellow — unhurried, low-key',
      'Easygoing — relaxed but present',
      'Steady and even — a measured pace',
      'Lively and upbeat — brings the momentum',
      'Energetic and hyped — full of spark',
    ],
  },
  {
    key: 'brief_detailed',
    left: 'Brief',
    right: 'Detailed',
    descriptors: [
      'Quick and to the point — bare essentials',
      'Concise — trimmed and tight',
      'Just enough — matches the moment',
      'Thorough — covers the bases',
      'Deep and comprehensive — every detail',
    ],
  },
]

function descriptorFor(row: Row, v: number): string {
  const i = Math.min(4, Math.floor(v / 20))
  return row.descriptors[i]
}

type Props = {
  value: Personality
  onChange: (value: Personality) => void
}

export function PersonalitySliders({ value, onChange }: Props) {
  return (
    <div className="flex w-full max-w-md flex-col gap-7">
      {ROWS.map((row) => {
        const v = value[row.key]
        return (
          <div key={row.key} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-50">
                {row.left}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest opacity-50">
                {row.right}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              aria-label={`${row.left} to ${row.right}`}
              value={v}
              onChange={(e) => onChange({ ...value, [row.key]: Number(e.target.value) })}
              className="soandso-slider"
            />
            <p
              className="flex min-h-[2.5rem] items-center justify-center text-center text-sm italic opacity-70"
              aria-live="polite"
            >
              {descriptorFor(row, v)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
