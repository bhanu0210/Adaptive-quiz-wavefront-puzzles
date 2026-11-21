---
name: puzzle-creation
description: House method for creating new Wavefront Puzzles content: original, moderate-to-expert multiple-choice puzzles with a 3-step hint ladder, a worked explanation, a takeaway, and an independently verified answer. Use whenever the user asks to create, write, brainstorm, adapt, or fix a puzzle, add puzzles to a category, build a new 90-puzzle roster, research new puzzle ideas online, or turn shared source material (books, links, pasted riddles) into puzzles for this site.
---

# Puzzle Creation Skill — Wavefront Puzzles

This is how to produce a puzzle that is **correct, fair, unique to this site, and teaches something**. It sits next to the existing docs and does not replace them:

| Need | Read |
| :--- | :--- |
| Full 14-day rotation (archive, cycle-meta, PR, reschedule) | `docs/PUZZLE-ROTATION.md` (the operating playbook) |
| Reference anthologies with worked solutions | `docs/puzzle-sources/01-…07-*.md` (index in `docs/puzzle-sources/README.md`) |
| Which families are live, archived, or still unused | `docs/puzzle-sources/USED-LOG.md` |
| The exact schema and tone of real published puzzles | `app/data/puzzles.json`, `app/data/launch-expansion.ts` |
| What the tests enforce | `tests/puzzle-accuracy.test.mjs` |

Use this skill for the *craft* of making each puzzle. Use `PUZZLE-ROTATION.md` for the *process* of shipping a whole roster.

---

## 1. The output contract (non-negotiable)

The engine is **text + multiple choice only**. Each puzzle is exactly this shape (match `app/data/launch-expansion.ts`):

```ts
{ id: "c3-logic-sum-product-dice",           // lowercase-hyphen, globally unique forever, cycle-prefixed
  title: "What the Sum Knew",                // >= 8 chars, evocative, never gives the answer away
  category: "Logic & Knowledge",            // one of the 6 categories below
  difficulty: 4,                             // 1–5
  time: 8,                                   // minutes a capable solver needs
  question: "...",                           // >= 40 chars, fully self-contained
  options: ["...", "...", "...", "..."],     // exactly 4
  correctOption: 0,                          // 0–3 (vary its position across a roster)
  hints: ["nudge", "mechanism", "near-solution"],   // exactly 3, distinct, each >= 30 chars
  explanation: "...",                        // >= 220 chars, full derivation, names the trap
  takeaway: "...",                           // >= 50 chars, a transferable lesson, not a restatement
  verification: { method: "...", reviewed: true, version: 1 } }  // method >= 12 chars, says HOW it was checked
```

Categories: `Logic & Knowledge`, `Mathematical Reasoning`, `Probability & Strategy`, `Algorithms & Optimization`, `Spatial Reasoning`, `Patterns & Numbers`.

**In scope:** logic and epistemic puzzles, probability, decision problems framed as computable expected value, spatial or geometric puzzles that can be fully described in words, algorithms and optimization, number patterns, riddles or ciphers with one confirmed answer.
**Out of scope:** grid puzzles (Sudoku, nonograms, Zebra-as-grid UI), anything needing an image or diagram, dissections, escape-book or puzzle-hunt content, riddles with disputed or "creative" answers, and "which philosophy is right" questions.

---

## 2. Difficulty calibration

| Level | Tier label | What it feels like | Typical mechanics | `time` |
| :-: | :-- | :-- | :-- | :-: |
| 1 | Accessible | One trap word or one insight | misdirection, unit trap, literal reading | 2–3 |
| 2 | Accessible | One insight plus a short calculation | simple counting, complement rule, invariants | 3–4 |
| 3 | Stretch | Two linked steps; the intuitive answer is wrong | conditional probability, unfolding, work-rate, parity | 5–6 |
| 4 | Expert | Several layers or casework; needs a method, not a hunch | epistemic dialogue, backward induction, optimal search, Bayes | 7–8 |
| 5 | Expert | Deep chain, a counter-intuitive result, or a famous hard family | nested knowledge, optimal stopping, derangements, information bounds | 9–10 |

**Roster mix:** about 50/50 between difficulty 1–3 and 4–5 (7 or 8 per side per category of 15). **Moderate to complex** means most new authoring should land at **3–5**.

A puzzle earns a higher number from **depth of reasoning**, never from obscure knowledge, long arithmetic, or ambiguous wording.

