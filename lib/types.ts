export type Personality = { gentle_blunt: number; chill_energy: number; brief_detailed: number }

export type SoAndSo = {
  id: string; user_id: string; name: string; job: string
  personality: Personality; system_prompt: string; created_at: string
}

export type Memory = {
  id: string; user_id: string; content: string
  source: 'chat' | 'manual'; created_at: string
}

export type Source = { title: string; url: string }

export type Message = {
  id: string; user_id: string; role: 'user' | 'assistant'
  content: string; sources: Source[] | null; created_at: string
}

export type Reminder = {
  id: string; user_id: string; text: string
  due_at: string | null; done: boolean; created_at: string
}
