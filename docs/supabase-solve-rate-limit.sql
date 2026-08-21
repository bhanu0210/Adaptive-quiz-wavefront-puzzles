-- Run this in your Supabase project's SQL editor, AFTER
-- docs/supabase-solve-validation.sql has already been run (it redefines
-- that file's record_puzzle_solve function, keeping its exact scoring
-- logic unchanged).
--
-- ============================================================
-- WHAT THIS ADDS
-- ============================================================
-- record_puzzle_solve is SECURITY DEFINER and correctly rejects any
-- fabricated score (see docs/supabase-solve-validation.sql), so there's no
-- way to mint points by calling it -- but nothing stops a signed-in user
-- from calling it in a tight loop. Even though a wrong/repeat call is cheap
-- and harmless to the leaderboard, it's still unmetered database load: a
-- script could hammer this RPC thousands of times a minute per account
-- with no limit at all.
--
-- This adds a simple fixed-window rate limit: at most 20 calls per user
-- per rolling 60-second window (generous for any real solver -- that's one
-- call every 3 seconds, far beyond how fast anyone actually reads a
-- question, picks an answer, and clicks). Past that, the function raises
-- an exception instead of doing any of its normal work, so a burst can't
-- reach the puzzle_catalog lookup or any table write at all.
--
-- The throttle table itself is written only from inside this
-- SECURITY DEFINER function -- no direct client grant -- and old windows
-- are pruned opportunistically on each call rather than needing a
-- separate scheduled cleanup job.

create table if not exists public.puzzle_solve_attempts_throttle (
  user_id uuid not null references auth.users(id) on delete cascade,
  window_start timestamptz not null,
  call_count integer not null default 0,
  primary key (user_id, window_start)
);

alter table public.puzzle_solve_attempts_throttle enable row level security;
-- No policies at all: RLS enabled with zero policies means zero rows are
-- visible or writable to anon/authenticated via the client SDK, by design
-- -- this table only exists to be touched by record_puzzle_solve's own
-- elevated SECURITY DEFINER privileges, never directly.
revoke all on public.puzzle_solve_attempts_throttle from authenticated, anon;

create or replace function public.record_puzzle_solve(
  p_puzzle_id text,
  p_chosen_option integer,
  p_hints_used integer
)
returns table (
  correct boolean,
  points integer,
  already_recorded boolean
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_correct_option integer;
  v_already_solved boolean;
  v_previously_wrong boolean;
  v_points integer;
  v_is_correct boolean;
  v_window timestamptz;
  v_call_count integer;
begin
  if v_user is null then
    raise exception 'Must be signed in to record a solve.';
  end if;

  -- Fixed one-minute window keyed by the user and the truncated-to-the-
  -- minute timestamp -- simpler than a true sliding window, and plenty
  -- precise for "stop a script," not "meter exact request rates."
  v_window := date_trunc('minute', now());

  insert into public.puzzle_solve_attempts_throttle (user_id, window_start, call_count)
  values (v_user, v_window, 1)
  on conflict (user_id, window_start) do update
    set call_count = public.puzzle_solve_attempts_throttle.call_count + 1
  returning call_count into v_call_count;

  if v_call_count > 20 then
    raise exception 'Too many solve attempts -- please slow down and try again in a moment.';
  end if;

  -- Opportunistic cleanup: drop this user's windows once they're old enough
  -- to never be queried again, so the table doesn't grow unbounded. Cheap
  -- (indexed on the primary key) and safe to run on every call.
  delete from public.puzzle_solve_attempts_throttle
  where user_id = v_user and window_start < v_window - interval '10 minutes';

  select (payload ->> 'correctOption')::integer into v_correct_option
  from public.puzzle_catalog
  where id = p_puzzle_id and publication_status = 'published';

  if v_correct_option is null then
    raise exception 'Unknown or unpublished puzzle id: %', p_puzzle_id;
  end if;

  v_is_correct := (p_chosen_option = v_correct_option);

  if not v_is_correct then
    return query select false, 0, false;
    return;
  end if;

  select exists(
    select 1 from public.puzzle_solve_scores
    where user_id = v_user and puzzle_id = p_puzzle_id
  ) into v_already_solved;

  if v_already_solved then
    -- Idempotent: a repeat "correct" submission (e.g. a double-click, or
    -- revisiting an already-solved puzzle) returns the score already on
    -- record rather than silently no-op'ing or double-counting it.
    return query
      select true, s.points, true
      from public.puzzle_solve_scores s
      where s.user_id = v_user and s.puzzle_id = p_puzzle_id;
    return;
  end if;

  select exists(
    select 1 from public.puzzle_wrong_attempts
    where user_id = v_user and puzzle_id = p_puzzle_id
  ) into v_previously_wrong;

  -- Mirrors the exact scoring rule already in app/WavefrontApp.tsx: a
  -- puzzle you'd ever gotten wrong scores 0 even when later answered
  -- correctly, since the answer was already shown; otherwise 100 minus 15
  -- per hint used, floored at 40.
  v_points := case when v_previously_wrong then 0 else greatest(40, 100 - coalesce(p_hints_used, 0) * 15) end;

  insert into public.puzzle_progress (user_id, puzzle_id, attempts, hints_used, solved_at)
  values (v_user, p_puzzle_id, 1, coalesce(p_hints_used, 0), now())
  on conflict (user_id, puzzle_id) do update
    set attempts = public.puzzle_progress.attempts + 1, hints_used = excluded.hints_used, solved_at = excluded.solved_at;

  insert into public.puzzle_solve_scores (user_id, puzzle_id, points, solved_at)
  values (v_user, p_puzzle_id, v_points, now())
  on conflict (user_id, puzzle_id) do nothing;

  return query select true, v_points, false;
end;
$$;

grant execute on function public.record_puzzle_solve(text, integer, integer) to authenticated;
