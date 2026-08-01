-- Run this in your Supabase project's SQL editor, AFTER
-- docs/supabase-community-overhaul.sql has already been run.
--
-- Implements real commenting on community posts. Previously the "replies"
-- number on each post was a static column that nothing ever wrote to --
-- there was no way to actually leave a reply. This adds a comments table
-- and keeps the post's replies count in sync automatically.

create table if not exists public.puzzle_community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.puzzle_community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists puzzle_community_comments_post_id_idx
  on public.puzzle_community_comments (post_id, created_at);

alter table public.puzzle_community_comments enable row level security;

-- Anyone who can see the community feed can read its comments.
drop policy if exists "comments are publicly readable" on public.puzzle_community_comments;
create policy "comments are publicly readable"
  on public.puzzle_community_comments
  for select
  using (true);

-- Signed-in users can comment as themselves.
drop policy if exists "authenticated users can comment as themselves" on public.puzzle_community_comments;
create policy "authenticated users can comment as themselves"
  on public.puzzle_community_comments
  for insert
  with check (auth.uid() = user_id);

-- The comment's own author, or the admin, can delete it.
drop policy if exists "author or admin can delete a comment" on public.puzzle_community_comments;
create policy "author or admin can delete a comment"
  on public.puzzle_community_comments
  for delete
  using (auth.uid() = user_id or auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');

-- Keep puzzle_community_posts.replies as a live count of this table, so the
-- existing "N replies" metric on each post stays accurate without the
-- frontend having to run a separate count query per post.
create or replace function public._sync_community_post_reply_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.puzzle_community_posts
  set replies = (
    select count(*) from public.puzzle_community_comments
    where post_id = coalesce(new.post_id, old.post_id)
  )
  where id = coalesce(new.post_id, old.post_id);
  return null;
end;
$$;

drop trigger if exists sync_community_post_reply_count on public.puzzle_community_comments;
create trigger sync_community_post_reply_count
  after insert or delete on public.puzzle_community_comments
  for each row
  execute function public._sync_community_post_reply_count();