---

## 3. Where ideas come from (in priority order)

1. **Shared source material.** Read `docs/puzzle-sources/*.md`, then the *"Available, not yet used"* section of `USED-LOG.md`. Unused families currently include: the Hardest Logic Puzzle Ever and its variants, n-Gods, Cheating Husbands, Gerbrandy's boxes, Bernard-starts Cheryl (Aug 17), Denise's Revenge (May 14, 2002), GCHQ ciphers, Belmont Caskets, the Harvard Riddle, and the unused half of *Puzzles to Puzzle You* (file 06). **For file 06, check its cross-source conflict table first.** Puzzles #10, #25, #51, #109, #110, #111, #115 and #142 must be re-solved from scratch.
2. **New material the user shares in conversation** (uploads, links, pasted text). Save it into `docs/puzzle-sources/` as the next numbered file, in setup → solution mechanics → validated answer style, **before** using it.
3. **Live web research.** Do this every time you author a batch; see §4.
4. **Original authorship** using the uniqueness methods in §5. This is required wherever sources run thin. Historically that means Mathematical Reasoning, Algorithms & Optimization, and Patterns & Numbers.

---

## 4. Web research protocol

Search broadly and in parallel. Don't just re-find the same five classics. Good query shapes:

- `"puzzle of the week" probability <current month year>`
- `hardest logic puzzle <year> site:reddit.com/r/puzzles` · `site:puzzling.stackexchange.com <mechanic>`
- `IBM Ponder This <month year>` · `Riddler <topic>` · `math olympiad combinatorics problem <topic>`
- `counter-intuitive probability puzzle` · `knights and knaves variant` · `optimal stopping puzzle`

Reputable, idea-rich places: IBM Research *Ponder This* (monthly), Puzzling Stack Exchange, Steve Miller's *Math Riddles* (Williams College), Cut the Knot, Mind Your Decisions, Martin Gardner's collections, Brilliant wikis, olympiad archives (AoPS), and TED-Ed riddles (already partly used; see file 05).

Rules:
- **Take the mechanic, not the text.** Never copy wording from a copyrighted book, column, or paid site. Rewrite the setup, numbers, characters, hints, explanation, and takeaway in this site's voice.
- **Trust no stated answer.** Forum and blog answers are often wrong or disputed. Re-derive every answer yourself (see §7). If you can't, drop the puzzle.
- **Make it durable.** Save what you used to `docs/puzzle-sources/NN-web-research-YYYY-MM-DD.md`, with source URLs, setup, mechanism, and *your* verified answer.

---

## 5. Making a puzzle genuinely unique

A renamed classic is not a new puzzle. Apply at least **one** of these transforms, and record which one in your notes or PR:

| Transform | How | Example |
| :-- | :-- | :-- |
| **Ask a different question** | Keep the setup, ask for a quantity the classic never asks for | Sum-and-product, but ask for the *sum* when the pair itself is not determined (see §9) |
| **Change the parameters, then re-solve** | Different n, prices, rates, die faces, so the famous answer no longer applies | 100-door Monty Hall; a 4-person bridge with new times |
| **Hybridize two mechanics** | Bolt an epistemic layer onto a counting problem, a parity invariant onto a route problem | Liar/truth-teller statements whose content is a probability claim |
| **Invert it** | Give the answer and ask for the missing constraint or the earliest step where it becomes determined | "Which clue, if removed, makes the answer non-unique?" |
| **Ask where the reasoning breaks** | Present a plausible but flawed argument, and the options are the steps | the 1 = 2 fallacy, generalized to other algebra or probability fallacies |
| **Localize the story** | New setting, Indian context (₹, cities, festivals), modern objects, same rigorous core | the counterfeit-note loop in rupees |
| **Make it adversarial or strategic** | Turn a computation into a game with an opponent; answer is the winning move or value | Nim variants, threshold bidding, optimal stopping |

Then run the **uniqueness check**: grep the roster and archive for the same mechanic.

```bash
grep -n -i "<mechanic keyword>" app/data/puzzles.json app/data/launch-expansion.ts app/data/archive/*.ts docs/puzzle-sources/USED-LOG.md
```

If the same family is live or was archived in the last cycle, pick another family. Otherwise, flag it as a judgment call in the PR, the way Cycle 2 flagged painted-cube and Monty Hall.

---

## 6. Authoring the parts

