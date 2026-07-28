# Core Anthology: Truth-Tellers, Common Knowledge, Decision Paradoxes, and Folk Riddles

---

## The Hardest Logic Puzzle Ever (George Boolos, original)

Three gods A, B, C are True (always truthful), False (always lying), Random (coin-flip determines truth/lie *before* answering). They answer only "da"/"ja" (yes/no in unknown order). Determine all three identities in exactly 3 yes/no questions.

**The Embedded Question Lemma**: for any question Q, ask E(Q) = "If I asked you 'Q', would you say 'ja'?" Regardless of the god's identity and regardless of what "ja"/"da" actually mean, **the physical utterance "ja" always means the true answer to Q is "yes."** (Proof: True's double-affirmation and False's double-negation both cancel out; Random's coin-flip-then-lie-or-truth also cancels the same way.)

**Solution**:
1. Ask B: "If I asked you 'Is A Random?', would you say 'ja'?" → "ja" means C is guaranteed not Random; "da" means A is guaranteed not Random.
2. Ask the guaranteed-non-random god (say C): "If I asked you 'Are you False?', would you say 'ja'?" → "da"→True, "ja"→False.
3. Ask that same now-identified god: "If I asked you 'Is B Random?', would you say 'ja'?" → resolves the last two identities.

## The Hardest Logic Puzzle Ever (Rabern & Rabern's amended "truly random" version)

Boolos' original coin-flips-*then*-answers rule made Random predictable under self-referential questions. Amended rule: whether Random says "ja" or "da" is *itself* the coin flip (entirely decoupled from truth). Under this rule the Embedded Question Lemma no longer works on Random at all — questions must be routed to strictly avoid ever needing Random's answer to carry information. Same 3-question structure as above still works because Question 1 always identifies a guaranteed non-random god regardless of B's actual identity.

## The Two-Question "Exploding God-Head" Solution

If a god is asked a self-referential paradox question (e.g. "will you answer this with the word that means *no*?"), a truthful god trapped in the paradox and a lying god trapped in the paradox both become physically unable to answer — their "head explodes" (Silence), creating a **third information channel** beyond da/ja. Using the "Tempered Liar Lemma" (a nested biconditional referencing a target god B), a single question to A yields three distinguishable outcomes:
- Silence → B is True
- "ja" → B is False
- "da" → B is Random

This solves the puzzle in **2 questions** instead of 3, since Silence is treated as a valid third data-state bypassing the usual binary information limit.

## Boolos' Card Puzzle — see file 02 (Two Aces and a Jack)

## The Trivial God Puzzle (Zephyr, Eurus, Aeolus)

