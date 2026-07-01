'use client'

import { useState } from 'react'
import { ComposerPrimitive, MessagePrimitive, ThreadPrimitive } from '@assistant-ui/react'

// Small source-link card, rendered for each grounding citation (source-url part).
function SourceLink({ url, title }: { url?: string; title?: string }) {
  if (!url) return null
  let host = url
  try {
    host = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    // keep raw url as the label fallback
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center gap-1 truncate rounded-lg border border-brand-ink/15 bg-brand-bg px-2.5 py-1 text-xs opacity-80 transition-opacity hover:opacity-100"
    >
      <span className="truncate">{title || host}</span>
    </a>
  )
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end">
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-brand-ink px-4 py-2.5 text-sm text-brand-bg">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  )
}

// The So&So "thinking" state: the onboarding heart, drawn small and gently beating
// while the assistant composes a reply. Shown via the empty-message slot.
const HEART_SIDE =
  'M160,248 C142,212 106,188 98,150 C92,118 108,92 132,92 C149,92 158,104 160,118'

const THINKING_WORDS = [
  'thinking…',
  'pondering…',
  'mulling it over…',
  'gathering thoughts…',
  'finding the words…',
  'one sec…',
  'putting it together…',
  'reflecting…',
  'considering…',
  'noodling on it…',
]

function ThinkingHeart() {
  const [word] = useState(() => THINKING_WORDS[Math.floor(Math.random() * THINKING_WORDS.length)])
  return (
    <span className="inline-flex items-center gap-2 text-xs italic opacity-60">
      <svg
        className="soandso-thinking"
        width="22"
        height="22"
        viewBox="0 0 320 300"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={HEART_SIDE} />
        <path d={HEART_SIDE} transform="translate(320,0) scale(-1,1)" />
      </svg>
      {word}
    </span>
  )
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex flex-col items-start gap-2">
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-brand-ink/5 px-4 py-2.5 text-sm">
        <MessagePrimitive.Parts
          components={{
            Source: ({ url, title }) => <SourceLink url={url} title={title} />,
            Empty: ThinkingHeart,
          }}
          // Source citations legitimately land after the text part; without this,
          // assistant-ui re-shows the "thinking" fallback whenever a message ends
          // on a non-text part (i.e. every grounded reply with citations).
          unstable_showEmptyOnNonTextEnd={false}
        />
      </div>
    </MessagePrimitive.Root>
  )
}

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex flex-1 flex-col">
      <ThreadPrimitive.Viewport className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
        <ThreadPrimitive.Messages
          components={{ UserMessage, AssistantMessage }}
        />
        <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mt-auto bg-brand-bg pb-3 pt-2">
          <ComposerPrimitive.Root className="flex w-full items-end gap-2">
            <ComposerPrimitive.Input
              placeholder="Message your So&So…"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 text-base outline-none focus:border-brand-ink"
            />
            <ComposerPrimitive.Send className="flex size-11 items-center justify-center rounded-xl bg-brand-ink text-brand-bg disabled:opacity-40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  )
}
