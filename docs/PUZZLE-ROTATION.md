# Puzzle Rotation Playbook

This is the operating manual for the recurring "new puzzle roster" cycle. It's written to be followed by a fresh Claude session with no memory of prior conversations — everything needed should be discoverable from this repo. If you're a session picking this up from a scheduled trigger, read this whole file before touching anything.

## What this is

Every 14 days, the entire "current" puzzle roster (90 puzzles, 15 per category across the 6 paths: Logic & Knowledge, Mathematical Reasoning, Probability & Strategy, Algorithms & Optimization, Spatial Reasoning, Patterns & Numbers) gets **replaced** with a fresh set of 90. The outgoing roster is **archived**, not deleted — it stays fully browsable and solvable under the Archive nav section, it just stops being the "current" spotlight set.

## Step 0 — Check whether it's actually time

Read `app/data/cycle-meta.ts`. It has `startedAt` (ISO date the current cycle went live) and `rotationDays` (14). If fewer than `rotationDays` days have passed since `startedAt`, **stop here — do nothing, don't commit, don't open a PR.** This file's trigger fires weekly as a safety net, but a new roster should only ship every other firing.

## Step 1 — Gather source material

1. Read every file in `docs/puzzle-sources/*.md` — these are the accumulated reference anthologies (logic, epistemic, decision-theory, probability, and lateral-thinking puzzles with fully worked solutions).
2. Read `docs/puzzle-sources/USED-LOG.md` — it lists which puzzle families are already live or recently archived. Don't reuse a family that's listed as already covered unless the log explicitly says it's safe to reuse (e.g. it rotated out a while ago).
3. If the user has shared new source material since the last cycle (new uploaded files, links, or pasted puzzle text), it should already be saved into `docs/puzzle-sources/` as a new numbered file — if you find relevant material in the conversation that *isn't* yet saved to the repo, save it there first, in the same style as the existing files (setup, solution mechanics, validated answer — not a lossy summary), so it survives into future cycles.

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
3. Replace the current puzzle data files with the new 90.
4. Update `app/data/cycle-meta.ts`: increment `cycleNumber`, set `startedAt` to today's date.
5. Update `docs/puzzle-sources/USED-LOG.md`: log the new cycle's puzzle-family usage, and update the "available, not yet used" list.

## Step 6 — Verify before shipping

- Run the full test suite (`npm test`, or at minimum `node --test tests/puzzle-accuracy.test.mjs` and `node --test tests/rendered-html.test.mjs` plus `npm run build`).
- Confirm puzzle counts: 15 per category in the current roster, and that the newly archived cycle's puzzle count and ids are intact.
- Fix `npm run lint` issues you introduce; don't worry about pre-existing unrelated findings.

## Step 7 — Ship it

- Commit on a fresh branch (don't work directly on `main`).
- Push and **open a pull request** — do not merge it yourself. The site owner reviews and merges manually, then triggers their own redeploy (there is no CI/auto-deploy in this repo as of Cycle 1; check whether that's changed before assuming otherwise).
- In the PR description, call out: the new puzzle count/mix, which source families were used, which were archived, and a reminder that a manual redeploy is needed after merge for the live site to reflect it.
- If anything in this playbook seems out of date, or you hit a genuine judgment call (e.g. the source material has dried up for a category, or the difficulty balance doesn't work out cleanly), say so in the PR description rather than silently improvising — the owner reads these.
