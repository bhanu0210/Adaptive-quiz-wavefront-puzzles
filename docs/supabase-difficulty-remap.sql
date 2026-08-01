-- Run this in your Supabase project's SQL editor.
--
-- Exposes aggregated (non-identifying) subscriber difficulty ratings so the
-- adaptive engine can use real feedback instead of only the author-assigned
-- difficulty. This never reveals who rated what -- only a per-puzzle
-- average and count. puzzle_difficulty_ratings itself predates this repo's
-- visible SQL files, so its RLS is unknown from here; using
-- SECURITY DEFINER sidesteps that entirely rather than guessing at it, the
-- same approach already used for puzzle_leaderboard-style aggregates.
--
-- IMPORTANT: this is internal-only, by design. The app uses this ONLY to
-- pick which puzzle to recommend next -- it does NOT change any puzzle's
-- publicly displayed difficulty label (Accessible/Stretch/Expert), which
-- stays exactly as authored. Do not wire this into any public-facing
-- difficulty display without deciding that deliberately.

create or replace function public.puzzle_difficulty_ratings_summary()
returns table (puzzle_id text, avg_rating numeric, rating_count integer)
language sql
stable
security definer
set search_path = public
as $$
  select puzzle_id, avg(rating)::numeric as avg_rating, count(*)::integer as rating_count
  from public.puzzle_difficulty_ratings
  group by puzzle_id;
$$;

grant execute on function public.puzzle_difficulty_ratings_summary() to authenticated, anon;
