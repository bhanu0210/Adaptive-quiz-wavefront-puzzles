-- Run this in your Supabase project's SQL editor.
--
-- Root cause of "permission denied for table puzzle_community_posts"
-- (and the same failure on cycle proposals, comments, trial views, etc.):
-- Row Level Security policies only decide WHICH ROWS a role can touch.
-- Postgres separately requires the role to hold baseline table-level
-- GRANTs (SELECT/INSERT/UPDATE/DELETE) before RLS is even consulted.
-- Supabase's table editor UI grants these automatically when you create
-- a table there, but tables created directly through the SQL editor
-- (as every table added in this project's docs/*.sql files was) do not
-- get that automatic grant on every project. RLS policies were correct
-- the whole time -- the tables were just never made reachable at all.
--
-- These GRANTs are additive and idempotent: running this does not change
-- who can do what beyond what each table's existing RLS policies already
-- allow -- it only unblocks the role from reaching those policies.

grant usage on schema public to anon, authenticated;

-- Community feed: publicly readable, write as yourself, admin deletes any
-- (delete is broad here on purpose -- the RLS policy from
-- supabase-community-overhaul.sql restricts actual deletes to the admin).
grant select on public.puzzle_community_posts to anon, authenticated;
grant insert, delete on public.puzzle_community_posts to authenticated;

-- Cycle proposals: never public; owner + admin only, per its RLS policies.
grant select, insert on public.puzzle_cycle_submissions to authenticated;
grant update, delete on public.puzzle_cycle_submissions to authenticated;

-- Community comments: publicly readable, write as yourself, author/admin delete.
grant select on public.puzzle_community_comments to anon, authenticated;
grant insert, delete on public.puzzle_community_comments to authenticated;

-- Free-trial puzzle views: read/write your own rows only (upsert needs both).
grant select, insert, update on public.puzzle_trial_views to authenticated;

-- Puzzle feedback: submit your own, admin reads/deletes.
grant select, insert, delete on public.puzzle_feedback to authenticated;

-- Difficulty ratings: upsert your own rating.
grant select, insert, update on public.puzzle_difficulty_ratings to authenticated;
