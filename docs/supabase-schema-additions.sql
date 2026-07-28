-- Run this in your Supabase project's SQL editor.
-- Adds real, persistent community posts backing the Community view in
-- app/WavefrontApp.tsx, replacing the three hardcoded sample posts that
-- previously lived only in local React state (and vanished on refresh).

create table if not exists public.puzzle_community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  title text not null,
  category text not null,
  replies integer not null default 0,
  rating numeric,
  status text not null default 'pending_review' check (status in ('pending_review', 'published', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.puzzle_community_posts enable row level security;

-- Anyone (including signed-out visitors) can read the community feed.
create policy "community posts are publicly readable"
  on public.puzzle_community_posts
  for select
  using (true);

-- Signed-in users can submit a post as themselves.
create policy "authenticated users can submit their own posts"
  on public.puzzle_community_posts
  for insert
  with check (auth.uid() = user_id);

-- Notes:
-- * `replies` and `rating` intentionally start at 0 / null for every real post
--   and are not currently incremented by any UI — there is no threaded-reply
--   or rating system built yet. Do not seed fake values here; a post with
--   0 replies and no rating is the honest state until that feature exists.
-- * `status` starts at 'pending_review'. The current UI shows every post in
--   the feed regardless of status with an "Awaiting review" badge on
--   non-published ones, since there is no moderation/admin UI yet to flip
--   a post to 'published' or 'rejected'. If you want posts fully hidden
--   until reviewed, that moderation UI needs to be built first.
