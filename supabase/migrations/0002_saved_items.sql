-- User-curated "Saved" collection: snippets the user explicitly asks So&So to
-- keep mid-chat ("save this as a recipe"). Distinct from auto-extracted memories.
create table saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  label text not null default 'Saved',     -- user-named category ("Recipe", "Ideas")
  user_message text,                        -- the prompt that led to the saved reply
  assistant_message text not null,          -- the reply being saved
  created_at timestamptz default now()
);

create index saved_items_user_idx on saved_items (user_id, created_at desc);

alter table saved_items enable row level security;
create policy "own saved_items" on saved_items for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
