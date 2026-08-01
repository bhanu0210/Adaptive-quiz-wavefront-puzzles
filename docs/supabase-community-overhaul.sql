-- Run this in your Supabase project's SQL editor, AFTER
-- docs/supabase-schema-additions.sql has already been run.
--
-- Implements:
-- * Real puzzle fields (question/options/correct answer/explanation) on
--   community posts, optional -- a post can still just be a title/discussion.
-- * A separate, admin-only table for puzzles submitted specifically for
--   consideration in the next puzzle cycle. These are NEVER shown in the
--   public community feed -- only the submitter (their own rows) and the
--   site admin can read them.
-- * Admin-only delete rights on community posts, cycle submissions, and
--   puzzle_feedback (that last table predates this file and its existing
--   RLS is unknown from here, so this adds a delete policy for it too --
--   without one, the admin "delete feedback" button would fail silently).
-- * A hard cap of 100 rows in puzzle_community_posts -- once a 101st post
--   arrives, the oldest is deleted automatically.

-- ============================================================
-- 1. Extend puzzle_community_posts with optional puzzle fields
-- ============================================================
alter table public.puzzle_community_posts
  add column if not exists question text,
  add column if not exists options text[],
  add column if not exists correct_option integer,
  add column if not exists explanation text;

-- Admin-only delete (in addition to the existing public-select and
-- authenticated-insert-own policies from supabase-schema-additions.sql).
drop policy if exists "admin can delete any community post" on public.puzzle_community_posts;
create policy "admin can delete any community post"
  on public.puzzle_community_posts
  for delete
  using (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');

-- Cap the table at 100 rows: after each insert, delete the oldest rows
-- beyond the 100 most recent.
create or replace function public._trim_community_posts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.puzzle_community_posts
  where id in (
    select id from public.puzzle_community_posts
    order by created_at desc
    offset 100
  );
  return null;
end;
$$;

drop trigger if exists trim_community_posts on public.puzzle_community_posts;
create trigger trim_community_posts
  after insert on public.puzzle_community_posts
  for each statement
  execute function public._trim_community_posts();

-- ============================================================
-- 2. New table: puzzles submitted for next-cycle consideration
-- ============================================================
create table if not exists public.puzzle_cycle_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  title text not null,
  category text not null,
  question text not null,
  options text[] not null,
  correct_option integer not null,
  explanation text,
  status text not null default 'submitted' check (status in ('submitted', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.puzzle_cycle_submissions enable row level security;

-- The submitter can see their own submissions (to track status); the
-- admin can see all of them. Nobody else can read this table at all --
-- it never appears in the public community feed.
drop policy if exists "own submissions and admin are readable" on public.puzzle_cycle_submissions;
create policy "own submissions and admin are readable"
  on public.puzzle_cycle_submissions
  for select
  using (auth.uid() = user_id or auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');

drop policy if exists "authenticated users can submit their own puzzle" on public.puzzle_cycle_submissions;
create policy "authenticated users can submit their own puzzle"
  on public.puzzle_cycle_submissions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "admin can delete any cycle submission" on public.puzzle_cycle_submissions;
create policy "admin can delete any cycle submission"
  on public.puzzle_cycle_submissions
  for delete
  using (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');

drop policy if exists "admin can update submission status" on public.puzzle_cycle_submissions;
create policy "admin can update submission status"
  on public.puzzle_cycle_submissions
  for update
  using (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com')
  with check (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');

-- ============================================================
-- 3. Admin-only delete on puzzle_feedback (pre-existing table)
-- ============================================================
alter table public.puzzle_feedback enable row level security;

drop policy if exists "admin can delete any feedback" on public.puzzle_feedback;
create policy "admin can delete any feedback"
  on public.puzzle_feedback
  for delete
  using (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');