**Question**
- Self-contained: every fact needed is in the text, and there are no "as everyone knows" assumptions.
- Pin down every ambiguity a sharp solver would exploit: with or without replacement, ordered or unordered, "at least" or "exactly", whether a speaker is perfectly logical, whether statements are public.
- No diagrams. If you need one, describe coordinates or dimensions in words, or drop the puzzle.

**Options (the distractors matter as much as the answer)**
- Exactly one is defensibly correct. The other three are *the answers real people actually reach*: the intuitive trap, the classic-version answer, an off-by-one or arithmetic slip, and (when honest) "cannot be determined".
- Use "cannot be determined" or "impossible" **as a correct answer** sometimes, so it doesn't become a giveaway.
- Keep options similar in length and form, and spread `correctOption` across 0–3 over a roster.

**Hints (a ladder, not three restatements)**
1. **Nudge:** where to look. Names the trap or the right lens without computing anything.
2. **Mechanism:** the method or key fact (the complement rule, unfold the cube, enumerate the candidates for each sum).
3. **Near-solution:** sets up the final step so the solver only has to finish. Never state the option outright.

**Explanation:** state the answer, then give the full derivation in prose (numbers shown), then **name the trap** and why the tempting distractor fails. Plain, confident, second-person-adjacent tone. Compare against existing puzzles before writing.

**Takeaway:** one transferable lesson that applies *beyond* this puzzle. "When X, check Y before Z." Not "The answer was 5."

**Verification method:** say *how* correctness was established, e.g. "Brute-force enumeration of all 21 unordered dice pairs through each public statement".

---

## 7. Verification (every computable answer, no exceptions)

1. **Solve it yourself by hand**, without looking at the source's answer.
2. **Write a small script** that brute-forces, simulates, or enumerates. Prefer exact enumeration over Monte Carlo. Use simulation only as a cross-check. Keep scripts in the scratchpad, not the repo, unless you add a regression test.
3. **Check uniqueness of the answer**, not just existence. Make sure no second option is also defensible, and that the puzzle doesn't secretly have zero or two solutions.
4. **Check the distractors are actually wrong** under every reasonable reading of the question.
5. For famous puzzles with **conflicting published answers** (file 06 conflict table, web threads), re-derive from first principles and note the correction, the way `c2-pattern-prime-years` (13, not 7) and `c2-pattern-pandigital-squares` (923187456, not 932187456) were corrected.
6. For important answers, add an assertion to `tests/puzzle-accuracy.test.mjs` following the existing pattern (`publishedAnswer(id)`).
7. Run `node --test tests/puzzle-accuracy.test.mjs` (and `npm test` and `npm run build` before shipping).

---

## 8. Quality gate (tick all before a puzzle counts)

- [ ] Fits the schema and length minimums in §1; id unique across live, archive, and log
- [ ] In scope (text-only, one defensible answer)
- [ ] At least one uniqueness transform from §5 applied; family not live or recently archived
- [ ] Answer independently re-derived; script or enumeration run; uniqueness of the answer confirmed
- [ ] Each distractor is a *real* mistake, and none is defensible
- [ ] Hints climb nudge → mechanism → near-solution; none reveals the option
- [ ] Explanation shows the working and names the trap; takeaway is transferable
- [ ] Difficulty and `time` match §2 and comparable published puzzles
- [ ] No verbatim copyrighted text; source logged in `USED-LOG.md` / `docs/puzzle-sources/`

---

## 9. Worked example: from idea to verified puzzle

**Idea (web and anthology):** the Freudenthal sum-and-product family (file 02) is a deep epistemic puzzle, but the classic is huge and already well known.
**Transforms:** *change the parameters* (two ordinary dice instead of numbers up to 100) plus *ask a different question*.

**Draft 1 (failed verification):** "...What are the two dice?" Enumerating all 21 unordered pairs through the three statements leaves **two** survivors, {1,4} and {2,3}. The puzzle had no unique answer. *This is exactly why §7 step 3 exists.*

**Fix:** both survivors have sum 5, so ask for the **sum** instead. The answer is unique, and the twist (you can know the sum without knowing the dice) becomes the lesson.

