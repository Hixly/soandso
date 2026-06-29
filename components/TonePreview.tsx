import { tonePreview } from '@/lib/prompt'
import type { Personality } from '@/lib/types'

export function TonePreview({ personality }: { personality: Personality }) {
  return (
    <p
      className="flex min-h-[3.5rem] max-w-sm items-center justify-center text-center text-lg italic opacity-80"
      aria-live="polite"
    >
      “{tonePreview(personality)}”
    </p>
  )
}
