import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getModel } from '@/lib/model'

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { url } = (await req.json()) as { url: string }
  if (!url?.startsWith('http')) return NextResponse.json({ error: 'invalid url' }, { status: 400 })

  let text = ''
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'SoAndSo/1.0' } })
    text = htmlToText(await res.text())
  } catch {
    return NextResponse.json({ error: 'could not fetch url' }, { status: 502 })
  }

  const model = getModel()
  const result = await model.chat({
    system: 'Summarize the following web page in 3-4 concise sentences. Be factual and neutral.',
    memories: [],
    history: [],
    message: text || url,
    escalate: false,
  })
  return NextResponse.json({ summary: result.content })
}
