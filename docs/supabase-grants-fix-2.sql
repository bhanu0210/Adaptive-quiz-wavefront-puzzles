-- Run this in your Supabase project's SQL editor.
--
-- Same root cause as docs/supabase-grants-fix.sql: RLS policies only
-- decide which ROWS a role can touch, but Postgres separately requires
-- the role to hold baseline table-level GRANTs before RLS is even
-- consulted. That first grants file covered the community/cycle/
-- comments/trial-views tables; this one covers the rest of the tables
-- the app reads and writes that were still missing them -- most
-- visibly puzzle_solve_scores, which is why a brand-new user saw
-- "Your solved puzzles could not be loaded" on the Paths page despite
-- having nothing to load yet: the SELECT itself was being rejected
-- before it ever got to return an empty list.
--
-- Purely additive and idempotent -- does not change which rows anyone
-- can touch (RLS still governs that), only unblocks the role from
-- reaching the RLS check in the first place. Safe to run more than once.

grant usage on schema public to anon, authenticated;

-- Solved-puzzle locking, scoring, streaks, and the weekly activity chart.
grant select, insert, update on public.puzzle_solve_scores to authenticated;

-- Legacy progress table -- still written alongside puzzle_solve_scores
-- because the live puzzle_leaderboard function (defined in Supabase,
-- outside this repo) reads from it.
grant select, insert, update on public.puzzle_progress to authenticated;

-- Per-category adaptive difficulty level.
grant select, insert, update on public.puzzle_adaptive_paths to authenticated;

-- Daily puzzle points/attempts: written by the solve-daily-puzzle edge
-- function under the service role (which already bypasses grants and
-- RLS), but read directly by the client to show today's totals.
grant select on public.puzzle_daily_points to authenticated;
grant select on public.puzzle_daily_attempts to authenticated;

-- Editable puzzle catalog: publicly readable, admin-only writes (RLS
-- restricts the actual insert/update to the admin; this only makes
-- the operation reachable).
grant select on public.puzzle_catalog to anon, authenticated;
grant insert, update on public.puzzle_catalog to authenticated;

-- Member profiles and subscription status.
grant select on public.puzzle_profiles to authenticated;
grant select on public.puzzle_subscriptions to authenticated;
