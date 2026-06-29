'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/BrandLogo'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)
    const supabase = createClient()

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      // If email confirmation is OFF, a session is returned immediately → go in.
      if (data.session) {
        window.location.assign('/')
        return
      }
      // Otherwise Supabase emailed a confirmation link.
      setInfo('Check your email to confirm your account, then sign in.')
      setMode('signin')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    // Full reload so server components pick up the new auth cookie.
    window.location.assign('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <BrandLogo width={150} />
      <h1 className="font-display text-2xl font-semibold tracking-tight">So&amp;So</h1>
      <p className="-mt-4 text-sm opacity-50">Not a smarter AI — yours.</p>

      <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-3">
        <label htmlFor="email" className="text-sm opacity-70">
          {mode === 'signin' ? 'Sign in to your So&So' : 'Create your So&So account'}
        </label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 outline-none focus:border-brand-ink"
        />
        <input
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'signup' ? 'Choose a password (6+ characters)' : 'Password'}
          className="rounded-xl border border-brand-ink/20 bg-transparent px-4 py-3 outline-none focus:border-brand-ink"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-ink px-4 py-3 font-medium text-brand-bg disabled:opacity-50"
        >
          {loading
            ? 'One sec…'
            : mode === 'signin'
              ? 'Sign in'
              : 'Create account'}
        </button>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {info && <p className="text-sm opacity-70">{info}</p>}
      </form>

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
          setError(null)
          setInfo(null)
        }}
        className="text-sm underline opacity-60 hover:opacity-100"
      >
        {mode === 'signin'
          ? "Don't have an account? Create one"
          : 'Already have an account? Sign in'}
      </button>
    </main>
  )
}
