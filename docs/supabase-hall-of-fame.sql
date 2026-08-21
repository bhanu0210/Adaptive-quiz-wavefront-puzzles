-- Run this in your Supabase project's SQL editor, AFTER
-- docs/supabase-cycle-rewards.sql and docs/supabase-leaderboard-cycle-scope.sql
-- have already been run.
--
-- ============================================================
-- WHAT THIS ANSWERS
-- ============================================================
-- docs/PUZZLE-ROTATION.md flagged an open question: "what should happen
-- to whoever's in the top 10 at the moment of reset?" This is the answer
-- -- a permanent Hall of Fame, separate from the live leaderboard.
--
-- The live puzzle_leaderboard() RPC is intentionally scoped to whichever
-- cycle is currently open, so a solver's name drops off it the moment
-- their cycle closes and no new solves have landed in the next one. That
-- reset is correct behaviour for the LIVE board, but it means a genuinely
-- strong result from a past cycle otherwise leaves no visible trace.
--
-- docs/supabase-cycle-rewards.sql already writes a permanent snapshot of
-- every real user's rank/score at the moment each cycle closes into
-- puzzle_cycle_rankings (see admin_reset_cycle_leaderboard) -- this file
-- adds no new tables and touches no existing data, it just reads that
-- table with a different lens: everyone who was ever ranked 1-10 at a
-- cycle close, aggregated across every closed cycle they ever placed in.
--
-- ============================================================
-- WHAT IT SHOWS PER SOLVER
-- ============================================================
-- best_rank            -- the best (lowest) rank they ever achieved
-- top10_appearances     -- how many cycles they closed out in the top 10
-- most_recent_cycle     -- the most recent cycle they placed in
-- best_score            -- their score in whichever cycle produced best_rank
--
-- This is a recognition record, independent of the weekly-reward and
-- long-streak-bonus eligibility rules (those still require an active
-- pass at close time, per admin_reset_cycle_leaderboard) -- someone can
-- appear here without ever having been subscribed.

create or replace function public.puzzle_hall_of_fame()
returns table (
  user_id uuid,
  display_name text,
  best_rank integer,
  top10_appearances integer,
  most_recent_cycle integer,
  best_score numeric
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    ranked.user_id,
    coalesce(pr.display_name, 'Solver') as display_name,
    ranked.best_rank,
    ranked.top10_appearances,
    ranked.most_recent_cycle,
    ranked.best_score
  from (
    select
      r.user_id,
      min(r.rank) as best_rank,
      count(*) as top10_appearances,
      max(r.cycle_number) as most_recent_cycle,
      -- score in the specific cycle where the best (lowest) rank happened,
      -- not just the highest score they ever posted in any top-10 cycle
      (array_agg(r.score order by r.rank asc))[1] as best_score
    from public.puzzle_cycle_rankings r
    where r.rank <= 10
    group by r.user_id
  ) ranked
  left join public.puzzle_profiles pr on pr.user_id = ranked.user_id
  order by ranked.best_rank asc, ranked.top10_appearances desc
  limit 50;
$$;

-- Same visibility as the live leaderboard: a permanent honors list is
-- meant to be seen by everyone, signed in or not.
grant execute on function public.puzzle_hall_of_fame() to authenticated, anon;
