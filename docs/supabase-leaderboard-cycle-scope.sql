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
--
-- ============================================================
-- UPDATE (same day): a second bug found by actually clicking through
-- ============================================================
-- Both Admin-tab buttons -- "Register current cycle" and "Close cycle &
-- apply rewards" -- currently pass the exact same `currentCycle.cycleNumber`
-- from app/data/cycle-meta.ts (see registerCurrentCycle() and
-- resetCycleLeaderboard() in app/WavefrontApp.tsx). "Register current
-- cycle" is meant for one-time bootstrap (no cycle open yet); "Close
-- cycle & apply rewards" is meant for a LATER rotation, closing the
-- currently-open cycle to open a genuinely NEW one. But because there is
-- currently no "next" cycle number anywhere for the button to target,
-- clicking "Close cycle & apply rewards" right after "Register current
-- cycle" (as happened the first time this was tried) makes
-- admin_reset_cycle_leaderboard find Cycle 2 as the "open cycle to
-- close," then close IT with p_new_cycle_started_at as its own end date
-- -- a zero-length window, self-closing the cycle it just opened. With no
-- cycle left open, puzzle_leaderboard() correctly falls back to its
-- all-time safety net (see above), which looks exactly like the reset
-- never happened -- reproduced end-to-end against a local Postgres stub
-- before writing this fix.
--
-- The block below does three things in one pass:
--  1. REPAIRS a cycle that's already been self-closed this way (detected
--     by ended_at = started_at, which a real 14-day rotation can never
--     produce honestly) by reopening it.
--  2. REPAIRS the fallout: that same bad call already wrote a
--     puzzle_cycle_rankings snapshot row for that cycle number (a
--     meaningless zero-day "ranking" -- it isn't real history, it's
--     corrupted state). Left in place, it collides with a unique
--     constraint the NEXT time that cycle number is legitimately closed
--     for real, which was independently reproduced against the local
--     stub: a real future close-cycle call on the *next* rotation would
--     hard-crash with "duplicate key value violates unique constraint
--     puzzle_cycle_rankings_pkey" instead of completing. Deleting these
--     specific rows (matched only by the same self-closed signature) is
--     the one exception to "historical records are never deleted" from
--     docs/supabase-cycle-rewards.sql -- that principle is about real
--     history, and this was never real, it's the direct fallout of the
--     bug this file fixes.
--  3. Redefines admin_reset_cycle_leaderboard with a guard that refuses
--     to close a cycle into itself in the future, raising a clear error
--     instead of silently corrupting the cycle table -- so this can't
--     happen again even if both buttons get clicked back to back at the
--     next rotation too -- plus makes the rankings insert itself
--     idempotent as a second line of defense.
--
-- NOT automatically touched, on purpose: puzzle_reward_grants and
-- puzzle_reward_streaks. Those only change if a REAL user was actively
-- subscribed at the exact moment of the bad click, which is unlikely but
-- not zero (reward grants only fire for is_subscribed = true rows, per
-- admin_reset_cycle_leaderboard's own logic). Adjusting subscription
-- expiry dates or streak counts automatically, without full visibility
-- into who was affected, is exactly the kind of silent financial-state
-- change this codebase's own conventions warn against. After running
-- this file, manually check:
--   select * from public.puzzle_reward_grants where cycle_number = 2;
-- and reverse anything there by hand if it looks wrong (extend/shorten
-- the affected user's puzzle_subscriptions.current_period_end back to
-- what it should be) -- don't assume it's clean just because this file
-- doesn't touch it.

-- Step 1: reopen any self-closed cycle. Safe to run even if nothing
-- needs repairing (the WHERE clause only matches the exact signature).
update public.puzzle_cycles
set ended_at = null
where ended_at = started_at;

-- Step 2: delete the bogus zero-day ranking snapshot(s) this produced.
-- Anything in puzzle_cycle_rankings for a cycle_number that is (after
-- step 1) open again cannot be legitimate: real snapshots are only ever
-- written at the moment a cycle is actually, finally closed.
delete from public.puzzle_cycle_rankings
where cycle_number in (select cycle_number from public.puzzle_cycles where ended_at is null);

-- Step 2: the permanent guard.
create or replace function public.admin_reset_cycle_leaderboard(
  p_new_cycle_number integer,
  p_new_cycle_started_at date,
  p_new_cycle_puzzle_ids text[]
)
returns table (
  user_id uuid,
  rank integer,
  score numeric,
  was_subscribed boolean,
  weekly_days_granted integer,
  streak_after integer,
  streak_milestone_days_granted integer
)
language plpgsql
security definer
as $$
#variable_conflict use_column
declare
  v_closing_cycle integer;
  v_cycle_start date;
  v_cycle_end date;
  v_reset_time timestamptz := now();
  r record;
  v_current_end timestamptz;
  v_new_end timestamptz;
  v_streak_row public.puzzle_reward_streaks;
  v_milestone_days integer;
begin
  perform public._puzzle_require_admin();

  select cycle_number, started_at into v_closing_cycle, v_cycle_start
  from public.puzzle_cycles
  where ended_at is null
  order by cycle_number desc
  limit 1;

  if v_closing_cycle is null then
    raise exception 'No open cycle found. Call admin_register_cycle to bootstrap the first cycle before using this function.';
  end if;

  if v_closing_cycle = p_new_cycle_number then
    raise exception 'Cycle % is already the currently open cycle -- refusing to close it into itself. This almost always means "Register current cycle" was already clicked for this cycle. Only click "Close cycle & apply rewards" once a genuinely NEW cycle (a different, higher cycle_number with its own new puzzle roster) has actually been merged and deployed live.', v_closing_cycle;
  end if;

  v_cycle_end := p_new_cycle_started_at;

  update public.puzzle_cycles
  set ended_at = v_cycle_end
  where cycle_number = v_closing_cycle;

  create temporary table _cycle_score on commit drop as
  select combined.user_id, sum(combined.points)::numeric as total_score
  from (
    select s.user_id, s.points
    from public.puzzle_solve_scores s
    where s.puzzle_id in (
      select puzzle_id from public.puzzle_cycle_puzzles where cycle_number = v_closing_cycle
    )
    union all
    select d.user_id, d.points
    from public.puzzle_daily_points d
    where d.puzzle_date >= v_cycle_start and d.puzzle_date < v_cycle_end
  ) combined
  group by combined.user_id;

  create temporary table _cycle_ranked on commit drop as
  select
    c.user_id,
    c.total_score,
    row_number() over (order by c.total_score desc) as rnk,
    exists (
      select 1 from public.puzzle_subscriptions sub
      where sub.user_id = c.user_id
        and sub.status = 'active'
        and sub.current_period_end > v_reset_time
    ) as is_subscribed
  from _cycle_score c;

  insert into public.puzzle_cycle_rankings (cycle_number, user_id, score, rank, was_subscribed, eligible_for_reward)
  select v_closing_cycle, cr.user_id, cr.total_score, cr.rnk, cr.is_subscribed, (cr.rnk <= 10 and cr.is_subscribed)
  from _cycle_ranked cr
  on conflict (cycle_number, user_id) do nothing;

  create temporary table _grant_results (
    user_id uuid,
    rank integer,
    score numeric,
    was_subscribed boolean,
    weekly_days_granted integer default 0,
    streak_after integer default 0,
    streak_milestone_days_granted integer default 0
  ) on commit drop;

  for r in select * from _cycle_ranked loop
    insert into _grant_results (user_id, rank, score, was_subscribed) values (r.user_id, r.rnk, r.total_score, r.is_subscribed);

    if r.rnk <= 10 and r.is_subscribed then
      select current_period_end into v_current_end
      from public.puzzle_subscriptions where user_id = r.user_id;

      v_new_end := greatest(coalesce(v_current_end, v_reset_time), v_reset_time) + interval '7 days';

      update public.puzzle_subscriptions
      set current_period_end = v_new_end, status = 'active'
      where user_id = r.user_id;

      insert into public.puzzle_reward_grants (user_id, cycle_number, grant_type, days_granted, previous_period_end, new_period_end)
      values (r.user_id, v_closing_cycle, 'top10_weekly', 7, v_current_end, v_new_end);

      update _grant_results set weekly_days_granted = 7 where user_id = r.user_id;

      select * into v_streak_row from public.puzzle_reward_streaks where user_id = r.user_id;
      if not found then
        insert into public.puzzle_reward_streaks (user_id, current_streak, next_milestone)
        values (r.user_id, 1, 6)
        returning * into v_streak_row;
      else
        update public.puzzle_reward_streaks
        set current_streak = current_streak + 1, updated_at = v_reset_time
        where user_id = r.user_id
        returning * into v_streak_row;
      end if;

      update _grant_results set streak_after = v_streak_row.current_streak where user_id = r.user_id;

      if v_streak_row.current_streak >= v_streak_row.next_milestone then
        v_milestone_days := 365;

        select current_period_end into v_current_end
        from public.puzzle_subscriptions where user_id = r.user_id;

        v_new_end := greatest(coalesce(v_current_end, v_reset_time), v_reset_time) + (v_milestone_days || ' days')::interval;

        update public.puzzle_subscriptions
        set current_period_end = v_new_end
        where user_id = r.user_id;

        insert into public.puzzle_reward_grants (user_id, cycle_number, grant_type, days_granted, previous_period_end, new_period_end)
        values (r.user_id, v_closing_cycle, 'streak_milestone', v_milestone_days, v_current_end, v_new_end);

        update public.puzzle_reward_streaks
        set next_milestone = next_milestone + 6
        where user_id = r.user_id;

        update _grant_results set streak_milestone_days_granted = v_milestone_days where user_id = r.user_id;
      end if;
    else
      update public.puzzle_reward_streaks
      set current_streak = 0, next_milestone = 6, updated_at = v_reset_time
      where user_id = r.user_id and current_streak > 0;
    end if;
  end loop;

  perform public.admin_register_cycle(p_new_cycle_number, p_new_cycle_started_at, p_new_cycle_puzzle_ids);

  return query select * from _grant_results order by rank;
end;
$$;

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
