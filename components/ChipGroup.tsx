type Props = {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
}

export function ChipGroup({ options, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((opt) => {
        const selected = value.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() =>
              onChange(selected ? value.filter((v) => v !== opt) : [...value, opt])
            }
            className={`rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 ${
              selected
                ? 'border-brand-ink bg-brand-ink text-brand-bg shadow-sm'
                : 'border-brand-ink/15 bg-brand-bg hover:border-brand-ink/40 hover:shadow-sm'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
