# Source 05 — Wits and Wonders: TED-Ed / Shakuntala Devi Compendium

Provenance: user-supplied handbook "Wits and Wonders: The Ultimate Logic & Mathematical Puzzles Handbook" — compiles TED-Ed's animated logic-riddle series, Shakuntala Devi's *The Book of Numbers*, and the full 150-puzzle catalog from her *Puzzles to Puzzle You*. Added to the reference library on 2026-08-03.

**Verification status**: Sections A–C below carry a full worked derivation from the source and can be adapted with a normal independent re-check (per the rotation playbook's "recompute before trusting" rule). **Section D is a compact directory with only a final answer, no derivation shown** — treat anything pulled from Section D as needing a *full from-scratch re-solve*, not just a spot-check, before it's usable; the source's own note ("mathematically validated for exactness") is not a substitute for the site's own verification step.

Several entries below describe a diagram, physical arrangement, or dissection rather than a single computable answer — those are flagged inline as **out of scope** per the site's text+4-option-MC-only engine (see `03-core-anthology-and-folk-riddles.md` footer for the general scope rule).

---

## Section A — TED-Ed Logical Riddles (YouTube series)

### A1. Einstein's Riddle (the 5-houses zebra puzzle)
**Setup**: 5 houses, each a different color (Red, Green, Blue, Yellow, White), owner nationality (Brit, Dane, German, Norwegian, Swede), drink (Water, Tea, Milk, Coffee, Root Beer), cigar (Pall Mall, Dunhill, Blends, Prince, BlueMaster), and pet (Bird, Dog, Cat, Horse, Fish) — all distinct across houses. 15 clues (standard Zebra Puzzle clue set — see numbered list in the handbook, identical to the classic Einstein's Riddle / Zebra Puzzle wording).
**Solution mechanic**: Constraint-propagation logic grid. Anchor from the two absolute-position clues (milk in house 3, Norwegian in house 1), then cascade colors → nationalities → beverages → cigars → pets through the relative-adjacency clues, re-checking each new deduction against all 15 constraints.
**Validated answer**: The German, in the Green house, owns the **Fish**.
**Site fit**: Already well-covered by "Einstein's Zebra Puzzle" candidate in `03-core-anthology-and-folk-riddles.md` / `USED-LOG.md`'s not-yet-used list — this is the same puzzle family (identical clue set), not a new one. Use as a cross-check of the canonical clue wording, not a second independent entry.

### A2. The Bridge Riddle (rope-bridge / lantern crossing)
**Setup**: 4 people (you: 1 min, lab assistant: 2 min, janitor: 5 min, professor: 10 min) must cross a bridge that holds at most 2 people at once, always requiring the lantern, within a 17-minute deadline.
**Solution mechanic**: Classic bridge-and-torch optimization. The key insight is to send the two *slowest* people across together (so their high individual times are only "paid" once), and always have the fastest available person ferry the lantern back.
**Validated answer**: 1+2 cross (2) → 1 returns (1, total 3) → 10+5 cross together (10, total 13) → 2 returns (2, total 15) → 1+2 cross (2, total **17**). Everyone crosses in exactly 17 minutes.
**Site fit**: Good, self-contained optimization/algorithms puzzle — MC framing could ask for the minimum total time, or "who should make the second return trip."

### A3. The Control Room Riddle (pyramid floor-graph puzzle)
**Setup**: Pyramid building, floor *n* has *n* rooms. Find the highest floor where every room has exactly 3 doors to other rooms on that floor, except one room (the control room) with exactly 1 door.
**Solution mechanic**: Graph theory / handshake lemma. Sum of vertex degrees on a floor with N rooms = 3(N−1) + 1 = 3N−2, which must be even ⟹ N must be even (rules out all odd floors). Floor 4 (N=4) is shown to be structurally impossible to lay out despite satisfying the parity check; Floor 6 (N=6) admits a valid 3-regular-plus-one-leaf graph.
**Validated answer**: **Floor 6** (from the top).
**Site fit**: Good "Algorithms & Optimization" or graph-theory logic puzzle — the parity argument (why odd floors are impossible) is a clean, self-contained MC question; the "floor 4 fails despite passing parity" step makes a good second, harder question or a hint-ladder rung.

### A4. The Green-Eyed Logic Puzzle (100 logicians, common knowledge)
**Setup**: 100 imprisoned logicians, all secretly green-eyed but unaware of their own color, no mirrors/communication, freed if they correctly deduce their own eye color at a nightly headcount. An outsider states publicly: "At least one of you has green eyes" (information they already privately knew).
**Solution mechanic**: Induction on common knowledge — the statement doesn't add new *first-order* information, but it does create common knowledge (everyone now knows that everyone knows that everyone knows...). Base cases N=1, N=2, N=3 walked through explicitly, then generalized by induction.
**Validated answer**: All 100 leave together on **night 99** (i.e., the 99th night after the statement, seen at the 100th morning headcount).
**Site fit**: This is the Blue-Eyed Islanders family, already flagged in `USED-LOG.md` as "available, not yet used" (full 100-islander induction version) — this entry corroborates that exact framing and answer (night 99 / N−1 nights for N islanders). Treat as confirming detail for that existing candidate, not a new family.

### A5. The Passcode Riddle (product/sum/uniqueness deduction)
**Setup**: Three positive integers a≤b≤c with product 36; the sum equals a hallway number Zara knows but we don't; she needs a third clue ("the largest number is unique") to solve it, implying the sum alone was ambiguous.
**Solution mechanic**: Enumerate all triples with product 36 and their sums; the fact that a third clue was *needed* means the sum must be one that's shared by more than one triple (13, shared by {1,6,6} and {2,2,9}); the uniqueness-of-largest clue then breaks the tie.
**Validated answer**: **{2, 2, 9}** (sum 13; {1,6,6} is eliminated because its largest value, 6, repeats).
**Site fit**: Excellent, self-contained "logic from silence" deduction puzzle (same genus as the Sum & Product puzzle already in file 02) — clean MC fit, e.g. "why did Zara need the third clue?" or "what is the passcode?"

### A6. The Prisoner Hat Riddle (10 prisoners, parity strategy)
**Setup**: 10 prisoners in a line, each sees only the hats of those in front. Guessing starts from the back; at least 9 of 10 must guess their own hat color (black/white) correctly to survive.
**Solution mechanic**: Parity-encoding strategy — the first (back) guesser sacrifices their own certain-knowledge to encode the parity of black hats they see (says "black" for odd count seen, "white" for even). Each subsequent prisoner updates the running parity as they hear guesses, letting them deduce their own hat with certainty.
**Validated answer**: All 9 front prisoners guess correctly with certainty; the back prisoner has a 50% chance — **guaranteed to meet the 9-of-10 survival bar.**
**Site fit**: Good MC puzzle — ask what strategy guarantees the bound, or trace a specific example (as the handbook does) and ask what the back prisoner's colour-coded guess reveals.

### A7. The River Crossing Riddle (lions and wildebeest)
**Setup**: 3 lions + 3 wildebeest, raft holds ≤2, at least one animal must operate the raft, wildebeest are eaten if lions ever outnumber them on either bank (raft included).
**Solution mechanic**: State-space search / careful sequencing — isomorphic to the classic missionaries-and-cannibals problem. The handbook gives one valid 11-move solution sequence.
**Validated answer**: All 6 cross safely in **11 crossings** (minimum for this constraint pattern).
**Site fit**: Classic, well-known puzzle family (missionaries & cannibals reskin) — fine as an MC "minimum number of crossings" question, but check it isn't so well-known it reads as generic; consider pairing with a twist (e.g., asking which crossing step is forced vs. which has a symmetric alternative).

### A8. The Temple Riddle (2 liars among 9, path-finding via majority)
**Setup**: 4 unknown paths, 8 students + narrator (narrator always truthful) explore them in groups (1 solo + 1 pair + 2 trios), exactly 2 of the 8 students may lie.
**Solution mechanic**: Majority-vote-proofing — a trio can never be fully corrupted (only 2 liars exist total), so a unanimous trio is trustworthy; conflicting trios still yield a majority-truth signal; the pair is the only group that can be fully unreliable.
**Validated answer**: The correct path can **always** be determined via majority agreement in the trios, cross-checked against the solo and pair reports — no single canonical "path number" (scenario-dependent), the deliverable is the *decision procedure*.
**Site fit**: Good "which claim can you trust" epistemic-logic puzzle in the same family as the Cheating Husbands / hat-color reasoning already catalogued — frame the MC question around *why* a unanimous trio must be truthful, not around a specific path number (since the puzzle as stated has no fixed numeric answer).

---

## Section B — Shakuntala Devi, *The Book of Numbers*

### B1. Lilavati's Broken Necklace
**Setup**: A necklace breaks; 1/3 of pearls fall to the ground, 1/5 stay on the couch, 1/6 are found by the girl, 1/10 recovered by her lover, and 6 pearls remain on the string. Find the total.
**Solution mechanic**: Linear equation — (1/3 + 1/5 + 1/6 + 1/10)x + 6 = x, solved via LCD 30: 24/30 x + 6 = x ⟹ x/5 = 6 ⟹ x = 30.
**Validated answer**: **30 pearls.**
**Site fit**: Clean, short algebra/fraction puzzle — good "Mathematical Reasoning" MC entry, easy-medium tier.

### B2. Lilavati's Complex Operation (reverse-arithmetic chain)
**Setup**: A chain of operations (×3, +3/4 of product, ÷7, −1/3 of quotient, square, −52, √, +8, ÷10) applied to an unknown number yields 2. Find the original number.
**Solution mechanic**: Work backward from the final result, inverting each operation in reverse order (×10, −8, square, +52, √, solve the "diminished by 1/3" step algebraically, ×7, solve the "increased by 3/4" step algebraically, ÷3).
**Validated answer**: **28.**
**Site fit**: Good "reverse the operations" puzzle — matches the site's existing tone for compact algebra chains; the multi-step algebraic-inverse parts (steps 7 and 9 in the handbook) are the interesting bit worth testing in an MC hint ladder.

---

## Section C — Shakuntala Devi, *Puzzles to Puzzle You* (fully worked deep-dives)

### C1. Tall Men Next Door (Puzzle 1)
**Setup**: 4 brothers, distinct heights, average 74". First three differ by 2" each; 3rd and 4th differ by 6".
**Solution**: h, h+2, h+4, h+10; sum = 4(74) = 296 ⟹ 4h+16=296 ⟹ h=70.
**Validated answer**: **70", 72", 74", 80".**

### C2. A Matter of Time (Puzzle 2)
**Setup**: "Fifty minutes ago it was 4× as many minutes past 3:00 as it is now until 6:00." Find minutes until 6:00.
**Solution**: x = minutes to 6:00 now ⟹ time now is 6:00−x ⟹ 50 min ago was 5:10−x, i.e., 130−x minutes past 3:00; set equal to 4x: 130−x=4x ⟹ x=26.
**Validated answer**: **26 minutes** (current time 5:34).

### C5. Over the Golden Gate (Puzzle 5)
**Setup**: 40 mph one way, 25 mph return over the same distance. Find average speed for the round trip.
**Solution**: Harmonic-mean trap — average speed = total distance / total time = 2D / (D/40 + D/25) = 400/13.
**Validated answer**: **30 10/13 mph** (not the naive arithmetic mean of 32.5).
**Site fit**: Great MC distractor bait — the wrong "average of the two speeds" answer (32.5) makes a natural incorrect option, teaching the harmonic-mean lesson explicitly (good worked-example tip candidate too).

### C6. Bicycle Thieves (Puzzle 6)
**Setup**: Customer buys a Rs 350 bike (cost Rs 300) with a bad Rs 400 cheque; shopkeeper gets it cashed by a neighbor, gives Rs 50 change; next day the cheque is worthless and the shopkeeper refunds the neighbor Rs 400.
**Solution**: Net loss = value handed to the thief = the bicycle's cost (Rs 300) + cash change (Rs 50); the cheque's face value nets out since it was fake from the start.
**Validated answer**: **Rs 350 total loss.**

### C8. The Bus Number (Puzzle 8)
**Setup**: A bus number (1–500) is a perfect square, and still a perfect square when the plate is read upside-down.
**Solution**: Only digits 0,1,6,8,9 survive inversion (6↔9). Checking perfect squares under 500 built only from those digits: 196 = 14², which inverts to 961 = 31².
**Validated answer**: **196.**

### C10. To Catch a Thief (Puzzle 10)
**Setup**: Thief has a head start; officer's 2 steps = thief's 5 steps in length; thief takes 8 steps to officer's 5 in time.
**⚠ Flag**: The handbook's own working shows visible self-correction mid-derivation (it first assumes a "7-step" head start, gets a non-clean answer, then explicitly rewrites the head start as **27 steps** based on quoted source text). **Re-derive this one from scratch before using it** — don't trust either the 7 or 27 figure without independently reconstructing the "48 steps + 27 start = 75 steps = 30 officer-steps" relationship stated in the source.
**Solution (as corrected in source)**: Officer step length O = 2.5 × thief step T (since 2O=5T). Thief's 8:5 step-count ratio ⟹ thief takes 1.6 steps per officer step. With a 27-step head start: 2.5x = 27+1.6x ⟹ x=30.
**Validated answer (per source, needs re-verification)**: **30 officer steps.**

### C13. The Counterfeit Note (Puzzle 13)
**Setup**: A counterfeit Rs 100 note circulates through a chain of trades/debt-payments (you → plumber → milkman → tailor → neighbor → back to you), until discovered as fake.
**Solution mechanic**: Legal/logical insight rather than arithmetic — a worthless note voids every transaction it touched, so every original debt in the chain still stands as if the note never existed.
**Validated answer**: **All transactions are void; original debts are restored; net loss falls on whoever is left holding the fake note / an unpaid debt at the end of the chain.**
**Site fit**: Good lateral-thinking / "reasoning about money" puzzle, no computation needed — matches the decision-theory/epistemic flavor of file 02.

### C14. Cotton or Gold (Puzzle 14)
**Setup**: Is a pound of cotton or a pound of gold heavier?
**Solution mechanic**: Trick relies on differing weight systems — cotton uses avoirdupois (16 oz = 7000 grains/lb), gold uses troy (12 oz = 5760 grains/lb).
**Validated answer**: **A pound of cotton is heavier** (more grains per "pound" in avoirdupois than in troy).
**Site fit**: Great short lateral-thinking trivia puzzle, easy tier, unambiguous and independently verifiable (standard unit definitions).

### C15. Nuts for the Nuts (Puzzle 15)
**Setup**: 770 peanuts split among 3 brothers in ratio 4:3 (Tinku:Rinku) and 6:7 (Tinku:Jojo); combined ages total 17.5 years in the same proportion.
**Solution**: Combine ratios via LCM of the shared term (Tinku=12): Tinku:Rinku:Jojo = 12:9:14, 35 parts total, 770/35=22 per part.
**Validated answer**: **Peanuts — Tinku 264, Rinku 198, Jojo 308. Ages — Tinku 6, Rinku 4.5, Jojo 7.**

### C45. For the Charities (Puzzle 45)
**Setup**: Donate (half your money + Rs 1) to poor boys, then (half of what's left + Rs 2) to an orphanage, then (half of what's left + Rs 3) to a temple, leaving Rs 1.
**Solution mechanic**: Work backward from the Rs 1 remainder, undoing each "half-plus-constant" step: (1+3)×2=8, (8+2)×2=20, (20+1)×2=42.
**Validated answer**: **Rs 42** starting amount.
**Site fit**: Same reverse-the-operations mechanic as B2 — good pairing/variation, or pick one to avoid the two feeling redundant in the same cycle.

### C144. The Mango Thieves (Puzzle 144)
**Setup**: 3 thieves share a basket of <100 mangoes overnight; each in turn wakes, eats 1, takes 1/3 of what remains, and goes back to sleep; in the morning the leftover is exactly 1 more than a number divisible by 3.
**Solution mechanic**: Work forward from a candidate starting count under 100 that survives three "subtract 1, divide evenly by 3, keep 2/3" steps and lands on a remainder ≡ 1 (mod 3); source finds 79 works cleanly.
**Validated answer**: **79 mangoes** total (78→take 26, leaves 52; 51→take 17, leaves 34; 33→take 11, leaves 22 = 3×7+1). ✅ independently checks out arithmetically.
**Site fit**: Strong "Algorithms & Optimization" / modular-arithmetic puzzle, good tough-tier candidate — the "why 79 and not some other number under 100" search process makes a good 3-step hint ladder.

---

## Section D — Complete Directory, *Puzzles to Puzzle You* #1–150 (answers only, NOT independently re-derived)

This is the source's own compact answer-key table. **Do not adapt any of these into a puzzle without first re-deriving the answer from the stated problem** — no working is shown here, several entries look ambiguous or print-error-prone even in the source's own footnotes (see inline flags), and per the rotation playbook's rule for external material, an unverified stated answer is not sufficient to publish.

**Out-of-scope entries** (require a diagram, physical arrangement, or dissection the text+MC engine can't render — do not adapt): #7 (digit rearrangement, needs written-out numerals — usable as text though), #17 (weights — usable, it's just numbers), #26 (packing circles — usable, numeric answer), #28 (chessboard coloring — usable, numeric/word answer), #33 (Roman-numeral clock dissection — **out of scope**, needs a diagram), #34 (painted-window diagram — **out of scope**), #43 (line-drawing construction — **out of scope**), #90 (matchstick rearrangement — **out of scope**, needs physical layout), #94 (ink-spot geometry — usable if framed as "find the diameter," it's a pure computation), #95 (spade-to-heart dissection — **out of scope**), #97 (coin arrangement — **out of scope**, needs diagram), #102 (circular arrangement — **out of scope** unless reframed as "which arrangement is valid" from given options), #108 (dot-connection diagram — **out of scope**), #117 (square dissection into 4 pieces — **out of scope**), #121 (round-robin schedule table — usable if reframed as a single question, e.g. "how many total matches"), #133 (dot-and-line path puzzle — **out of scope**, needs grid).

**Answer-ambiguity flags**: #25 (source gives two conflicting answers depending on family-count assumption — resolve which reading is intended before use), #92 (multiple-occurrence claim — re-verify the "7 occurrences in 1924" count by brute-force calendar check rather than trusting the source), #111 (source itself flags a possible print error, 300 vs 200 ft — resolve definitively before use), #115 (source gives two possible answer pairs — pick and verify one), #143 (source notes "other combinations exist" — this puzzle likely lacks a unique answer as stated; probably not usable as-is for a single-correct-option MC question without tightening the constraints).

| # | Name | Scenario | Source-stated answer |
|---|---|---|---|
| 3 | Brothers and Sisters | Each boy has equal brothers/sisters; each girl has 2× brothers vs sisters | 4 boys, 3 girls |
| 4 | Around the Equator | Two trains circle the equator opposite directions, equal speed | Train against Earth's spin wears out first |
| 7 | Digits and Squares | Arrange 9 digits into smallest/largest square numbers | 139854276 / 932187456 |
| 9 | Hour and Minute Hand | Occasions clock hands are exactly opposite | Y = 30/11·[(n−1)2+1] min past hour |
| 11 | The Gong | Clock strikes 7 in 7s; how long for 10? | 10.5 seconds |
| 12 | Orange Marmalade | Sells half + half an orange to 3 customers in turn | 7 oranges |
| 16 | Wedding Anniversary | Wife was 3/5 husband's age at marriage, now 3/4 | Jayant 24, Mohini 18 |
| 17 | Wholesale Weights | Min. weights to weigh any integer 1–121 lb | 1, 3, 9, 27, 81 lb |
| 18 | Broken Glasses | 3p/delivery, −9p/break, earns Rs 2.40 of 100 | 5 broken, 95 safe |
| 19 | Peculiar Number | Number = 3× sum of its digits | 27 |
| 20 | Make a Century | 100 as mixed number, digits 1–9 once, 11 ways | e.g. 81 5643/297 |
| 21 | Perplexed Clerk | 75p from 2p/1p(6×)/5p stamps | 5×2p, 30×1p, 7×5p |
| 22 | Missing Paisa | Marbles pooled 3-for-1p & 2-for-1p, sold 5-for-2p | 1 paisa loss (ratio mismatch) |
| 23 | Walking to Happiness | Husband walks early, met by wife, arrives 10 min early | Walked 55 minutes |
| 24 | On the Line | Ticket types needed for 25 stations | 600 tickets |
| 25 | The Legacy | Divide Rs 1,920,000 per stated ratios | Rs 240,000 (or Rs 49,200 — ⚠ ambiguous, see flag above) |
| 26 | The Round Table | Saucers dia. d on table dia. 15d | 187 saucers |
| 27 | Down the Escalator | 26 steps/30s vs 34 steps/18s | 46 steps total |
| 28 | Chess Board Coverage | Cover board minus 2 opposite corners w/ dominoes | Impossible (same-color squares) |
| 29 | Cats and Mice | Cats kill 999,919 mice, constraints on counts | 991 cats, 1009 mice each... (991 cats killed 1009 mice) |
| 30 | Wheels | Forewheel +4 rev vs hindwheel in 96 ft | Fore 8 ft, hind 12 ft circumference |
| 31 | Blow Hot Blow Cold | F° = C° | −40° |
| 32 | Llama Race | Segment-timed mile race | 9 minutes |
| 33 | Shattered Clock | Roman clock breaks into 4 parts, each sums to 20 | Diagram-dependent — **out of scope** |
| 34 | Painted Window | 4×4 ft window, 50% painted, stays square | Diagram-dependent — **out of scope** |
| 35 | Animals on the Farm | 5 droves, 8 dealers, Rs 17/cow Rs 2/sheep Rs 2/pig, total Rs 301 | 120 animals: 3 cows, 8 sheep, 109 pigs |
| 36 | Better Bargain | Rs 35 (reg. 40) vs Rs 30 (reg. 35) | Second frock better by 2.38% |
| 37 | Walking All the Way | Meet enroute, arrive together | 7:00 P.M. |
| 38 | Train and Cyclist | Late cyclist meets train 6 mi ahead of crossing | 72 mph |
| 39 | Something for Profit | Buy 60, sell 70, buy 80, sell 90 | Rs 20 profit |
| 40 | The Digital Game | 2nd digit 4 less than 1st; ÷ digit sum = 7 | 84 |
| 41 | Number and Square | 3×3 grid, row2=2×row1, row3=3×row1 | 192/219/273/327 |
| 42 | Faulty Machine | Find 1 faulty of 10 in 2 weighings | Weigh 1-each, then graduated 2nd weighing |
| 43 | Squares and Right Angles | 2 squares + 4 right triangles, 8 lines | Diagram-dependent — **out of scope** |
| 44 | Dishonest Merchant | Blend Rs 32/Rs 40 coffee → Rs 43, 25% profit | 70 kg @32, 30 kg @40 |
| 46 | Number Game | 3 consecutive numbers, product/each summed = 74 | 4, 5, 6 |
| 47 | Sari and Blouse | Total Rs 110, sari = blouse + Rs 100 | Sari Rs 105, blouse Rs 5 |
| 48 | When Was He Born? | "2 days ago I was 10, next year I'll be 13" | Born Dec 31, said on Jan 1 |
| 49 | Weight of Block | Balances 3/4 lb + 3/4 of itself | 3 lb |
| 50 | Lucrative Business | Rs 2000, +50% every 3 yrs, after 18 yrs | Rs 22,781.25 |
| 51 | The Old Ship | Ship 2× as old as boiler was when ship = boiler's current age | Ship 16⅔, boiler 13⅓ |
| 52 | Three Containers | Measure 10 oz from 19/13/7 oz containers | 15 pours |
| 53 | Way to Market | Met man w/ 7 wives×4 bags×4 dogs×4 puppies | Only 1 (narrator) going to market |
| 54 | Matter of Denominator | Denom. = numer.+6; +8 to denom → 1/3 | 7/13 |
| 55 | Right Foot Forward | Short man 3 steps : tall man's 2 steps | Never step out together on right foot |
| 56 | Problem of Socks | 20 white/20 brown, pick in dark for a pair | 3 socks |
| 57 | Fair Division | 100 acres, 1/3+1/4+1/5, one heir dies, redivide | Rashmi 4/7, Mala 3/7 |
| 58 | Heads I Win | Bet half of cash per toss, equal W/L | Net loss (25%/cycle) |
| 59 | Math & Literature | 100 applicants, 10 none, 70 math, 82 lit | 62 took both |
| 61 | Up the Ladder | 40 ft window, ladder foot 9 ft from wall | 41 ft ladder |
| 62 | Pigs and Ducks | 60 eyes, 86 feet | 13 pigs, 17 ducks |
| 63 | Egg Vendor | 50–100 eggs; ÷2,÷3 exact, ÷5 leaves 3 | 78 eggs |
| 64 | Some Luck! | Rs 2 + Rs 3 for Rs 5 ticket, win 50 sheep | Rs 30/sheep |
| 65 | Faulty Watch | Hands meet every 65 min | Gains 60/143 min/hr |
| 66 | Trains and Falcon | Trains 50 mi apart @25 mph, falcon @100mph | 100 miles |
| 67 | More Lucrative | Rs 300/yr raise vs Rs 100/half-yr raise | Second option better |
| 68 | Mammu's Marbles | Nawal gives 1→equal; Mammu gives 1→Nawal 2× | Mammu 5, Nawal 7 |
| 69 | Family Matter | 5 relatives' ages vs mother | Mother 39; 21,18,18,12,9 |
| 70 | High-Rise Apartments | 437 apartments, mixed categories | 9×2-room, 13×2.5-room, 27×3-room, ... |
| 71 | License Plate | 5-digit plate reads +78,633 inverted | 10968 → 89601 |
| 72 | Lose or Gain | Two lathes Rs 600 each, ±20% | Rs 50 net loss |
| 73 | See-Saw Balance | 16 bricks short end / 11 long end, brick=3lb | ~39.79 lb (girl's weight) |
| 74 | Marbles Pick | 12 marbles, 4 colors×3, pick 2 same color | 4 marbles |
| 75 | Special Number | 2×number = ½×number + 45 | 30 |
| 76 | Sawing Tree Trunk | 12ft trunk → 1 cut/min for pieces | 11 minutes (for 12 pieces) |
| 77 | The Bigamist | Two train lines' offset schedules | Churchgate train 9 min after Bandra; ~90% chance |
| 78 | The Split | Split 34: 1/x of one = 1/y of other | 14 and 20 |
| 79 | At the Fete | 25/20/18/12 people, Rs 1330 total | Rs 350/350/420/210 |
| 80 | At the Store | Spend half; left rupees=paise(swap), half rupees=paise | Rs 99.98 |
| 81 | Counterfeit Coins | 1 fake of 120, 5 weighings | 5-step balance decision tree |
| 82 | Multiplying Bacteria | Doubles daily, full day 10 | Half-full day 9 |
| 83 | Mathematical Shepherd | Sheep split: diff = diff of squares | 1 sheep |
| 84 | Puzzling Number | Number exceeds its 1/3, 1/10, 1/12 parts by 58 | 120 |
| 85 | What a Coincidence | 7 players double others on win, end Rs 32 each | Arun 112.25, Binoy 56.25, ... |
| 86 | The Idler | −Rs10/idle, +Rs8/work, net 0 in 30 days | 16⅔ worked, 13⅓ idle |
| 87 | Matchstick Game | 17 sticks, take 1–4, win strategy | Take 2 first, then leave multiples of 5 |
| 88 | Father and Son | Father 4× son; in 30 yrs son = half father | Father 60, son 15 |
| 89 | Bargain in Guavas | 18 for Rs1.20 vs 16, saves 10p/dozen | 18 guavas |
| 90 | Six Matches | Rearrange 6 matches to spell nothing | Diagram-dependent — **out of scope** |
| 91 | No Change Please | Rs1.15 in 6 coins, no change possible for standard denominations | 1×50p, 1×25p, 4×10p |
| 92 | Date to Reckon With | 20th-century year, most Date×Month=Year matches | 1924 (7 occurrences — ⚠ re-verify count) |
| 93 | Gold Bucket | Full of half-sovereigns vs half-full of sovereigns | Full bucket worth more |
| 94 | Ink-Spot on Table | Table in corner, spot 8"/9" from walls | 58" diameter |
| 95 | Spade to Heart | Cut spade into 3 pieces → heart | Diagram-dependent — **out of scope** |
| 96 | Number Puzzle | Two numbers differ by 3, squares differ by 51 | 10 and 7 |
| 97 | Coin Alignment | 10 coins, 5 lines of 4 | Diagram-dependent — **out of scope** |
| 98 | Squirrel and Post | 16ft cylinder, spiral, 1 circuit/4ft | 20 feet |
| 99 | Hearts Apart | Meet enroute, speed ratio 4:3, 63 mi total | Man 36 mi, woman 27 mi |
| 100 | The Curfew | 5+3 beers split w/ friend paying Rs 8 | First man Rs 7, second Rs 1 |
| 101 | Problem of Age | Reversed-digit ages, diff = 1/11 of sum | Wife 45, husband 54 |
| 102 | Circular Numbers | Arrange 1–10 in circle, diametric-sum property | Diagram-dependent — **out of scope** |
| 103 | Passenger and Goods | Passing-time ratio same vs opposite direction | Passenger train 2× as fast |
| 104 | Rice for Festival | 100kg to 100 people: 3/2/0.5 kg by age group | 5 old, 25 young, 70 children |
| 105 | Threes to Make 31 | Write 31 using digit 3 five times | 3³+3+3/3 = 31 |
| 106 | Swarm of Bees | Classic bee-swarm fraction riddle | 72 bees |
| 107 | Candle Burning | Same-length candles burn in 4h/5h, one 4× longer (lit later) | 3h45m |
| 108 | Dotted Square | Connect 12 of 25 dots into cross w/ 5 inside | Diagram-dependent — **out of scope** |
| 109 | Three Farmers | Mules/cows/goats graze pasture for Rs1000 | 25 goats; payments Rs180/Rs320 |
| 110 | Up and Down Stream | Row upstream/downstream rate comparison | 3 3/11 minutes |
| 111 | Shadow Steeple | 5ft staff → 2ft shadow; steeple shadow 120ft | 300 ft (⚠ source flags possible print error, 200ft alt.) |
| 112 | Wine and Water | Repeated partial transfer between containers | 1:40 vs 40:1 ratio symmetry |
| 113 | Long Tunnel | 1-mi train @1mi/min through 1-mi tunnel | 2 minutes |
| 114 | Horse, Cow, Sheep | Pairwise grazing days: H+C=40, H+S=60, C+S=90 | 37 17/19 days (all three together) |
| 115 | Two Math Men | Age diff 30, product 1624 | 64 & 20 (⚠ source notes alt. 58 & 28) |
| 116 | Tire Mileage | Car 20,000 mi, 5 tires rotated equally | 16,000 mi/tire |
| 117 | Dissection Square | 1.5-square shape → 4 identical pieces | Diagram-dependent — **out of scope** |
| 118 | Sixteen Fours | Make 1000 using sixteen 4s | 444+444+44+44+4×6 = 1000 |
| 119 | Strange Two Numbers | Squares' diff = a cube; cubes' diff = a square | 10 and 6 |
| 120 | How Much? | 2/5 of mine = 4/9 of yours (two 10p coins) | 18 paise |
| 121 | Mixed Doubles | 4 couples, mixed-doubles tennis, 3 days | Round-robin schedule table |
| 122 | Consistent Discount | 1024→640→400→250, find next | Rs 156.25 (×5/8 each step) |
| 123 | Pineapples & Jackfruit | 6 pineapple + 2 jackfruit = Rs 15 | Pineapple Rs1.75, jackfruit Rs2.25 |
| 124 | Necklace Sections | Join 5 sections of 4 links into 1 | Rs 8 (open one section's 4 links) |
| 125 | Three Square Boards | Areas differ by 5 sq ft pairwise | Sides 31, 41, 49 in |
| 126 | Demochares Age | Life fractions: 1/4 boy,1/5 youth,1/3 man,+13 dotage | 60 years |
| 127 | Reena and Seena | Combined age 44, ratio condition | Reena 27.5, Seena 16.5 |
| 128 | Painted 3x3x3 Cube | Painted outside, cut to 27 unit cubes | 26 cubes painted (only core unpainted) |
| 129 | Smoking Not Prohibited | 6 butts → 1 cigarette; from 36 butts? | 7 cigarettes |
| 130 | Taxi Driver | Div. by 11, remainder 1 for 2,3,4,5,6 | 121 |
| 131 | Crate Load Share | 3 laborers share 2 crates over 3 mi | Each carries 2 of the 3 miles |
| 132 | Mr. Portchester | Transfer wine: 10,10,5,4 qt containers | 11-step pouring sequence |
| 133 | Dots and Lines | 3×3 grid, connect w/ 4 continuous lines | Diagram-dependent — **out of scope** |
| 134 | Longfellow's Bees | Fractional bee-swarm riddle | 15 bees |
| 135 | Tennis Tournament | Single-elim bracket, 30 players | 29 matches |
| 136 | Triangles in Star | Count triangles in a 5-point star | 20 triangles |
| 137 | Driving Country | Day1=7mi, lastday=51mi, +4mi/day | 348 mi over 12 days |
| 138 | The Sabbath Day | Christian/Jew/Turk share a Sabbath day | Travel the globe in opposite directions |
| 139 | Canvas Dimensions | 72 sq in, margins 4"/2" | 10 in × 20 in |
| 140 | Mystery of Eleven | Largest 9-of-10-digit number ÷11 | 987652413 |
| 141 | Rose Garden | Quadrilateral sides 20,16,12,10, max area | 194.4 sq rods |
| 142 | Squares in Square | Count squares in 4×4 grid | 30 squares |
| 143 | Farmer Animals | Mules/oxen/goats/pigs avg Rs 30 | 1 mule,1 ox,2 goats,1 pig (⚠ not unique — see flag) |
| 145 | Stephanie's House | Houses 1..N, sum-before = sum-after her house | House 204 of 288 |
| 146 | Rupees and Paise | Rs700 in equal counts of 25p/50p/Re1 | 400 of each |
| 147 | Sawing the Cube | 3" cube → 27×1" cubes, min cuts | 6 cuts (center cube needs all 6 faces exposed) |
| 148 | Two Trains | Pass; arrive 1h/4h later respectively | One train 2× as fast |
| 149 | Perfect Squares | 4 numbers, all pairwise + total sums square | a=10430,b=3970,c=2114,d=386 (⚠ re-verify — unusually large for the puzzle genre) |
| 150 | Unexpired Lease | 99-yr lease, 2/3 past = 4/5 future | 45 years remaining |

---

## Suggested next steps for a future rotation cycle

Good, clearly-in-scope candidates from this source not yet cross-referenced in `USED-LOG.md`: A3 (Control Room graph puzzle), A5 (Passcode deduction), A6 (Prisoner Hat parity), B1/B2 or C45 (reverse-arithmetic chain — pick one), C6 (Bicycle Thieves loss puzzle), C8 (Bus Number), C14 (Cotton or Gold), C15 (Nuts for the Nuts ratio split), C144 (Mango Thieves modular arithmetic), plus straightforward numeric entries from Section D once independently re-derived (e.g. #19 Peculiar Number, #75 Special Number, #96 Number Puzzle, #130 Taxi Driver, #140 Mystery of Eleven are all short, clean, and easy to verify by hand).
