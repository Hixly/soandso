-- So&So v1 schema. One So&So per user; memories, messages, reminders.
-- RLS on every table: a user can only touch rows where user_id = auth.uid().

create table soandso (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  name text not null,
  job text not null,
  personality jsonb not null,         -- {gentle_blunt, chill_energy, brief_detailed} 0-100
  system_prompt text not null,        -- generated deterministically from job + personality
  created_at timestamptz default now()
);

create table memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  content text not null,
  source text default 'chat',         -- 'chat' (auto-extracted) or 'manual'
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  role text not null,                 -- 'user' | 'assistant'
  content text not null,
  sources jsonb,                      -- [{title, url}] if grounding fired
  created_at timestamptz default now()
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  text text not null,
  due_at timestamptz,
  done boolean default false,
  created_at timestamptz default now()
);

-- Helpful read ordering for per-user history.
create index memories_user_created_idx on memories (user_id, created_at desc);
create index messages_user_created_idx on messages (user_id, created_at desc);

alter table soandso enable row level security;
alter table memories enable row level security;
alter table messages enable row level security;
alter table reminders enable row level security;

create policy "own soandso" on soandso for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own memories" on memories for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own messages" on messages for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own reminders" on reminders for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
