import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: soandso } = await supabase
    .from('soandso')
    .select('id')
    .eq('user_id', user.id)
    .single()
  redirect(soandso ? '/chat' : '/onboarding')
}
