-- Run this in your Supabase project's SQL editor.
--
-- Closes a real product gap: docs/supabase-community-overhaul.sql already
-- gave community posts a `status` column ('pending_review' / 'published' /
-- 'rejected') and its own comment says outright "there is no moderation/
-- admin UI yet to flip a post to published or rejected." The Admin tab's
-- Community panel now has Publish/Reject buttons wired to exactly that, but
-- they need a grant + RLS policy that never existed, since only INSERT and
-- DELETE were ever granted on this table (see docs/supabase-grants-fix.sql).
-- Without this, clicking Publish/Reject fails silently under RLS.

grant update on public.puzzle_community_posts to authenticated;

drop policy if exists "admin can update any community post status" on public.puzzle_community_posts;
create policy "admin can update any community post status"
  on public.puzzle_community_posts
  for update
  using (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com')
  with check (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');