Three gods, all always truthful, in unknown order among three names. Solvable in exactly 2 questions using the same Tempered Liar Lemma silence-trick (even truthful gods can be forced into unanswerable self-reference if the question is built around a target's identity).

---

## The Blue-Eyed Islanders (Common Knowledge Induction)

1000 islanders, k=100 with blue eyes (rest brown). No mirrors, no discussing eye color. If a person deduces their own eye color, they must leave at the next midnight. A visiting Guru publicly states: "At least one of you has blue eyes."

**Paradox**: everyone already saw ≥99 blue-eyed people, so this seems to add no new *factual* information. Yet on **night 100**, all 100 blue-eyed islanders leave simultaneously.

**Resolution — mutual vs. common knowledge**:
- Base case (k=1): the sole blue-eyed person sees no other blue eyes, instantly knows the Guru meant them, leaves night 1.
- Inductive step (k=n): each blue-eyed person sees n−1 others and reasons "if I'm not blue-eyed, those n−1 would all leave on night n−1 (by induction)." When night n−1 passes with no departures, everyone deduces there must be n blue-eyed people including themselves — all leave night n.
- What changed: before the announcement, "someone has blue eyes" was **mutual knowledge** up to 99 levels deep, but the 100th level of nested knowledge ("does A know that B knows that C knows...") was false. The public announcement collapses all levels into **common knowledge** simultaneously, providing a synchronized starting clock (T0) the recursive induction needs. The 99 days of silence are not empty — they're an active process of eliminating hypothetical worlds one level at a time.

## Cheryl's Birthday (classic, Albert-starts version)

10 dates: May 15/16/19, June 17/18, July 14/16, August 14/15/17. Albert told month, Bernard told day.
1. Albert: "I don't know, but I know Bernard doesn't know either." → eliminates May and June (they contain days — 19, 18 — unique across the whole list, which would let Bernard know instantly).
2. Bernard: "At first I didn't know, but now I know." → eliminates day 14 (appears in both remaining months, July and August).
3. Albert: "Then I also know." → August still has two candidates (15, 17), so the month must be July.

**Validated answer**: **July 16**.

---

## Newcomb's Paradox

Predictor Omega presents Box A (transparent, always $1,000) and Box B (opaque; $1,000,000 if Omega predicted you'd take only B, $0 if it predicted you'd take both). Prediction already made and box already set before your choice.

- **CDT (two-box)**: the money is already physically set; your choice can't retroactively change it. Two-boxing dominates in every fixed state of Box B (always $1,000 more than one-boxing in that same state).
- **EDT (one-box)**: given near-perfect predictor accuracy, your choice is strong evidence of the prediction. At 99% accuracy: EV(one-box) = 0.99×$1,000,000 = $990,000. EV(two-box) = 0.01×$1,001,000 + 0.99×$1,000 ≈ $11,000. One-boxing has vastly higher expected value.
- **Puzzle-writing note**: frame multiple-choice questions around the *expected-value arithmetic* (uncontested) rather than "what should a rational agent do" (genuinely debated).

## The Unexpected Hanging Paradox (Surprise Exam)

Judge sentences a prisoner Sunday: execution at noon on one weekday next week (Mon–Fri), and it "will be a surprise" — the prisoner won't know the day until the hangman knocks that noon.

**The prisoner's flawed-seeming deduction**: Friday is ruled out (if alive Thursday night, Friday is the only day left, so it wouldn't be a surprise). With Friday gone, Thursday is ruled out the same way. Backward induction eliminates every day — prisoner concludes execution is impossible. The hangman then knocks on **Thursday**, genuinely surprising him, and the sentence is fulfilled exactly as decreed.

**Two schools of resolution**:
- *Logical school*: the judge's decree is a self-contradictory pair of axioms (execution WILL happen on some day; prisoner CANNOT deduce which). From an inconsistent premise set, the prisoner's own "proof" becomes worthless, so a real surprise is still possible.
- *Epistemological school*: "surprise" is a blindspot of knowledge — a proposition can be true, but a rational agent's belief in a self-undermining decree can't consistently track it as known.

## The Monty Hall Dilemma

Three doors, one car, two goats. You pick Door 1. Monty (who knows the contents) opens a different door with a goat, then offers a switch.

