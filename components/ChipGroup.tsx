type Props = {
  options: string[]
  value: string | null
  onChange: (value: string) => void
}

export function ChipGroup({ options, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((opt) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              selected
                ? 'border-brand-ink bg-brand-ink text-brand-bg'
                : 'border-brand-ink/25 hover:border-brand-ink'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
