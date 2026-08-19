-- Run this in your Supabase project's SQL editor, AFTER
-- docs/supabase-cycle-rewards.sql has already been run.
--
-- ============================================================
-- THE GAP THIS CLOSES
-- ============================================================
-- app/WavefrontApp.tsx calls `supabase.rpc("puzzle_leaderboard")` with no
-- arguments to populate the live Leaderboard page. That function is NOT
-- defined anywhere in this repo -- it was created directly in the Supabase
-- SQL editor at some earlier point, and its actual definition has never
-- been visible from any session working in this codebase. A comment left
-- in WavefrontApp.tsx (near the puzzle_progress/puzzle_solve_scores
-- upsert) records the working assumption that it "most likely reads from
-- puzzle_progress" -- i.e. ALL solves ever, with no notion of which
-- rotation cycle a puzzle belonged to.
--
-- Meanwhile docs/supabase-cycle-rewards.sql already built real cycle
-- infrastructure: puzzle_cycles, puzzle_cycle_puzzles, and the
-- admin_reset_cycle_leaderboard() function that correctly computes each
-- user's score for a CLOSING cycle (scoped to that cycle's 90 puzzle ids
-- + that cycle's daily-brief date window) and writes it to
-- puzzle_cycle_rankings as a permanent historical snapshot. But nothing
-- in that file touches whatever the LIVE leaderboard actually reads from.
-- So even after an admin runs "Close cycle & apply rewards" in the Admin
-- panel, the live board a visitor sees would keep counting every solve
-- ever made, including puzzles that retired to the Archive cycles ago --
-- it never "resets."
--
-- This file redefines puzzle_leaderboard() itself to be dynamically
-- scoped to whichever cycle is currently open (puzzle_cycles.ended_at is
-- null), using the exact same scoring formula as
-- admin_reset_cycle_leaderboard: puzzle_solve_scores for puzzles in that
-- cycle's roster, plus puzzle_daily_points within that cycle's date
-- window. This is a "scope by cycle," not a "delete old data" fix, per
-- the design already described in docs/PUZZLE-ROTATION.md's Leaderboard
-- reset note -- nothing in puzzle_solve_scores/puzzle_progress is
-- touched or deleted, every past cycle's numbers stay intact forever in
-- puzzle_cycle_rankings, and the live board simply becomes a live view
-- of "whichever cycle is open right now" instead of "all time."
--
-- Because the function's return type may change from whatever it
-- currently is, this must DROP the old definition first -- Postgres will
-- not let you change a function's return columns with a plain
-- `create or replace`.
--
-- ============================================================
-- REQUIRED FOLLOW-UP AFTER RUNNING THIS FILE (do this too, or the board
-- will show nothing rather than something wrong):
-- ============================================================
-- If puzzle_cycles has never been populated (neither Cycle 1 nor Cycle 2
-- has ever been registered -- entirely possible, since no session has
-- had credentials to click this), this function falls back to the OLD
-- all-time behavior rather than returning an empty board, so nothing
-- regresses the moment this file is run.
--
-- To actually start the per-cycle scoping, sign in as the admin and, on
-- the Admin tab, click "Register current cycle" once (it calls
-- admin_register_cycle with Cycle 2's live 90 puzzle ids -- see
-- registerCurrentCycle() in app/WavefrontApp.tsx). From that moment on,
-- puzzle_leaderboard() will scope to Cycle 2 only, and every future
-- rotation's "Close cycle & apply rewards" click will roll it forward
-- automatically -- no further manual leaderboard steps needed after this
-- one-time setup.

drop function if exists public.puzzle_leaderboard() cascade;

create or replace function public.puzzle_leaderboard()
returns table (
  user_id uuid,
  display_name text,
  score numeric,
  solved_count integer
)
language plpgsql
stable
security definer
as $$
declare
  v_open_cycle integer;
  v_cycle_start date;
begin
  select cycle_number, started_at into v_open_cycle, v_cycle_start
  from public.puzzle_cycles
  where ended_at is null
  order by cycle_number desc
  limit 1;

  -- No cycle has ever been registered yet (e.g. this file was just run,
  -- and nobody has clicked "Register current cycle" in the Admin panel).
  -- Fall back to the pre-existing all-time behavior rather than showing
  -- an empty board -- see the follow-up note above.
  if v_open_cycle is null then
    return query
      select
        p.user_id,
        coalesce(pr.display_name, 'Solver') as display_name,
        sum(p.points)::numeric as score,
        count(*)::integer as solved_count
      from public.puzzle_solve_scores p
      left join public.puzzle_profiles pr on pr.user_id = p.user_id
      group by p.user_id, pr.display_name
      order by score desc
      limit 100;
    return;
  end if;

  -- The open cycle has no end date yet by definition (that's what makes
  -- it "open"), so its daily-points window simply runs from its start
  -- through today, inclusive.
  return query
    select
      combined.user_id,
      coalesce(pr.display_name, 'Solver') as display_name,
      sum(combined.points)::numeric as score,
      count(*) filter (where combined.source = 'puzzle')::integer as solved_count
    from (
      select s.user_id, s.points, 'puzzle' as source
      from public.puzzle_solve_scores s
      where s.puzzle_id in (
        select puzzle_id from public.puzzle_cycle_puzzles where cycle_number = v_open_cycle
      )
      union all
      select d.user_id, d.points, 'daily' as source
      from public.puzzle_daily_points d
      where d.puzzle_date >= v_cycle_start and d.puzzle_date <= current_date
    ) combined
    left join public.puzzle_profiles pr on pr.user_id = combined.user_id
    group by combined.user_id, pr.display_name
    order by score desc
    limit 100;
end;
$$;

-- Match the grant pattern already used for the site's other public
-- read-only aggregate RPC (puzzle_difficulty_ratings_summary in
-- docs/supabase-difficulty-remap.sql). The leaderboard is visible to
-- everyone, signed in or not, so both roles need execute.
grant execute on function public.puzzle_leaderboard() to authenticated, anon;
