'use client'

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

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex flex-col items-start gap-2">
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-brand-ink/5 px-4 py-2.5 text-sm">
        <MessagePrimitive.Parts
          components={{
            Source: ({ url, title }) => <SourceLink url={url} title={title} />,
          }}
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
              className="flex-1 resize-none rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-brand-ink"
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
