-- Run this in your Supabase project's SQL editor.
--
-- Permanently records the first time an account answers a puzzle
-- incorrectly. Backs two rules in app/WavefrontApp.tsx:
--   1. A puzzle you've ever gotten wrong scores zero points if you later
--      solve it correctly -- the correct answer and explanation are shown
--      immediately after a wrong attempt, so a later "correct" click isn't
--      really re-solving it, and awarding full points would make it free
--      points on demand.
--   2. The adaptive "next challenge" recommender excludes puzzles you've
--      gotten wrong from its automatic picks (falling back to them only if
--      every other puzzle has been touched), so a missed puzzle stops
--      being repeatedly auto-suggested.
-- Before this table, a wrong answer left no durable trace anywhere -- the
-- only per-solve table written was written exclusively on a correct solve,
-- so a page refresh silently erased any memory of a wrong attempt.

create table if not exists public.puzzle_wrong_attempts (
  user_id uuid not null references auth.users(id) on delete cascade,
  puzzle_id text not null,
  first_wrong_at timestamptz not null default now(),
  primary key (user_id, puzzle_id)
);

alter table public.puzzle_wrong_attempts enable row level security;

drop policy if exists "users can view their own wrong attempts" on public.puzzle_wrong_attempts;
create policy "users can view their own wrong attempts"
  on public.puzzle_wrong_attempts
  for select
  using (auth.uid() = user_id);

drop policy if exists "users can record their own wrong attempts" on public.puzzle_wrong_attempts;
create policy "users can record their own wrong attempts"
  on public.puzzle_wrong_attempts
  for insert
  with check (auth.uid() = user_id);

-- Table-level grants: RLS alone isn't enough (see docs/supabase-grants-fix.sql
-- for the full explanation) -- without this, every insert/select here would
-- fail with "permission denied for table puzzle_wrong_attempts".
grant usage on schema public to authenticated;
grant select, insert on public.puzzle_wrong_attempts to authenticated;
