-- Run this in your Supabase project's SQL editor, AFTER
-- docs/supabase-schema-additions.sql has already been run.
--
-- UPDATE: _puzzle_require_admin and admin_register_cycle now set
-- search_path = public, pg_temp. Without an explicit search_path, a
-- SECURITY DEFINER function resolves unqualified names using the
-- CALLER's search_path rather than a pinned one -- the standard Postgres
-- privilege-escalation vector for this function type. Both bodies already
-- qualify their own references with public., so this needed no logic
-- changes. (admin_reset_cycle_leaderboard, defined further down, gets the
-- same treatment in docs/supabase-leaderboard-cycle-scope.sql instead,
-- since that file already redefines it for the self-close guard --
-- whichever of these two files runs second is the one that "wins" and
-- both leave it correctly hardened either way.)
--
-- IMPORTANT: This has been exercised against a local PostgreSQL stub of
-- Supabase's auth schema (matching the exact column names/shapes already
-- used by app/WavefrontApp.tsx: puzzle_solve_scores, puzzle_daily_points,
-- puzzle_subscriptions), covering the ambiguous-column bug fix, streak
-- stacking across 6+ cycles, the milestone escalation (6 -> 12 -> 18...),
-- unsubscribe/resubscribe streak resets, admin-only access, and exclusion
-- of archived-puzzle solves from the current cycle's score. It has NOT
-- been run against your real Supabase project. Before relying on this for
-- real subscribers' paid access, test admin_reset_cycle_leaderboard
-- against a staging project or a small manual dry run first, and read
-- through the logic below rather than trusting it blindly.
--
-- ============================================================
-- THE RULES THIS IMPLEMENTS (as specified by the site owner):
-- ============================================================
-- * A user's score for a cycle = sum of puzzle_solve_scores.points for
--   puzzles that belong to that cycle's 90-puzzle roster, plus
--   puzzle_daily_points.points earned during that cycle's date window.
--   Solving an archived (past-cycle) puzzle never counts.
-- * Only users with an ACTIVE subscription at the moment of reset are
--   eligible for any reward, even if they'd otherwise rank top 10.
-- * Top 10 (while subscribed) each cycle -> +7 days access, and this
--   STACKS on their existing current_period_end (2 consecutive cycles
--   in the top 10 = +14 days, not reset to a flat 7).
-- * 6 CONSECUTIVE cycles in the top 10 -> +1 year (365 days) access, on
--   top of the weekly rewards already earned along the way.
-- * The bar for the NEXT such bonus then rises to 12 consecutive cycles,
--   then 18, then 24, etc. (+6 each time) -- it does not reset back to 6
--   after the first bonus.
-- * Missing top 10 in any cycle (or having no active subscription that
--   cycle) breaks the consecutive streak, resetting it to 0 and resetting
--   the next milestone target back down to 6.
-- * Historical records (past rankings, past grants, streak state) are
--   never deleted -- an unsubscribe/resubscribe gap does not erase a
--   user's history, it just means cycles during the gap can't count
--   toward a streak (no active subscription = not eligible that cycle).
-- * The 20 seeded reference leaderboard players live only in frontend
--   code (samplePlayers in app/WavefrontApp.tsx) and have no real
--   auth.users rows, so they are automatically excluded from everything
--   below -- no special-casing needed.
-- ============================================================

-- Which cycles have existed, and their date windows.
create table if not exists public.puzzle_cycles (
  cycle_number integer primary key,
  started_at date not null,
  ended_at date
);

-- Which puzzle ids belonged to which cycle's 90-puzzle roster.
-- Populated by admin_register_cycle (see below) at the moment a cycle
-- starts being current -- this is what lets scoring correctly exclude
-- solves of archived puzzles.
create table if not exists public.puzzle_cycle_puzzles (
  cycle_number integer not null references public.puzzle_cycles(cycle_number) on delete cascade,
  puzzle_id text not null,
  primary key (cycle_number, puzzle_id)
);

-- Snapshot of every real user's rank/score/eligibility at the moment
-- each cycle closed out. Kept forever as an audit trail.
create table if not exists public.puzzle_cycle_rankings (
  cycle_number integer not null references public.puzzle_cycles(cycle_number) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score numeric not null,
  rank integer not null,
  was_subscribed boolean not null,
  eligible_for_reward boolean not null,
  primary key (cycle_number, user_id)
);

-- Per-user running consecutive-top-10 streak state. One row per user who
-- has ever qualified at least once; never deleted.
create table if not exists public.puzzle_reward_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  next_milestone integer not null default 6,
  updated_at timestamptz not null default now()
);

-- Audit log of every access grant ever made by this system, so you can
-- always answer "why does this user's access end on this date."
create table if not exists public.puzzle_reward_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_number integer not null,
  grant_type text not null check (grant_type in ('top10_weekly', 'streak_milestone')),
  days_granted integer not null,
  previous_period_end timestamptz,
  new_period_end timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.puzzle_cycles enable row level security;
