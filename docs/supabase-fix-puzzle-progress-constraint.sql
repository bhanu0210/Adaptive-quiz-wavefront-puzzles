-- Diagnostic + fix for: puzzles show correct scores/leaderboard points but
-- never get marked "solved" (no checkmark on Paths, reopening lets you
-- resubmit, especially noticeable right after solving several puzzles in
-- one category).
--
-- HYPOTHESIS: app/WavefrontApp.tsx writes a puzzle solve with two upserts:
--   supabase.from("puzzle_progress").upsert({...}, { onConflict: "user_id,puzzle_id" })
--   supabase.from("puzzle_solve_scores").upsert({...}, { onConflict: "user_id,puzzle_id" })
-- Postgres requires a real unique constraint/index matching the onConflict
-- columns for an upsert to work. If puzzle_progress does not have a unique
-- constraint on (user_id, puzzle_id) -- unlike puzzle_solve_scores, which
-- does -- every puzzle_progress upsert fails with "there is no unique or
-- exclusion constraint matching the ON CONFLICT specification". The score
-- write still succeeds (so points/leaderboard look correct), but nothing
-- is ever saved to puzzle_progress, so the "solved" checkmark never
-- persists. The app code has been updated (separately) to surface this
-- error instead of swallowing it silently -- if you see a notice reading
-- "this solve could not be marked complete" after solving, this is the
-- table to check.
--
-- STEP 1 -- diagnose, read-only. Run this first.
-- If this errors with "constraint ... does not exist" / returns no rows,
-- OR if it succeeds and shows 0 rows, the constraint is indeed missing
-- and step 2 below is safe to run (there cannot be pre-existing duplicate
-- (user_id, puzzle_id) rows to conflict with, because every upsert that
-- would have created one has been failing outright, not silently
-- duplicating).
select conname, contype
from pg_constraint
where conrelid = 'public.puzzle_progress'::regclass
  and contype in ('u', 'p');

-- Also check for any duplicate (user_id, puzzle_id) rows that would block
-- adding the constraint. This should return zero rows.
select user_id, puzzle_id, count(*)
from public.puzzle_progress
group by user_id, puzzle_id
having count(*) > 1;

-- STEP 2 -- fix. Only run this if step 1 showed no existing unique/primary
-- key constraint covering (user_id, puzzle_id), and no duplicate rows.
-- Safe to run even if you are not certain -- "if not exists" makes it a
-- no-op when a matching index already exists under a different name only
-- in the unlikely case Postgres considers it identical; if in doubt, run
-- step 1 first and read the result before running this.
create unique index if not exists puzzle_progress_user_puzzle_key
  on public.puzzle_progress (user_id, puzzle_id);
