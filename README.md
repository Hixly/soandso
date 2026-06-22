# So&So

**Not a smarter AI — yours.**

A personal AI chatbot a non-technical person can deeply customize in about 90 seconds. You shape it with sliders (never a prompt box), it remembers you across sessions, pulls live web sources when a question needs them, and can take three small actions: save a reminder, summarize a pasted URL, and draft a message.

## Runs keyless

The whole app builds, runs, and demos **without any model API key**. When `GEMINI_API_KEY` is unset, the model adapter (`lib/model.ts`) uses a deterministic **mock backend** so onboarding, chat, memory, and the 3 actions all work. Drop in a key and it switches to live Gemini with **no code changes**.

- **Default model:** `gemini-3.1-flash-lite` (cost-efficient — most turns + the classifier)
- **Escalation model:** `gemini-3.5-flash` (hard / multi-step questions)
- **Web search:** native Google Search grounding (live key only)

Override model IDs via `GEMINI_MODEL_DEFAULT` / `GEMINI_MODEL_ESCALATE` if the slugs differ in Google AI Studio.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind (antique-white `#FAEBD7` theme) · Supabase (Postgres + magic-link Auth + RLS) · `@google/genai` · Vitest.

## Local development

1. `npm install`
2. Create a Supabase project and run `supabase/migrations/0001_init.sql` (SQL editor or `supabase db push`).
3. Copy `.env.local.example` → `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required — DB + auth)
   - `GEMINI_API_KEY` (optional — omit to run in mock mode)
4. In Supabase Auth settings, add `http://localhost:3000/auth/callback` to the redirect allowlist.
5. `npm run dev` → http://localhost:3000

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build (also lints + typechecks)
- `npm test` — Vitest unit tests
- `npm run test:watch` — watch mode

## Screens

Onboarding (5-step wizard, the line-art face wakes up as you go) · Chat (thread + source cards) · Memory (editable) · Tune (re-shape name/job/personality anytime).
