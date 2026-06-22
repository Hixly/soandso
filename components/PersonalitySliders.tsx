import type { Personality } from '@/lib/types'

type Props = {
  value: Personality
  onChange: (value: Personality) => void
}

const ROWS: { key: keyof Personality; left: string; right: string }[] = [
  { key: 'gentle_blunt', left: 'Gentle', right: 'Blunt' },
  { key: 'chill_energy', left: 'Chill', right: 'High-energy' },
  { key: 'brief_detailed', left: 'Brief', right: 'Detailed' },
]

export function PersonalitySliders({ value, onChange }: Props) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {ROWS.map((row) => (
        <div key={row.key} className="flex flex-col gap-1">
          <div className="flex justify-between text-sm opacity-70">
            <span>{row.left}</span>
            <span>{row.right}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            aria-label={`${row.left} to ${row.right}`}
            value={value[row.key]}
            onChange={(e) => onChange({ ...value, [row.key]: Number(e.target.value) })}
            className="accent-brand-ink"
          />
        </div>
      ))}
    </div>
  )
}
