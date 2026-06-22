type Props = { step: number; total?: number }

export function ProgressDots({ step, total = 5 }: Props) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${step + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i <= step ? 'bg-brand-ink' : 'bg-brand-ink/25'
          }`}
        />
      ))}
    </div>
  )
}
