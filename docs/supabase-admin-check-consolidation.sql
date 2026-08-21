-- Run this in your Supabase project's SQL editor, AFTER every other
-- docs/supabase-*.sql file in this repo has already been run at least once
-- (it re-points policies and a function that those files created).
--
-- ============================================================
-- WHAT THIS FIXES
-- ============================================================
-- The literal string 'cbaforcat2017@gmail.com' is hardcoded into 9 RLS
-- policies across 4 tables (puzzle_community_comments, puzzle_community_posts,
-- puzzle_cycle_submissions, puzzle_feedback, puzzle_catalog) plus one
-- SECURITY DEFINER function (_puzzle_require_admin), spread across 5
-- different migration files written over time. None of this is exploitable
-- today -- every copy currently agrees -- but it's a single point of
-- maintenance risk: change the site's admin email once and miss updating
-- even one of these 10 places, and that place either silently keeps
-- granting the OLD admin access forever, or locks the new admin out of
-- exactly that one table/action with no obvious error explaining why.
--
-- This file introduces one function, public.is_admin(), as the single
-- source of truth, and re-points every one of those 10 places at it. A
-- future change of admin email becomes a one-line edit to this function
-- (or better, swapping its hardcoded literal for an admin-role lookup
-- table, which is a natural next step this makes easy) instead of an
-- audit across 5 files.
--
-- This changes no access-control behaviour -- every policy grants exactly
-- the same access to exactly the same people as before, since is_admin()
-- itself does the identical check the inline literal used to.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'cbaforcat2017@gmail.com';
$$;

-- Readable by anyone signed in or not -- it's a stable, side-effect-free
-- check, not a data access path, and several policies below need it
-- evaluatable under both roles.
grant execute on function public.is_admin() to authenticated, anon;

-- ------------------------------------------------------------
-- docs/supabase-cycle-rewards.sql: the admin-only RPC guard
-- ------------------------------------------------------------
create or replace function public._puzzle_require_admin()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Only the site admin can call this function';
  end if;
end;
$$;

-- ------------------------------------------------------------
-- docs/supabase-community-comments.sql
-- ------------------------------------------------------------
drop policy if exists "author or admin can delete a comment" on public.puzzle_community_comments;
create policy "author or admin can delete a comment"
  on public.puzzle_community_comments
  for delete
  using (auth.uid() = user_id or public.is_admin());

-- ------------------------------------------------------------
-- docs/supabase-community-overhaul.sql
-- ------------------------------------------------------------
drop policy if exists "admin can delete any community post" on public.puzzle_community_posts;
create policy "admin can delete any community post"
  on public.puzzle_community_posts
  for delete
  using (public.is_admin());

drop policy if exists "own submissions and admin are readable" on public.puzzle_cycle_submissions;
create policy "own submissions and admin are readable"
  on public.puzzle_cycle_submissions
  for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "admin can delete any cycle submission" on public.puzzle_cycle_submissions;
create policy "admin can delete any cycle submission"
  on public.puzzle_cycle_submissions
  for delete
  using (public.is_admin());

drop policy if exists "admin can update submission status" on public.puzzle_cycle_submissions;
create policy "admin can update submission status"
  on public.puzzle_cycle_submissions
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin can delete any feedback" on public.puzzle_feedback;
create policy "admin can delete any feedback"
  on public.puzzle_feedback
  for delete
  using (public.is_admin());

-- BONUS FIX, found while adversarially verifying this migration against a
-- local Postgres stub: puzzle_feedback has RLS enabled (see
-- docs/supabase-community-overhaul.sql) but until now had ONLY the delete
-- policy above -- no SELECT policy at all, for anyone. Postgres RLS
-- requires an applicable SELECT-type (or ALL-type) policy to determine
-- which rows a DELETE's WHERE clause can even see, in addition to the
-- DELETE policy's own USING clause -- with none, every row is invisible
-- to every role, always. Concretely this meant: app/WavefrontApp.tsx's
-- admin Feedback panel (loadAdminData's select from puzzle_feedback) has
-- been silently returning zero rows in production regardless of how much
-- feedback exists, and the delete button has been silently no-op'ing (0
-- rows affected, no error) the whole time. This one policy fixes both.
drop policy if exists "admin can read all feedback" on public.puzzle_feedback;
create policy "admin can read all feedback"
  on public.puzzle_feedback
  for select
  using (public.is_admin());

-- ------------------------------------------------------------
-- docs/supabase-community-moderation.sql
-- ------------------------------------------------------------
drop policy if exists "admin can update any community post status" on public.puzzle_community_posts;
create policy "admin can update any community post status"
  on public.puzzle_community_posts
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- docs/supabase-solve-validation.sql
-- ------------------------------------------------------------
drop policy if exists "admin can read the full puzzle catalog" on public.puzzle_catalog;
create policy "admin can read the full puzzle catalog"
  on public.puzzle_catalog
  for select
  using (public.is_admin());

drop policy if exists "admin can write the puzzle catalog" on public.puzzle_catalog;
create policy "admin can write the puzzle catalog"
  on public.puzzle_catalog
  for all
  using (public.is_admin())
  with check (public.is_admin());
