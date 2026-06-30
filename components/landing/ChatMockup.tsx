import { LogoMark } from '@/components/LogoMark'

// A non-interactive preview of the real chat UI, so visitors see the product
// (and its personality + memory) before signing up. Styling mirrors the app.
export function ChatMockup() {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-brand-ink/15 bg-brand-bg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-ink/10 px-4 py-2.5">
        <LogoMark width={20} />
        <div className="flex gap-3 opacity-40">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11.5l9-8 9 8" />
            <path d="M5 10v10h5v-6h4v6h5V10" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 px-4 py-5 text-left text-sm">
        <div className="max-w-[85%] self-start rounded-2xl bg-brand-ink/5 px-4 py-2.5">
          Morning, Hix. You mentioned wanting to draft the investor email today — want to knock it
          out now?
        </div>
        <div className="max-w-[80%] self-end rounded-2xl bg-brand-ink px-4 py-2.5 text-brand-bg">
          yeah let’s do it
        </div>
        <div className="max-w-[85%] self-start rounded-2xl bg-brand-ink/5 px-4 py-2.5">
          On it — short and direct, the way you like. Here’s a first pass you can tweak…
        </div>
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 border-t border-brand-ink/10 px-4 py-3">
        <div className="flex-1 rounded-xl border border-brand-ink/15 px-4 py-2.5 text-sm opacity-40">
          Message your So&So…
        </div>
        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-ink/40 text-brand-bg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