alter table public.puzzle_cycle_puzzles enable row level security;
alter table public.puzzle_cycle_rankings enable row level security;
alter table public.puzzle_reward_streaks enable row level security;
alter table public.puzzle_reward_grants enable row level security;

-- These are all admin/system-managed tables -- no public write access.
-- Read access is fine (a solver seeing their own streak/rank is not
-- sensitive), writes only ever happen inside the SECURITY DEFINER
-- functions below, which run with elevated privilege regardless of RLS.
create policy "cycle history is publicly readable" on public.puzzle_cycles for select using (true);
create policy "cycle puzzle membership is publicly readable" on public.puzzle_cycle_puzzles for select using (true);
create policy "cycle rankings are publicly readable" on public.puzzle_cycle_rankings for select using (true);
create policy "reward streaks are publicly readable" on public.puzzle_reward_streaks for select using (true);
create policy "reward grants are publicly readable" on public.puzzle_reward_grants for select using (true);

-- ============================================================
-- Change this to your actual admin email if it's ever different from
-- the one hardcoded client-side in app/WavefrontApp.tsx's isAdmin check.
-- ============================================================
create or replace function public._puzzle_require_admin()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'cbaforcat2017@gmail.com' then
    raise exception 'Only the site admin can call this function';
  end if;
end;
$$;

-- Registers a cycle and its 90 puzzle ids. Called once to bootstrap
-- Cycle 1 (with no previous cycle to close out), and again internally
-- by admin_reset_cycle_leaderboard for every subsequent cycle.
create or replace function public.admin_register_cycle(
  p_cycle_number integer,
  p_started_at date,
  p_puzzle_ids text[]
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
#variable_conflict use_column
begin
  perform public._puzzle_require_admin();

  insert into public.puzzle_cycles (cycle_number, started_at)
  values (p_cycle_number, p_started_at)
  on conflict (cycle_number) do nothing;

  insert into public.puzzle_cycle_puzzles (cycle_number, puzzle_id)
  select p_cycle_number, unnest(p_puzzle_ids)
  on conflict (cycle_number, puzzle_id) do nothing;
end;
$$;

-- The main function. Call this from the Admin panel AFTER a new roster's
-- PR has been merged and deployed (so the puzzle ids you pass in are the
-- NEW cycle's 90 ids, already live). It:
--   1. Closes out the currently-open cycle.
--   2. Computes every real user's score for that closing cycle (Daily +
--      that cycle's 90 puzzles only) and ranks them.
--   3. Grants +7 days to eligible (subscribed) top 10 finishers, stacking
--      on their existing access.
--   4. Updates each user's consecutive-streak counter, granting +365 days
--      whenever a streak crosses its next escalating milestone (6, 12,
--      18, ...), and resetting the streak (and its milestone target) for
--      anyone who didn't qualify this cycle.
--   5. Registers the new cycle and its puzzle ids for next time.
-- Returns one row per real user who was ranked this cycle, for the admin
-- to review before trusting it silently.
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

  v_cycle_end := p_new_cycle_started_at;

  update public.puzzle_cycles
  set ended_at = v_cycle_end
  where cycle_number = v_closing_cycle;

  -- Score = this cycle's puzzle solves + this cycle's daily points.
  -- (Columns are qualified with "combined." throughout -- the function's
  -- own OUT parameter is also named user_id, which otherwise shadows the
  -- column reference inside PL/pgSQL.)
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
  from _cycle_ranked cr;

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
      -- Weekly reward: stack 7 days on their current expiry.
      select current_period_end into v_current_end
      from public.puzzle_subscriptions where user_id = r.user_id;

      v_new_end := greatest(coalesce(v_current_end, v_reset_time), v_reset_time) + interval '7 days';

      update public.puzzle_subscriptions
      set current_period_end = v_new_end, status = 'active'
      where user_id = r.user_id;

      insert into public.puzzle_reward_grants (user_id, cycle_number, grant_type, days_granted, previous_period_end, new_period_end)
      values (r.user_id, v_closing_cycle, 'top10_weekly', 7, v_current_end, v_new_end);

      update _grant_results set weekly_days_granted = 7 where user_id = r.user_id;

      -- Streak: increment, check for milestone crossing.
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
      -- Not eligible this cycle (missed top 10, or not subscribed):
      -- break the streak if they had one going.
      update public.puzzle_reward_streaks
      set current_streak = 0, next_milestone = 6, updated_at = v_reset_time
      where user_id = r.user_id and current_streak > 0;
    end if;
  end loop;

  perform public.admin_register_cycle(p_new_cycle_number, p_new_cycle_started_at, p_new_cycle_puzzle_ids);

  return query select * from _grant_results order by rank;
end;
$$;
