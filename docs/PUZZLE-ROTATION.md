# Puzzle Rotation Playbook

This is the operating manual for the recurring "new puzzle roster" cycle. It's written to be followed by a fresh Claude session with no memory of prior conversations — everything needed should be discoverable from this repo. If you're a session picking this up from a scheduled trigger, read this whole file before touching anything.

## What this is

Every 14 days, a fresh 90-puzzle roster (15 per category across the 6 paths: Logic & Knowledge, Mathematical Reasoning, Probability & Strategy, Algorithms & Optimization, Spatial Reasoning, Patterns & Numbers) gets **generated and opened as a pull request.** When the outgoing roster is eventually replaced, it moves to the Archive nav section — browsable and solvable, it just stops being the "current" spotlight set. **The archive keeps only the 2 most recently retired cycles** — when a 3rd would be added, the oldest archived cycle is permanently removed (see Step 5).

**Generation and publishing are two separate, decoupled decisions:**
- **Generation is automatic and clock-driven.** A new draft roster gets authored and opened as a PR every 14 days, no matter what happened to the previous draft.
- **Publishing (merging the PR so it goes live) is an admin decision, not automatic.** The site owner reviews and merges whenever they're ready — that might be right away, or they might sit on a draft PR for longer than 14 days before merging it (or never merge a given draft at all, e.g. if two drafts pile up and they only want to publish one). **Never merge a rotation PR yourself.** Open it, describe it clearly, and stop.

## Step 0 — Confirm you were actually triggered for a rotation

If you're reading this because a scheduled trigger fired, that trigger's own schedule *is* the 14-day clock — you don't need to re-derive timing from `app/data/cycle-meta.ts`. Just proceed. (`cycle-meta.ts` describes the *currently live* roster — how long it's been live, for the sidebar countdown UI — not when the next draft should be generated; don't conflate the two.) After finishing this cycle's work (Steps 1–7), reschedule your own trigger for 14 days from now before ending your turn, so the cadence continues regardless of whether this draft gets merged.

## Step 1 — Gather source material

1. Read every file in `docs/puzzle-sources/*.md` — these are the accumulated reference anthologies (logic, epistemic, decision-theory, probability, and lateral-thinking puzzles with fully worked solutions).
2. Read `docs/puzzle-sources/USED-LOG.md` — it lists which puzzle families are already live or recently archived. Don't reuse a family that's listed as already covered unless the log explicitly says it's safe to reuse (e.g. it rotated out a while ago).
3. If the user has shared new source material since the last cycle (new uploaded files, links, or pasted puzzle text), it should already be saved into `docs/puzzle-sources/` as a new numbered file — if you find relevant material in the conversation that *isn't* yet saved to the repo, save it there first, in the same style as the existing files (setup, solution mechanics, validated answer — not a lossy summary), so it survives into future cycles.
4. **Do a live web search every cycle** for recently-discussed, genuinely hard puzzles (competition problems, well-known hard-logic/probability puzzles making the rounds, puzzle-of-the-week style content from reputable sources) to keep the "really tough" half of the roster from going stale. Treat this the same as the static source files:
   - Search broadly (e.g. "hardest logic puzzle [current year]", "difficult probability puzzle reddit/HN", "competition math puzzle unsolved intuition") rather than just re-finding the same handful of classics every time.
   - **Do not copy puzzle text verbatim from a copyrighted source** (books, paid puzzle-hunt sites, newspaper puzzle columns). Extract the underlying *mechanic and validated answer*, then write the question, hints, explanation, and takeaway in this site's own words — the same approach already used for the anthology material (see the note at the top of `app/data/launch-expansion.ts`).
   - **Web-sourced answers need the same independent verification as everything else — arguably more**, since random web sources (forum threads, blog posts) are more likely to have an outright wrong or disputed stated answer than a curated anthology. Recompute or re-derive the answer yourself before trusting it; if you can't independently confirm it, don't use that puzzle.
   - Save what you found and used into `docs/puzzle-sources/` as a new dated file (e.g. `05-web-research-2026-08-03.md`), in the same setup → solution → validated-answer style as the rest of the library, with the source URL noted — so it's durable for future cycles and so `USED-LOG.md` can reference it.

