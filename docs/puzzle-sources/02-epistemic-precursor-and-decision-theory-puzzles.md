# Epistemic, Precursor, and Decision-Theory Puzzles

Reference material for puzzle-writing. Each entry: setup, solution mechanics, and the validated answer.

---

## The Three Logicians Walk into a Bar

Three logicians walk into a bar. The bartender asks: "Would you **all** like a beer?" (a conjunction B1 ∧ B2 ∧ B3, not "who wants one").
- L1: "I don't know." → if L1 didn't want a beer, the conjunction is guaranteed false, so he'd say "No." His "I don't know" proves L1 *does* want a beer, but doesn't know about L2/L3.
- L2: "I don't know." → now knows L1 wants a beer. Same logic: L2 must want a beer too, but doesn't know about L3.
- L3: "Yes please, one for each of us!" → L3 now knows L1=yes, L2=yes, and knows his own preference is yes, so the conjunction is true.
**Learning**: sequential declarations of ignorance act as positive transmission of private state.

## Boolos' Precursor Puzzle 1: Two Aces and a Jack

Two Aces and a Jack are placed face down in a row (left, middle, right). Point to one card, ask one yes/no question. Pointing to an Ace → truthful answer. Pointing to the Jack → answer is random.

**Solution**: Point to the **middle card**, ask "Is the left card an Ace?"
- If middle is an Ace: answers truthfully. "Yes" → left is Ace. "No" → left is Jack, so right is the other Ace.
- If middle is the Jack: both left and right *must* be Aces (only one Jack exists), so regardless of the random answer, both flanking cards are Aces.
- **Rule**: "Yes" → choose left card (guaranteed Ace in both cases). "No" → choose right card (guaranteed Ace in both cases).

## Boolos' Precursor Puzzle 2: True/False in English

Speaking to either True (always truthful) or False (always lying), answering in English. One question to determine if proposition D ("Dushanbe is in Kirghizia") is true.

**Solution**: Ask "Are you True if and only if D?" In every combination of speaker identity and D's truth value, the answer is "yes" iff D is true, and "no" iff D is false — independent of which god you're talking to. (D is actually false: Dushanbe is in Tajikistan.)

## Boolos' Precursor Puzzle 3: True in Native Language

Speaking directly to True, but he only answers "da" or "ja" (meaning yes/no in unknown order). One question to determine D.

**Solution**: Ask "Does 'da' mean 'yes' if and only if D?" True's spoken word equals the truth-value of (J ↔ D) where J = "'da' means yes." Working through all four combinations, True answers "da" iff D is true, "ja" iff D is false — bypassing the unknown vocabulary mapping entirely.

## Gerbrandy's Numbered Boxes Game

n numbered boxes opened in sequence; one holds a prize. Player wins by *proving* (no guessing) the current box holds the prize just before it opens. Quiz master publicly announces: "You cannot win the game."

**Solution (backward induction, isomorphic to the Unexpected Hanging Paradox)**:
- If the prize were in box n (the last), and boxes 1..n-1 are empty, the player would know with certainty before box n opens → contradicts "you cannot win." So the prize can't be in box n.
- Knowing box n is empty, box n-1 becomes the effective "last box" — same argument eliminates it.
- Repeating this for every box collapses to "all boxes must be empty," which is absurd (the money exists somewhere).
- **Resolution**: the "proof" is a logical illusion. If the prize is placed in box 3 (say), and the player — having "proven" all boxes are empty — makes no declaration, they are genuinely surprised when box 3 is opened, fulfilling the master's statement without contradiction.

## The Freudenthal "Sum and Product" Puzzle

Integers x, y with 1 < x < y. Pete knows the product P = xy. Sam knows the sum S = x + y.
1. Pete: "I don't know the numbers." (P has multiple factorizations)
2. Sam: "I knew you didn't know." (every partition of S yields a composite product — so S can't be the sum of two primes, and S − 2 isn't prime; S must be odd; candidate set: {11, 17, 23, 27, 29, 35, 37, 41, 47, 53, ...})
3. Pete: "Now I know." (exactly one factorization of P has a sum in the candidate set)
4. Sam: "Now I also know." (exactly one partition of S produces a product that lets Pete resolve uniquely)

