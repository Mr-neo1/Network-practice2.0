-- Network Zero2Hero: database setup for Supabase.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste this file > Run.
-- Safe to run again.

-- One row per user holding their whole progress document (the same JSON the app keeps in the browser).
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  -- A real progress document is a few hundred KB at most; this stops anyone parking large blobs here.
  constraint progress_size check (octet_length(data::text) < 2000000)
);

-- Row-level security: each signed-in user can read and write only their own row.
alter table public.progress enable row level security;

drop policy if exists "read own progress" on public.progress;
create policy "read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "insert own progress" on public.progress;
create policy "insert own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "update own progress" on public.progress;
create policy "update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "delete own progress" on public.progress;
create policy "delete own progress" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Guests (the anon role) get nothing.
revoke all on public.progress from anon;
grant select, insert, update, delete on public.progress to authenticated;
