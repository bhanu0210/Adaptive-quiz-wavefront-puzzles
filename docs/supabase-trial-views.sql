-- Run this in your Supabase project's SQL editor.
--
-- Tracks which puzzles a free (non-subscriber) account has ever opened,
-- independent of whether they solved it. Backs the free-trial cap in
-- app/WavefrontApp.tsx: each account may open up to FREE_TRIAL_SOLVES_PER_CATEGORY
-- (currently 2) distinct puzzles per category without a subscription. Without
-- this table, the cap could only count SOLVED puzzles, which let a free
-- account read more than 2 question texts per category by answering
-- incorrectly on purpose (wrong answers were never persisted anywhere).
-- This closes that gap by recording every open, right or wrong.

create table if not exists public.puzzle_trial_views (
  user_id uuid not null,
  puzzle_id text not null,
  opened_at timestamptz not null default now(),
  primary key (user_id, puzzle_id)
);

alter table public.puzzle_trial_views enable row level security;

create policy "users can view their own trial views" on public.puzzle_trial_views
  for select using (auth.uid() = user_id);

create policy "users can record their own trial views" on public.puzzle_trial_views
  for insert with check (auth.uid() = user_id);

create policy "users can update their own trial views" on public.puzzle_trial_views
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
