import type { Source } from '@/lib/types'
import { SourceCards } from './SourceCards'

type Props = {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[] | null
}

export function MessageBubble({ role, content, sources }: Props) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block whitespace-pre-wrap rounded-2xl px-4 py-2.5 ${
            isUser ? 'bg-brand-ink text-brand-bg' : 'bg-brand-ink/5'
          }`}
        >
          {content}
        </div>
        {!isUser && <SourceCards sources={sources ?? null} />}
      </div>
    </div>
  )
}