**Solution**: your first pick has 1/3 chance of being right; the other two doors together carry 2/3. Monty's deliberate reveal of a guaranteed-goat door doesn't touch your original 1/3 — it concentrates the full 2/3 onto the single remaining unopened door. **Switching wins 2/3 of the time; staying wins 1/3.** (Bayes' theorem formalization: P(C1|H3)=1/3, P(C2|H3)=2/3.)

---

## Folk & Literary Riddles

**The Sphinx's Riddle**: "What goes on four legs in the morning, two legs at noon, three legs in the evening?" → **A human** (crawls as an infant, walks upright as an adult, uses a cane in old age — morning/noon/evening map onto a single lifetime).

**The Riddle of Venice / Belmont Caskets** (*Merchant of Venice*): Gold ("gain what many men desire"), Silver ("get as much as he deserves"), Lead ("give and hazard all he hath"). → **Lead casket** holds the portrait — true love requires sacrifice and humility, not superficial desire (gold) or entitled pride (silver).

**The Harvard Riddle**: a string of deliberately contradictory, unsolvable clues ending in "Can you solve the riddle?" → **"No"** — since the riddle body is genuinely unsolvable, the only truthful answer to the literal final question is "No."

**The Prisoner's Lie/Truth Dilemma**: king says "make one statement; if it's a lie, hanged; if true, shot." → **"I am going to be hanged."** If hanged, the statement becomes true — but true statements are supposed to be punished by shooting, contradiction. If shot, the statement becomes a lie — but lies are supposed to be punished by hanging, contradiction. Neither punishment can be carried out consistently, so the king must free the prisoner.

**Two Guards / Truth-teller-Liar Door Puzzle**: one guard always truthful, one always lies; one door leads to freedom, one to execution; ask either guard one question. → Ask: "If I asked the other guard whether this door leads to freedom, would they say yes?" A "no" answer always means the door you pointed at is the free one; "yes" means the other door is. (Multiplication-of-signs trick: the two negations/impersonations cancel identically regardless of which guard you ask.)

---

## Einstein's Riddle (The Zebra Puzzle) — full clue set for reference

Five houses in a row, each a different color, owner of different nationality, drink, cigarette brand, and pet.
1. The Englishman lives in the red house.
2. The Spaniard owns the dog.
3. Coffee is drunk in the green house.
4. The Ukrainian drinks tea.
5. The green house is immediately to the right of the ivory house.
6. The Old Gold smoker owns snails.
7. Kools are smoked in the yellow house.
8. Milk is drunk in the middle house.
9. The Norwegian lives in the first house.
10. The Chesterfields smoker lives next to the fox owner.
11. Kools are smoked next to where the horse is kept.
12. The Lucky Strike smoker drinks orange juice.
13. The Japanese smokes Parliaments.
14. The Norwegian lives next to the blue house.
15. (Some source variants add) the Blend smoker lives next to the water drinker.

**Validated solution grid**: House1=Yellow/Norwegian/Water/Kools/Cat, House2=Blue/Ukrainian/Tea/Chesterfields (or Blends)/Horse, House3=Red/Englishman/Milk/Old Gold (or Pall Mall)/Snails (variant-dependent on the exact 15-clue set used), House4=Ivory/Spaniard/Orange Juice/Lucky Strike/Dog, House5=Green/Japanese/Coffee/Parliaments/**Zebra**. **The Norwegian drinks water; the Japanese owns the zebra.** (Note: published clue-sets vary slightly in wording for clues 6/10/11/15 — always re-derive the full grid from whichever exact clue list is used before publishing an answer, since minor wording differences change which house gets which pet/cigarette.)

**Puzzle-writing note**: full 15-clue Zebra puzzles are extremely long for a single multiple-choice question. Best used sparingly as a "flagship hard puzzle" with the full clue list in the question body, asking a single final fact (who owns the zebra / who drinks water), and independently re-solved via grid elimination before publishing.

---

## GCHQ Puzzle Book Ciphers (clean, self-contained lateral-thinking puzzles)

**Cipher 1 — polygon initials**: "If 3=T, 4=S, 5=P, 6=H, 7=H, what is 8?" → the numbers are polygon side-counts, mapped to the first letter of the polygon's name: Triangle, Square, Pentagon, Hexagon, Heptagon. 8 sides = **Octagon → O**.

**Cipher 2 — planet initials**: "M, V, E, M, J, S, U, ?" → first letters of the solar system's planets in order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, **Neptune → N**.

**Cipher 3 — bilingual odd-one-out**: "Which is the odd one out: CHAT, COMMENT, ELF, MANGER, PAIN, POUR?" → every word except one is also a valid French word (chat=cat, comment=how, manger=to eat, pain=bread, pour=for). **ELF** is not a French word → odd one out.

---

## Explicitly Out of Scope for This Site (do not attempt to convert into puzzles)

- **Sudoku variants** (Killer Sudoku, Kropki Dots, Thermometers, Arrow Sudoku, Knight's Move, "Ascension," "Rat Run," "Sumthings," "Small Difference Loop," "Star Product," "Deficit Sudoku," "Liar Sudoku," "Parity Lines," "Remote Clones," etc.) — require an actual interactive grid UI this site doesn't have.
- **SameGame and "Clues by Sam"** — require interactive grid/board game engines.
- **Escape-book / puzzlehunt content** (Journal 29, The Master Theorem, The Librarian's Almanaq, The Maze of Games, The Book of Rituals) — depend on physical book pages, images, or external web portals we don't have access to or rights to reproduce.
- **Lateral-thinking "how come" mysteries without a confirmed canonical answer in the source material** (e.g. "The Deadly Dish" mentioned in the tabletop compendium) — do not fabricate a solution; only use lateral riddles where the source gives a definitive, verifiable answer (like the Harvard Riddle or the Sphinx's Riddle above).
