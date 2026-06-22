import type { Source } from '@/lib/types'

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function SourceCards({ sources }: { sources: Source[] | null }) {
  if (!sources?.length) return null
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {sources.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-[14rem] rounded-lg border border-brand-ink/20 px-3 py-1.5 text-xs hover:border-brand-ink"
        >
          <span className="block truncate font-medium">{s.title}</span>
          <span className="opacity-60">{hostname(s.url)}</span>
        </a>
      ))}
    </div>
  )
}
