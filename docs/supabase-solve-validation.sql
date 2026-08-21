-- Run this in your Supabase project's SQL editor, AFTER puzzle_catalog has
-- at least once been populated via the Admin tab's "Store all N puzzles"
-- button (see the REQUIRED FOLLOW-UP note near the bottom -- this migration
-- is useless, and breaks scoring for everyone, if that table is empty when
-- it runs).
--
-- ============================================================
-- THE VULNERABILITY THIS CLOSES
-- ============================================================
-- app/WavefrontApp.tsx's submitAnswer computes `points` on the client and
-- upserts it directly into puzzle_solve_scores:
--
--   const points = wrongOnceIds.includes(...) ? 0 : Math.max(40, 100 - revealedHints * 15);
--   ... supabase.from("puzzle_solve_scores").upsert({ user_id, puzzle_id, points, ... })
--
-- and docs/supabase-grants-fix-2.sql grants `insert, update` on that table
-- to the whole `authenticated` role. Any signed-in user can therefore open
-- a browser console and run:
--
--   supabase.from("puzzle_solve_scores").insert({ puzzle_id: "anything",
--     points: 100, user_id: <their own id> })
--
-- for as many fake puzzle_ids as they like, with no server-side check that
-- they ever answered anything, let alone answered it correctly. This isn't
-- just a vanity leaderboard problem: puzzle_solve_scores feeds
-- admin_reset_cycle_leaderboard, which grants real subscription days to
-- top-10 finishers (+7 days, stacking; +365 days at streak milestones) --
-- so this is a direct path to unlimited free paid access.
--
-- Separately, docs/supabase-grants-fix-2.sql also grants `insert, update`
-- on puzzle_catalog to the whole authenticated role, with no RLS policy
-- restricting who can write it. puzzle_catalog.payload is exactly where
-- the "ground truth" correct answer would need to live for any server-side
-- check to mean anything -- so both holes have to close together, or
-- fixing one just moves the exploit to the other (rewrite the catalog's
-- own correctOption first, then "solve" it for free).
--
-- ============================================================
-- THE FIX
-- ============================================================
-- 1. Lock puzzle_catalog writes to the admin only (RLS), while every
--    signed-in-or-not visitor keeps read access to published rows -- this
--    table is also how the Admin tab live-edits puzzle content without a
--    code deploy (see the puzzle_catalog select feeding contentOverrides
--    in app/WavefrontApp.tsx), so it needs to stay readable by everyone,
--    just not writable by anyone but the admin.
-- 2. Add record_puzzle_solve(), a SECURITY DEFINER function that
--    independently looks up the puzzle's real correctOption from
--    puzzle_catalog and only writes a score if the submitted option
--    actually matches -- the caller can claim anything, but only a
--    genuinely correct answer to a real, published puzzle id produces a
--    nonzero, correctly-computed point value. It reproduces the exact
--    scoring rules already in app/WavefrontApp.tsx (0 points on a puzzle
--    you'd previously gotten wrong; otherwise 100 minus 15 per hint,
--    floored at 40) and is idempotent -- solving the same puzzle twice
--    returns the already-recorded score rather than double-counting.
-- 3. REVOKE direct insert/update on puzzle_solve_scores and puzzle_progress
--    from the authenticated role entirely. This is a hard table-level
--    grant revocation, not just an RLS policy -- RLS can restrict which
--    rows a role may touch, but can't validate that a submitted `points`
--    value is honest, so the only way to make an arbitrary-points-injection
--    genuinely impossible is to remove write access to the table outright
--    and route every write through the one function that checks it.
--    record_puzzle_solve runs SECURITY DEFINER, so it keeps working for
--    every signed-in user despite the revoke.
--
-- What this does NOT fix: puzzle content (including every correctOption)
-- still ships in the client bundle regardless of subscription status --
-- that's a separate, larger issue (the paywall only gates rendering, not
-- data) requiring puzzle content to stop being bundled client-side
-- entirely. This migration closes "mint arbitrary points for any puzzle_id
-- instantly," not "read the answer from the bundle" -- knowing the answer
-- and legitimately submitting it is a much smaller, much more ordinary
-- concern for a site whose entire content is multiple-choice.
--
-- ============================================================
-- REQUIRED FOLLOW-UP: puzzle_catalog must already be populated
-- ============================================================
-- record_puzzle_solve looks up correctOption from puzzle_catalog, not from
-- the static data files. If puzzle_catalog is empty or stale (nobody has
-- clicked "Store all N puzzles" on the Admin tab recently), every solve
-- attempt will fail with "Unknown or unpublished puzzle" and NO ONE will
-- be able to score any points until it's synced. Click that button (with
-- the live Cycle 2 roster loaded) before or immediately after running this
-- file, and again after every future rotation.

-- ------------------------------------------------------------
-- 1. Lock down puzzle_catalog writes to the admin only
-- ------------------------------------------------------------
alter table public.puzzle_catalog enable row level security;

drop policy if exists "puzzle catalog published rows are publicly readable" on public.puzzle_catalog;
create policy "puzzle catalog published rows are publicly readable"
  on public.puzzle_catalog
  for select
  using (publication_status = 'published');

drop policy if exists "admin can read the full puzzle catalog" on public.puzzle_catalog;
create policy "admin can read the full puzzle catalog"
  on public.puzzle_catalog
  for select
  using (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');

drop policy if exists "admin can write the puzzle catalog" on public.puzzle_catalog;
create policy "admin can write the puzzle catalog"
  on public.puzzle_catalog
  for all
  using (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com')
  with check (auth.jwt() ->> 'email' = 'cbaforcat2017@gmail.com');

-- ------------------------------------------------------------
-- 2. The validating RPC
-- ------------------------------------------------------------
drop function if exists public.record_puzzle_solve(text, integer, integer) cascade;

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
begin
  if v_user is null then
    raise exception 'Must be signed in to record a solve.';
  end if;

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

-- ------------------------------------------------------------
-- 3. Close the direct-write hole. This is the line that actually matters --
--    everything above is scaffolding for this to be safe to do.
-- ------------------------------------------------------------
revoke insert, update on public.puzzle_solve_scores from authenticated;
revoke insert, update on public.puzzle_progress from authenticated;
