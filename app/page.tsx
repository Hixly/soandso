import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoMark } from '@/components/LogoMark'
import { SelfDrawingLogo } from '@/components/SelfDrawingLogo'
import { SignOutButton } from '@/components/SignOutButton'
import { SliderDemo } from '@/components/landing/SliderDemo'
import { ChatMockup } from '@/components/landing/ChatMockup'
import { InstallGuide } from '@/components/landing/InstallGuide'
import { Reveal } from '@/components/landing/Reveal'

const PILL_PRIMARY =
  'rounded-full bg-brand-ink px-7 py-3 text-sm font-semibold tracking-wide text-brand-bg shadow-sm transition-all hover:shadow-md active:scale-[0.98]'
const PILL_GHOST =
  'rounded-full border border-brand-ink/25 px-7 py-3 text-sm font-semibold tracking-wide transition-colors hover:border-brand-ink'
const PILL_SM =
  'rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-brand-bg transition-all hover:shadow-md active:scale-[0.98]'

const STEPS = [
  {
    n: '1',
    title: 'Shape it in ~90 seconds',
    body: 'No prompt boxes. Slide a few dials — gentle↔blunt, chill↔high-energy, brief↔detailed — give it a name, and your So&So comes to life.',
  },
  {
    n: '2',
    title: 'Talk like it’s yours',
    body: 'Chat naturally. It answers in the voice you tuned, and it actually remembers what matters about you between conversations.',
  },
  {
    n: '3',
    title: 'Keep what counts',
    body: 'Say “save this” or “bookmark this” to file an exchange. Ask it to remind you, or summarize a link. It quietly remembers you as you go.',
  },
]

const FEATURES = [
  ['Tuned, not prompted', 'Personality set by sliders — anyone can make it theirs in seconds.'],
  ['Real memory', 'It recalls your goals and details, and you can edit everything it knows.'],
  ['Saved & bookmarks', 'Curate the replies worth keeping into your own labeled collection.'],
  ['Helpful actions', 'Set reminders and summarize links right inside the conversation.'],
  ['Streaming answers', 'Powered by Google Gemini, replies stream in as it thinks.'],
  ['Truly personal', 'One So&So, yours alone — not a smarter AI, your AI.'],
]

const FAQS = [
  ['Do I need to know how to prompt?', 'No. You shape it with sliders and a name — never a blank prompt box. That’s the whole point.'],
  ['Who can see my conversations?', 'Only you. Each account’s chats and memories are private, protected by row-level security.'],
  ['Is it free?', 'Yes to start — it runs on Google Gemini’s free tier, which is plenty for personal use.'],
  ['Can I change its personality later?', 'Anytime. The Tune screen reopens the sliders so your So&So can grow with you.'],
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const headerCta = user ? (
    <>
      <Link href="/chat" className="px-3 py-2 text-sm font-medium opacity-80 hover:opacity-100">
        Open my So&So
      </Link>
      <SignOutButton className="px-3 py-2 text-sm font-medium opacity-60 hover:opacity-100" />
    </>
  ) : (
    <>
      <Link href="/auth" className="px-3 py-2 text-sm font-medium opacity-70 hover:opacity-100">
        Sign in
      </Link>
      <Link href="/auth?mode=signup" className={PILL_SM}>
        Get started
      </Link>
    </>
  )

  const heroCtas = user ? (
    <Link href="/chat" className={PILL_PRIMARY}>
      Open my So&So →
    </Link>
  ) : (
    <>
      <Link href="/auth?mode=signup" className={PILL_PRIMARY}>
        Get started
      </Link>
      <Link href="/auth" className={PILL_GHOST}>
        Sign in
      </Link>
    </>
  )

  return (
    <>
      {/* Header banner */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-ink/10 bg-brand-bg/85 px-5 py-3 backdrop-blur-sm sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="So&So home">
          <LogoMark width={22} />
          <span className="font-display text-lg font-semibold tracking-tight">So&amp;So</span>
        </Link>
        <nav className="flex items-center gap-2">{headerCta}</nav>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center">
        {/* Hero */}
        <SelfDrawingLogo width={120} />
        <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight">So&amp;So</h1>
        <p className="mt-3 text-lg opacity-60">Not a smarter AI — yours.</p>
        <p className="mt-5 max-w-xl text-balance text-base opacity-75">
          A personal AI you shape in under two minutes — it talks the way you want, remembers what
          matters, and keeps the things you tell it to.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{heroCtas}</div>

        {/* Manifesto */}
        <Reveal className="mt-28 w-full">
          <p className="mx-auto max-w-2xl text-balance font-display text-3xl font-medium leading-snug sm:text-4xl">
            Everyone’s handed the same assistant. Yours should actually know you.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-balance text-base opacity-65">
            So&So isn’t a smarter model — it’s one you shape, that remembers you, and sounds like
            someone you’d actually want to talk to.
          </p>
        </Reveal>

        {/* Product preview */}
        <Reveal className="mt-24 w-full">
          <h2 className="font-display text-2xl font-medium">See it in action</h2>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-65">
            Your So&So greets you by name, remembers what you’re working on, and answers in your
            tuned voice.
          </p>
          <div className="mt-8">
            <ChatMockup />
          </div>
        </Reveal>

        {/* Interactive demo */}
        <Reveal className="mt-24 w-full">
          <h2 className="font-display text-2xl font-medium">Make it sound like you.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-65">
            Drag a dial — this is exactly how you’ll shape your So&So. No prompting, ever.
          </p>
          <div className="mt-8">
            <SliderDemo />
          </div>
        </Reveal>

        {/* How it works */}
        <Reveal className="mt-24 w-full">
          <h2 className="font-display text-2xl font-medium">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-2 px-2">
                <span className="flex size-9 items-center justify-center rounded-full border border-brand-ink/25 font-display text-lg">
                  {s.n}
                </span>
                <h3 className="mt-1 font-medium">{s.title}</h3>
                <p className="text-sm opacity-65">{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Features */}
        <Reveal className="mt-24 w-full">
          <h2 className="font-display text-2xl font-medium">What it does</h2>
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            {FEATURES.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-brand-ink/15 px-5 py-4">
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm opacity-65">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal className="mt-24 w-full">
          <h2 className="font-display text-2xl font-medium">Good to know</h2>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
            {FAQS.map(([q, a]) => (
              <div key={q} className="border-b border-brand-ink/10 pb-4">
                <h3 className="font-medium">{q}</h3>
                <p className="mt-1 text-sm opacity-65">{a}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Bottom CTA */}
        <section className="mt-24 flex flex-col items-center gap-5">
          <h2 className="font-display text-2xl font-medium">Make one that’s yours.</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">{heroCtas}</div>
        </section>

        {/* Add to home screen */}
        <Reveal className="mt-24 w-full">
          <h2 className="font-display text-2xl font-medium">Keep it a tap away</h2>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-65">
            Add So&So to your home screen and it opens like a real app — full screen, no browser
            bars.
          </p>
          <div className="mt-8">
            <InstallGuide />
          </div>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-ink/10 px-6 py-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <LogoMark width={18} />
            <span className="text-sm opacity-60">So&amp;So — not a smarter AI, yours.</span>
          </div>
          <div className="flex items-center gap-5 text-sm opacity-60">
            <a
              href="https://github.com/Hixly/soandso"
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-100"
            >
              GitHub
            </a>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
