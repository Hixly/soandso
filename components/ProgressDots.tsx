type Props = { step: number; total?: number }

export function ProgressDots({ step, total = 5 }: Props) {
  return (
    <div className="flex items-center gap-3" aria-label={`Step ${step + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i <= step
              ? 'h-2 w-6 bg-brand-ink'
              : 'h-2 w-2 bg-brand-ink/20'
          }`}
        />
      ))}
    </div>
  )
}