**Validated unique minimal solution**: x = 4, y = 13 (Sum = 17, Product = 52). Verified by testing S = 17: partitions are (2,15)→P=30, (3,14)→P=42, (4,13)→P=52, (5,12)→P=60, (6,11)→P=66, (7,10)→P=70, (8,9)→P=72. Only P=52 has exactly one factorization (4×13=52, sum 17) landing in the candidate set (its other factorization 2×26 sums to 28, not in the set) — so Pete resolves uniquely only for P=52, and among all of S=17's partitions, only 4+13 has this property, so Sam also resolves.

## The "Provence 2010" Question vs. Assertion Variant

In the Blue-Eyed Islanders scenario: what if the foreigner *asks* "Is there a blue-eyed person among you?" instead of *asserting* it?

**Solution**: No countdown triggers, nobody leaves. A public assertion of proposition P immediately becomes **common knowledge**. A public *question* about P does not — each islander can silently answer "yes" in their own mind, but that private answer is never synchronized publicly, so the infinite nested-knowledge nested chain never anchors. Mutual knowledge persists; common knowledge is never established.

## Denise's Revenge (20-Date Cheryl's Birthday Sequel)

20 possible dates across Feb/March/April/May/June. Albert told month, Bernard told day, Cheryl told year.
1. Albert: "I don't know, but I know Bernard doesn't know either." → eliminates months containing a day unique across the whole list (May 14, June 14 are unique → eliminate May and June entirely).
2. Bernard: "I still don't know." → eliminates days not appearing more than once among remaining months.
3. Cheryl: "I still don't know." → prunes years.
4–6. Sequential "now I know" statements from each collapse the remaining grid to one point.

**Validated answer**: **May 14, 2002**.

## The Ant-Honey Problem (3D Geometric Optimization)

An ant on the outer surface of a cylinder (radius r, height h) must reach honey at the exact opposite side.

**Solution**: Unfold (surface-develop) the cylinder's lateral surface into a flat rectangle of width 2πr and height h. The ant and honey are separated horizontally by πr (half the circumference) on this flat plane. Shortest path = straight line = √((πr)² + h²) by the Pythagorean theorem. **Key technique for puzzle-writing**: pick r and h so that half-circumference and height form a clean Pythagorean triple (e.g. half-circumference=8, height=6 → hypotenuse=10) rather than leaving π in the answer.

---

## The n-Gods Generalization (Advanced Propositional Logic)

Generalizes the Hardest Logic Puzzle Ever to n gods: m Random, k Truthful, n−m−k Lying, all answering in unknown "da"/"ja" language.

**Solvability theorem**: an (n, m) gods puzzle is deterministically solvable **iff the number of random gods is strictly less than the number of non-random gods** (m < n − m, i.e. 2m < n). Proven by induction: query god γ1 via the Embedded Question Lemma about whether another god is Random; if γ1 answers reliably (non-random), the query works directly; if γ1 turns out to be Random himself, removing him from the pool still leaves a non-random majority in the (n−1)-god subproblem, so induction applies.

- The (5, 2, 3) variant (5 gods, 2 Random, 3 Truthful) is solvable in a conjectured optimal average of **4.1375 questions**.
- The (5, 1, 3, 1) variant (1 Random, 3 Truthful, 1 Lying) is solvable in exactly **4.6 questions on average**.

**Puzzle-writing note**: this family is best used as a "which claim about solvability is correct" multiple-choice question (e.g. "is a 5-god puzzle with 3 Random and 2 non-random solvable?" → No, since 3 ≥ 5−3=2, violating m < n−m) rather than trying to replicate the full multi-branch question tree in a single MC puzzle.

## The SASMO "Bernard-Starts" Cheryl's Birthday Sequel

