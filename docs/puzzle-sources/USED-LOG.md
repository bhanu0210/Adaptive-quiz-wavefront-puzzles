# Puzzle Source Usage Log

Tracks which puzzle families from `docs/puzzle-sources/*.md` have already been converted into a published Wavefront Puzzles cycle, so future rotations avoid duplicating a puzzle family that's already live (or very recently archived). Update this file as part of every rotation.

Format per entry: `puzzle-id — family name — cycle — notes`

## Cycle 1 (2026-07-28) — currently live

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

## Available, not yet used — good candidates for Cycle 2+

- **The Hardest Logic Puzzle Ever** (3-gods, True/False/Random, Embedded Question Lemma) — file 03. Expert tier; needs careful MC framing (e.g. "given B answered 'ja' to Question 1, what do we know for certain?").
- **The Rabern "truly random" amended version** and the **Two-Question Exploding-Head solution** — file 03. Very advanced; good "tough" tier content, but needs simplification for a single MC question.
- **Einstein's Zebra Puzzle** (full 15-clue version) — file 03. Flagship-hard candidate; long question body, must be independently re-solved from whichever exact clue wording is used before publishing.
- **The n-Gods Generalization / (5,2,3) and (5,1,3,1) variants** — file 02. Best as a "which claim about solvability is true" question rather than a full question-tree.
- **Blue-Eyed Islanders** (full 100-islander induction) — file 03. Already have a small hat-puzzle version live; a full-scale induction-proof MC question would be a genuinely different (harder) puzzle.
- **The Cheating Husbands Problem** — file 02. Isomorphic to Blue-Eyed Islanders but different flavor text; usable once the Islanders "family" has had a cycle to rotate.
- **Gerbrandy's Numbered Boxes Game** — file 02. Same backward-induction mechanic as the Unexpected Hanging Paradox; good "tough" tier.
- **The Unexpected Hanging Paradox** — file 03. Not yet used; good tough-tier philosophical-logic puzzle (frame narrowly, e.g. "where exactly does the prisoner's proof break").
- **Bernard-starts Cheryl's Birthday (SASMO variant)** — file 02. Answer: August 17. Good medium-tough tier once plain Cheryl's Birthday rotates out.
- **Denise's Revenge (20-date sequel)** — file 02. Answer: May 14, 2002. Very tough tier — large elimination grid.
- **GCHQ ciphers** (polygon-initials, planet-initials, French/English odd-one-out) — file 03. Clean, self-contained, good easy-medium "lateral thinking" additions, distinct flavor from the epistemic-logic-heavy puzzles.
- **Belmont Caskets (Merchant of Venice)** — file 03. Easy-tier folk riddle, not yet used.
- **The Harvard Riddle** — file 03. Easy-tier folk riddle ("Can you solve the riddle?" → "No"), not yet used.

## Explicitly out of scope (see file 03 footer for the full reasoning)

Sudoku variants, SameGame, "Clues by Sam," escape-book/puzzlehunt content (Journal 29, The Master Theorem, The Librarian's Almanaq, Maze of Games, Book of Rituals), and any lateral-thinking riddle whose source doesn't give a confirmed canonical answer.
