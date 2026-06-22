'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/BrandLogo'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <BrandLogo width={150} />
      <h1 className="text-2xl font-semibold tracking-tight">So&amp;So</h1>
      <p className="-mt-4 text-sm opacity-50">Not a smarter AI — yours.</p>
      {sent ? (
        <p className="max-w-sm text-center text-lg opacity-80">
          Check your email — we sent you a magic link to sign in.
        </p>
      ) : (
        <form onSubmit={sendLink} className="flex w-full max-w-sm flex-col gap-3">
          <label htmlFor="email" className="text-sm opacity-70">
            Sign in with your email
          </label>
          <input
            id="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 outline-none focus:border-brand-ink"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-brand-ink px-4 py-3 font-medium text-brand-bg disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </form>
      )}
    </main>
  )
}