## Step 2 — Scope: what's buildable, what isn't

This site's puzzle engine is **text + multiple-choice only** (one question, 4 options, one correct answer, a 3-step hint ladder, an explanation, a takeaway, and an independently-verified answer). It has no interactive grid, image, or drag-and-drop UI.

**In scope**: logic puzzles, epistemic/knowledge puzzles, probability, decision-theory (framed around computable expected value, not "which philosophy is correct"), spatial/geometric reasoning (describable in words, answer is a number or shape), algorithms/optimization, number patterns, classic riddles with a confirmed single answer, lateral-thinking ciphers with a confirmed single answer.

**Out of scope — do not attempt**: Sudoku variants or any grid-based logic puzzle, SameGame/"Clues by Sam"-style board games, escape-book/puzzlehunt content that depends on physical pages or images, and any riddle whose source material doesn't give a definitive validated answer. See `docs/puzzle-sources/03-core-anthology-and-folk-riddles.md` (bottom section) for the full list and reasoning. If the user has explicitly asked in the meantime for this to change (e.g. requested a real grid-puzzle engine be built), that's a separate, larger project — check the most recent conversation context before assuming the scope has changed.

## Step 3 — Author 90 new puzzles

- **15 per category**, across all 6 categories, matching the exact object schema used in the current data file (open it and match the shape exactly — id, title, category, difficulty, time, question, options (4), correctOption, hints (exactly 3, distinct, each ≥30 chars), explanation, takeaway, verification: { method, reviewed: true, version }).
- **Difficulty mix — 50/50 split**: within each category's 15, aim for **7 or 8 at difficulty 1–3** ("solvable" — Accessible/Stretch tier) and the remaining **8 or 7 at difficulty 4–5** ("really tough" — Expert tier). Alternate which side gets 8 across categories so the full 90-puzzle roster lands as close to 45 solvable / 45 tough as the integers allow.
- **IDs must be globally unique forever** — check against the current roster, everything in `app/data/archive/`, and the `USED-LOG.md`. Never reuse an id, even for a puzzle that's conceptually the same family reused later.
- **Draw first from the source anthologies** (`docs/puzzle-sources/`) for families not yet used (check `USED-LOG.md`'s "available, not yet used" section), adapting them into clean, self-contained multiple-choice questions. **Where the anthology doesn't have enough usable material for a category**, it's fine to originally author puzzles in the same spirit — this has already been done for Mathematical Reasoning, Algorithms & Optimization, and Patterns & Numbers in Cycle 1, since the source material skews heavily toward logic/epistemic/decision-theory content.
- **Validate every answer independently** before publishing — don't just trust the source material's stated answer for anything computable. Recompute it yourself (by hand or by writing and running a small verification script, following the pattern already established in `tests/puzzle-accuracy.test.mjs`).
- Match the site's existing tone: plain, second-person-adjacent, explains *why*, ends with a transferable takeaway lesson — read a handful of existing puzzles in the current data file first to calibrate.

## Step 4 — Add worked-example tips

Alongside the new puzzles, add a handful of new worked-example tip cards (in the static "Worked examples" grid inside `app/WavefrontApp.tsx`'s Tips view) that teach a technique used by one of the new puzzles — same pattern as the existing cards (short title, one-paragraph explanation, a compact `<code>` snippet showing the technique in miniature). Prioritize techniques that are genuinely reusable and not yet covered by an existing tip card.

## Step 5 — Archive the outgoing roster and publish the new one

1. Move the *entire current* puzzle content into a new file under `app/data/archive/` (follow the existing naming/versioning convention already in that directory — check `app/data/archive/index.ts` for the pattern), tagged with the outgoing cycle's number and date range.
2. Register that archived cycle in `app/data/archive/index.ts`.
3. **If this brings the archive to more than 2 cycles**, remove the oldest one: delete its entry from `app/data/archive/index.ts` and delete its puzzle file. Its puzzle IDs are now permanently unreachable anywhere in the app — note them in the PR description so the admin can run a cleanup query removing any `puzzle_solve_scores`/`puzzle_progress` rows referencing those specific IDs in Supabase (a one-line `delete ... where puzzle_id = any(array[...])` against each table; don't run it yourself, this repo has no Supabase credentials — just hand the admin the exact ID list and query). Still never reuse a purged ID for a new puzzle.
4. Replace the current puzzle data files with the new 90.
5. Update `app/data/cycle-meta.ts`: increment `cycleNumber`, set `startedAt` to today's date.
6. Update `docs/puzzle-sources/USED-LOG.md`: log the new cycle's puzzle-family usage, and update the "available, not yet used" list.

## Step 6 — Verify before shipping

- Run the full test suite (`npm test`, or at minimum `node --test tests/puzzle-accuracy.test.mjs` and `node --test tests/rendered-html.test.mjs` plus `npm run build`).
- Confirm puzzle counts: 15 per category in the current roster, and that the newly archived cycle's puzzle count and ids are intact.
- Fix `npm run lint` issues you introduce; don't worry about pre-existing unrelated findings.

## Step 7 — Ship it

- Commit on a fresh branch (don't work directly on `main`).
- Push and **open a pull request** — do not merge it yourself, ever, regardless of how confident you are. The site owner reviews and merges manually, on their own timeline, and that merge is what makes it live.
- As of the Vercel-migration merge (after Cycle 1), this repo has real CI: a Vercel preview-deployment check runs automatically on every PR. Check that it goes green before considering the PR ready; if it fails, investigate and fix (see the drive-to-green posture in your own standing instructions for PRs you opened) rather than leaving a red check for the owner to sort out.
- In the PR description, call out: the new puzzle count/mix, which source families were used, which were archived, and — since merging is what publishes it — a note that merging this PR will both replace the live roster **and** reset the real-solver leaderboard for the new cycle (see the leaderboard note below).
- If anything in this playbook seems out of date, or you hit a genuine judgment call (e.g. the source material has dried up for a category, or the difficulty balance doesn't work out cleanly), say so in the PR description rather than silently improvising — the owner reads these.

## Step 8 — Reschedule yourself

Before ending your turn, reschedule your own trigger for 14 days from now (regardless of whether this draft PR gets merged soon, later, or not at all) so the generation cadence continues on its own clock.

## Leaderboard reset (tied to *publishing*, not generation)

When a new roster actually goes live (i.e. an admin merges a rotation PR), the real-solver leaderboard is meant to reset to zero for the new cycle — **except** the ~20 seeded reference players (`samplePlayers` in `app/WavefrontApp.tsx`), which are intentional permanent reference points, not fake data to remove.

**As of the Cycle 2 rotation, this is implemented as `docs/supabase-leaderboard-cycle-scope.sql`**, which redefines the `puzzle_leaderboard()` RPC to dynamically compute scores scoped to whichever cycle is currently open (`puzzle_cycles.ended_at is null`), rather than all-time. It's a scoping fix, not a deletion — nothing in `puzzle_solve_scores`/`puzzle_progress` is touched, and every past cycle's numbers stay intact forever in `puzzle_cycle_rankings`. It was written and verified end-to-end against a local Postgres stub (not the real Supabase project, since no session has credentials for that), covering: no-cycle fallback (matches the old all-time behavior, so running the migration alone causes no regression), correct exclusion of a retired cycle's solves once a cycle is registered, correct daily-points date windowing, and a full close-cycle-then-open-next-cycle rollover.

**Two things still need the admin's own hands, since no session has Supabase credentials:**
1. Run `docs/supabase-leaderboard-cycle-scope.sql` once in the Supabase SQL editor (after `docs/supabase-cycle-rewards.sql`, if that hasn't been run either).
2. Click **"Register current cycle"** once on the Admin tab — this is what actually starts the scoping (the RPC falls back to the old all-time behavior until *some* cycle has been registered at all). Every rotation after that rolls forward automatically via the existing "Close cycle & apply rewards" button — no further manual leaderboard steps.

There's also an open question about what should happen to whoever's in the top 10 at the moment of reset (a "Hall of Fame" record, a badge, just noted in the PR — unclear as of this writing) — ask rather than guess if this comes up before it's been resolved.
