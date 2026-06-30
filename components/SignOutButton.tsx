'use client'

import { createClient } from '@/lib/supabase/client'

export function SignOutButton({ className }: { className?: string }) {
  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.assign('/')
  }
  return (
    <button type="button" onClick={signOut} className={className}>
      Sign out
    </button>
  )
}