```ts
{ id: "c3-logic-sum-product-dice", title: "What the Sum Knew", category: "Logic & Knowledge", difficulty: 4, time: 8,
  question: "Two ordinary dice are rolled out of sight. Priya is privately told the product of the two numbers, and Sam is privately told their sum. Both are perfect logicians and both know this setup. Priya says: 'I don't know the two numbers.' Sam says: 'I already knew you wouldn't.' Priya says: 'Now I know them.' What is the sum of the dice?",
  options: ["5", "6", "7", "It cannot be determined from the conversation"], correctOption: 0,
  hints: [
    "Write out all 21 unordered pairs and note which products could come from more than one pair; only those let Priya be unsure.",
    "Sam's statement means every pair with his sum has an ambiguous product. Check each sum from 2 to 12 against that test.",
    "Only one sum passes Sam's test, and both of its surviving pairs lead to a product that Priya can now resolve."
  ],
  explanation: "The sum is 5. Priya's first statement means her product comes from more than one pair: 4 (1,4 or 2,2), 6 (1,6 or 2,3) or 12 (2,6 or 3,4). Sam could only have been certain of that if every split of his sum has one of those ambiguous products. Sum 5 is the only one that works: 1+4 gives product 4 and 2+3 gives product 6, both ambiguous. Every other sum includes a split with a unique product, such as 1+3 for sum 4 or 2+5 for sum 7. Once Priya hears this, product 4 can only mean {1,4} and product 6 can only mean {2,3}, so she knows the dice. We never learn which pair it was, yet both have sum 5. The trap is assuming the question can only be answered by finding the dice.",
  takeaway: "You can sometimes pin down a property of the answer without pinning down the answer itself; ask what all surviving cases share.",
  verification: { method: "Exhaustive enumeration of all 21 unordered dice pairs filtered through each public statement", reviewed: true, version: 1 } }
```

Verification script used:

```python
from collections import defaultdict
pairs = [(a, b) for a in range(1, 7) for b in range(a, 7)]
byP, byS = defaultdict(list), defaultdict(list)
for p in pairs: byP[p[0]*p[1]].append(p); byS[sum(p)].append(p)
s1 = [p for p in pairs if len(byP[p[0]*p[1]]) > 1]                             # Priya doesn't know
s2 = [p for p in s1 if all(len(byP[q[0]*q[1]]) > 1 for q in byS[sum(p)])]      # Sam knew she wouldn't
c = defaultdict(list); [c[p[0]*p[1]].append(p) for p in s2]
s3 = [p for p in s2 if len(c[p[0]*p[1]]) == 1]                                 # Priya now knows
print(s3, {sum(p) for p in s3})   # -> [(1, 4), (2, 3)] {5}
```

---

## 10. Category idea bank (mechanics not yet heavily used)

Use these as seeds, then apply §5 transforms and §7 verification.

- **Logic & Knowledge:** Hardest Logic Puzzle (ask what one answer proves), Cheating Husbands with a new count, Bernard-starts Cheryl, GCHQ initial-letter ciphers, statements whose truth depends on how many statements are true.
- **Mathematical Reasoning:** Diophantine age or coin problems with a unique positive solution, digit-reversal problems, clock-angle problems with a new condition, mixture or work-rate problems with a twist (a leaking tank that changes its rate).
- **Probability & Strategy:** non-transitive dice (which die beats which), the expected wait for patterns HH vs HT (6 vs 4), the gambler's ruin with small numbers, a two-envelope variant framed as computable EV, Bayes with two independent tests.
- **Algorithms & Optimization:** the minimum weighings for a fake coin with a twist, the egg-drop problem (2 eggs, 100 floors → 14), the jeep or desert-crossing problem with small n, Josephus problem variants, the fewest moves for a sorting or transfer puzzle.
- **Spatial Reasoning:** the number of regions formed by n chords (1, 2, 4, 8, 16, **31**, which breaks the pattern), cube-slicing cross-sections described in words, the minimal path on a box or cone, shadow and angle problems, the number of rectangles in an m×n grid.
- **Patterns & Numbers:** look-and-say, self-describing numbers, digital-root shortcuts, sequences with a deliberate trap (the circle-regions sequence above), cyclic numbers (142857), the smallest number with exactly k divisors.

---

## 11. Finishing up

- When adding to the live roster, follow `PUZZLE-ROTATION.md` Steps 3–7. When only drafting, put candidates in a new `docs/puzzle-sources/` file or show them to the user for review first.
- Update `USED-LOG.md` with every family you used (and any judgment calls).
- Report to the user: how many puzzles, category and difficulty mix, which sources and transforms, which answers you corrected, and anything you dropped because it couldn't be verified.