Same 10 dates as classic Cheryl's Birthday, but Bernard speaks first this time.
1. Bernard: "I don't know, but I know Albert doesn't know either." → eliminates days that would let Albert know instantly if only one date remained per month (May 19, June 18 are the unique days → eliminate them).
2. Albert: "I still don't know." → if Albert's month had become uniquely determined by step 1's elimination (June's only remaining date is June 17), Albert would know — since he doesn't, June is eliminated too.
3. Bernard: "Now I know." → his day must be unique among the surviving months (May, July, August). Checking each day: 14 appears in two months, 15 in two, 16 in two, but **17 appears only in August** → unique.
4. Albert: "Then I also know." → August's only remaining date is August 17.

**Validated answer**: **August 17**.

## The Cheating Husbands Problem

N married couples in a town; some husbands cheat. Every wife instantly knows about every *other* cheating husband but not her own. Law: a wife who can *prove* her husband cheats must execute him at midnight. Queen announces: "At least one husband here is unfaithful."

**Solution (isomorphic to Blue-Eyed Islanders)**: if there are exactly k cheating husbands, nothing happens for the first k−1 nights. On night k, all k unfaithful husbands are executed simultaneously — because each of their wives, seeing k−1 other cheaters, expected them to be executed on night k−1 under the "k−1 cheaters" hypothesis; when that didn't happen, each deduces her own husband must be the extra one.

## The Tuesday Boy Probability Puzzle

"I have two children. One is a boy born on a Tuesday. What is the probability both are boys?"

**Rigorous solution**: model each child as (gender ∈ {B,G}) × (day ∈ 1..7), giving 14 states per child, 196 ordered pairs for two children.
- |E| (at least one Tuesday-boy) = 14 + 14 − 1 = 27 (inclusion-exclusion).
- |F∩E| (both boys AND at least one Tuesday-boy) = 7 + 7 − 1 = 13.
- **P(both boys | at least one Tuesday boy) = 13/27 ≈ 0.4815.**
- Contrast: without the day detail, P(both boys | at least one boy) = 1/3. Specifying an otherwise-irrelevant detail (day of week) shifts the answer because it unevenly partitions the sample space.

## The Sleeping Beauty Problem

Sleeping Beauty sleeps Sunday; fair coin flipped. Heads → woken once Monday. Tails → woken Monday and Tuesday (memory wiped between). Asked each waking: "What's your credence the coin landed Heads?"

- **Halfer position (1/2)**: no new first-order information was gained upon waking (she knew she'd wake regardless of outcome), so credence stays at the fair-coin prior.
- **Thirder position (1/3)**: her indistinguishable waking states partition into three equally-likely cases {H∩Mon, T∩Mon, T∩Tue}, so credence of Heads = 1/3.
- **Decision-theoretic note**: EDT-style Dutch Book arguments favor the Thirder position (a Halfer credence of 1/2 can be exploited by a bookie across repeated trials; 1/3 protects against this). This is a genuinely contested philosophical question — **avoid presenting it as having one indisputably "correct" answer** in a multiple-choice puzzle; if used, frame the question narrowly (e.g. "which position avoids a Dutch Book under EDT" rather than "what is the correct credence").

## The Twin Prisoner's Dilemma

You and a psychological-twin (identical reasoning) independently choose Cooperate/Defect, no communication. Payoffs: both Cooperate → $5 each. Both Defect → $1 each. Mixed → defector $10, cooperator $0.

- **CDT**: defecting strictly dominates regardless of the twin's unknown action (causally independent) → both defect, $1 each.
- **EDT**: your action is near-certain evidence of your twin's action (P(twin cooperates|I cooperate)≈1) → expected value of cooperating ($5) beats defecting ($1) → both cooperate, $5 each.
- **FDT**: treats the decision as a shared algorithm's output; the algorithm must output "Cooperate" to secure $5 in both instantiations.
- **Puzzle-writing note**: safest to frame as a factual premise ("your choice and your twin's choice are guaranteed to match") rather than invoking CDT/EDT/FDT by name, so the correct answer (cooperate, $5) follows from pure arithmetic over the two *reachable* outcomes, sidestepping the decision-theory dispute.

## The Counterfactual Mugging

Omega (extremely accurate predictor) flips a coin. Tails → approaches you, asks for $100, promising that had the coin been Heads, paying-on-Tails-policy would have earned you $10,000. Heads → Omega does nothing (but would have paid $10,000 if it had predicted you'd pay on Tails). Coin lands Tails; Omega asks for $100.

- **CDT**: refuse — the coin outcome is already fixed; paying can't retroactively change it. Refusing nets $0 (vs. −$100 if paying).
- **FDT** (expected value across both branches of the policy): "Pay on Tails" policy → EV = 0.5×(−$100) + 0.5×($10,000) = $4,950. "Refuse on Tails" policy → EV = $0. FDT recommends paying, since the policy is what's evaluated, not the single realized branch.
- **Puzzle-writing note**: like Newcomb's Paradox, frame the multiple-choice question around the *computed expected value comparison* (which is uncontested arithmetic) rather than declaring one decision theory "the" rational choice.
