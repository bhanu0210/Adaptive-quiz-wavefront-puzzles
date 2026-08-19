# Puzzle Source Usage Log

Tracks which puzzle families from `docs/puzzle-sources/*.md` have already been converted into a published Wavefront Puzzles cycle, so future rotations avoid duplicating a puzzle family that's already live (or very recently archived). Update this file as part of every rotation.

Format per entry: `puzzle-id — family name — cycle — notes`

## Cycle 2 (2026-08-19) — currently live

Drawn heavily from the three new sources added this cycle (`05-wits-and-wonders-handbook.md`, `06-puzzles-to-puzzle-you-full-text.md`, `07-book-of-numbers-companion.md`) plus three flagship items from the pre-existing "available, not yet used" list below. **Do not reuse these families again until they've cycled fully out of the archive's recent history.**

- `c2-logic-zebra-fish` — **Einstein's Zebra Puzzle**, full 15-clue version — cleared from the "available" list below, source: file 03 (cross-checked against source 06 §1 for identical clue wording)
- `c2-logic-green-eyes` — **Blue-Eyed/Green-Eyed Islanders**, full 100-prisoner induction — cleared from the "available" list below, source: file 03 / source 05 §A4 (TED-Ed framing)
- `c2-logic-unexpected-hanging` — **The Unexpected Hanging Paradox** — cleared from the "available" list below, source: file 03
- `c2-logic-control-room`, `c2-logic-passcode-hallway`, `c2-logic-temple-liars`, `c2-algo-bridge-four`, `c2-algo-river-lions`, `c2-prob-prisoner-hats` — TED-Ed logic-riddle series (Control Room graph puzzle, Passcode deduction, Temple liar-trio, Bridge crossing, River Crossing lions/wildebeest, Prisoner Hat parity) — source: file 05 §A2–A8
- `c2-logic-one-equals-two` — the "prove 1=2" division-by-zero fallacy — source: file 07
- `c2-algo-chessboard-wheat` — Sessa's chessboard wheat-grains doubling puzzle — source: file 07
- `c2-pattern-prime-years` — prime years of the 20th century — source: file 07, **corrected**: the source claims 7, the true count is 13 (see the file's own inline flag)
- `c2-pattern-amicable-pair` — 220/284 amicable numbers — source: file 07
- `c2-pattern-pandigital-squares` — largest/smallest 9-digit pandigital squares — source: file 06 #7, **corrected**: both handbooks print 932187456 for the largest, which is not a perfect square; the true value is 923187456 (30384²)
- Roughly 40 more puzzles across every path adapted from the *Puzzles to Puzzle You* full catalog (source: file 06 #10–150) and *The Book of Numbers* (source: file 07) — see `06-puzzles-to-puzzle-you-full-text.md`'s own cross-source-conflict table for the puzzles whose stated answers needed independent re-derivation before use (#10, #25, #51, #109, #110, #111, #115, #142 were all recomputed, not trusted as printed)
- Everything else in Cycle 2 (probability puzzles beyond Monty Hall/birthday, Tower of Hanoi, burning ropes, knights-and-knaves, the barber paradox) was originally authored for this site or drawn from public-domain puzzle genres not covered by the anthology files

**Judgment calls flagged rather than silently made** (per the rotation playbook, since these technically reuse a family that's only just rotating out this same cycle, not one that's been retired "a while ago"):
- `c2-spatial-cube-three-faces` (painted-cube corners) reuses the same 3×3×3 painted-cube setup as Cycle 1's `painted-cube` (which asked for edges, not corners). The cube itself just retired to archive this cycle.
- `c2-spatial-ant-cube` (shortest surface path across a cube) is the same unfolding mechanic as Cycle 1's `spatial-ant-cylinder`, on a different solid.
- `c2-prob-monty-hundred` (100-door Monty Hall) and `c2-prob-birthday-23` reuse the Monty Hall and birthday-paradox families from Cycle 1's `monty-switch`/`prob-choose-strategy` and `birthday-collision`, with materially different framings (100 doors instead of 3; asking for the crossover group size via full computation rather than citing it).

If any of these four feel too close together across two consecutive cycles, Cycle 3 should skip that family entirely rather than touch it again.

## Cycle 1 (2026-07-28) — retired, archived

Already covered, either as a direct adaptation or a close conceptual reuse. **Do not reuse these exact families again until they've cycled fully out of the archive's recent history.**

- `signal-silence-hats` — hat-color knowledge-inference puzzle (Blue-Eyed-Islanders-style mechanic, small scale) — original launch set
- `cheryls-calendar` — classic Cheryl's Birthday (Albert-starts, 10-date version) — original launch set — **note: this already covers plain classic Cheryl's Birthday; a future cycle should use Bernard-starts, Denise's Revenge, or the siblings-ages variant instead of the plain version**
- `monty-switch`, `prob-choose-strategy` — Monty Hall Dilemma (two framings) — original launch set
- `logic-two-guards` — truth-teller/liar door puzzle (Two Guards) — original launch set
- `logic-sphinx-riddle` — Sphinx's Riddle — Cycle 1 addition, source: file 03
- `logic-two-aces-jack` — Boolos' Two Aces and a Jack — Cycle 1 addition, source: file 02
- `logic-hanged-statement` — Prisoner's Lie/Truth Dilemma ("I am going to be hanged") — Cycle 1 addition, source: file 03
- `math-twins-ages` — Cheryl's siblings' ages (144 product / 17 sum) — Cycle 1 addition, source: file 02
- `prob-tuesday-boy` — Tuesday Boy probability (13/27) — Cycle 1 addition, source: file 02
- `prob-two-boxes` — Newcomb's Paradox, reframed as pure expected-value comparison — Cycle 1 addition, source: file 03
- `prob-identical-twin-choice` — Twin Prisoner's Dilemma, reframed with a certainty premise — Cycle 1 addition, source: file 02
- `spatial-ant-cylinder` — Ant-Honey cylinder-unfolding problem — Cycle 1 addition, source: file 02

Everything else in Cycle 1 (math work-rate/age/ratio problems, algorithmic search/scheduling puzzles, spatial cube/geometry puzzles, number-pattern sequences) was originally authored for this site, not adapted from the source MDs, and can be treated as a distinct pool from the anthology material.

## Available, not yet used — good candidates for Cycle 3+

- **The Hardest Logic Puzzle Ever** (3-gods, True/False/Random, Embedded Question Lemma) — file 03. Expert tier; needs careful MC framing (e.g. "given B answered 'ja' to Question 1, what do we know for certain?").
- **The Rabern "truly random" amended version** and the **Two-Question Exploding-Head solution** — file 03. Very advanced; good "tough" tier content, but needs simplification for a single MC question.
- **The n-Gods Generalization / (5,2,3) and (5,1,3,1) variants** — file 02. Best as a "which claim about solvability is true" question rather than a full question-tree.
- **The Cheating Husbands Problem** — file 02. Isomorphic to Blue-Eyed/Green-Eyed Islanders (now live, see Cycle 2 above) but different flavor text; usable once that family has had another cycle to rotate.
- **Gerbrandy's Numbered Boxes Game** — file 02. Same backward-induction mechanic as the Unexpected Hanging Paradox (now live, see Cycle 2 above); good "tough" tier once that family rotates out.
- **Bernard-starts Cheryl's Birthday (SASMO variant)** — file 02. Answer: August 17. Good medium-tough tier once plain Cheryl's Birthday (archived with Cycle 1) has had a full cycle to rotate.
- **Denise's Revenge (20-date sequel)** — file 02. Answer: May 14, 2002. Very tough tier — large elimination grid.
- **GCHQ ciphers** (polygon-initials, planet-initials, French/English odd-one-out) — file 03. Clean, self-contained, good easy-medium "lateral thinking" additions, distinct flavor from the epistemic-logic-heavy puzzles.
- **Belmont Caskets (Merchant of Venice)** — file 03. Easy-tier folk riddle, not yet used.
- **The Harvard Riddle** — file 03. Easy-tier folk riddle ("Can you solve the riddle?" → "No"), not yet used.
- A large remainder of the *Puzzles to Puzzle You* catalog (file 06) — Cycle 2 used roughly half of it; #33, #34, #43, #90, #95, #97, #102, #108, #117, #133 remain permanently out of scope (diagrams/dissections), the rest are fair game once independently re-verified per that file's own conflict table.

## Explicitly out of scope (see file 03 footer for the full reasoning)

Sudoku variants, SameGame, "Clues by Sam," escape-book/puzzlehunt content (Journal 29, The Master Theorem, The Librarian's Almanaq, Maze of Games, Book of Rituals), and any lateral-thinking riddle whose source doesn't give a confirmed canonical answer.
