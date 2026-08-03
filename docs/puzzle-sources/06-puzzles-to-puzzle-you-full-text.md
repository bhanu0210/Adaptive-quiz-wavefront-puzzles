# Source 06 — Puzzles to Puzzle You (full problem text + solutions)

Provenance: user-supplied full text of Shakuntala Devi's *Puzzles to Puzzle You* (problem statements **and** solutions for all 150 puzzles). Added to the reference library on 2026-08-03.

**This supersedes the thin "Section D" answer-only directory in `05-wits-and-wonders-handbook.md`** for anything touching this same 150-puzzle catalog — that section only had a brief scenario paraphrase and a bare final answer with no derivation; this file has the **verbatim problem wording** (needed to adapt a puzzle into a faithful multiple-choice question) plus the book's own solution reasoning. Keep using file 05's out-of-scope and ambiguity flags (repeated/reconciled below); this file adds full text and a few *new* discrepancy flags found by cross-checking the two sources against each other.

**Verification status**: the book's stated solutions below are its own working, not independently re-derived by a Wavefront session. Per the rotation playbook, **recompute every answer from scratch before publishing it** — this is true even more so than usual here, because cross-checking this file against file 05 already turned up several places where the two sources disagree on the numeric answer to the *same* puzzle (flagged inline under "Cross-source conflicts" at the bottom). Don't silently pick one; resolve it by independent computation.

**Out-of-scope reminder**: puzzles that depend on a diagram, physical arrangement, or dissection (not a single computable number/word) are out of scope for this site's text+4-option-MC engine — same list as flagged in file 05 (#33, #34, #43, #90, #95, #97, #102, #108, #117, #133; #7's digit-rearrangement and #121's schedule table are usable since the answer is a written string/number).

---

## Puzzles 1–50

**1. Tall Men Next Door** — Problem: 4 brothers of different heights, average 74"; first three differ by 2" each; 3rd and 4th differ by 6". Find each height. — Answer: **70", 72", 74", 80"**.

**2. A Matter of Time** — Problem: "Fifty minutes ago it was four times as many minutes past three o'clock" as minutes now until six o'clock. Find minutes until six. — Answer: **26 minutes**.

**3. Brothers and Sisters** — Problem: Each boy has as many sisters as brothers; each girl has twice as many brothers as sisters. How many of each? — Answer: **4 boys, 3 girls** (boys = girls+1 by the boys' condition; testing small cases against the girls' condition picks out 4 and 3).

**4. Around the Equator** — Problem: Two identical trains start together at the equator, same speed, opposite directions, different tracks. Which wears its wheel treads out first? — Answer: **The train travelling against the Earth's spin** — centrifugal force effectively reduces its net speed relative to the ground less, per the book's reasoning (novelty/lateral-thinking puzzle, not a computation).

**5. Over the Golden Gate** — Problem: 40 mph one way, 25 mph return over the same distance. Average speed for the round trip? — Answer: **30 10/13 mph** (harmonic mean via total-distance/total-time; NOT the naive 32.5 mph average of the two speeds — the book explicitly calls out this trap).

**6. Bicycle Thieves** — Problem: Bike sold for Rs 350 (cost Rs 300) paid with 4×Rs100 bad travellers cheques; seller got the cheques cashed by a neighbor, gave the buyer Rs 50 change; next day the cheques bounce and the neighbor is refunded. Total loss? — Answer: **Rs 350** (bicycle's Rs 300 cost + Rs 50 cash change — exactly what the thief walked away with).

**7. The Digits and Square Numbers** — Problem: Arrange all 9 nonzero digits once each into a single smallest and single largest perfect square. — Answer: Smallest **139854276** (=11826²); largest **932187456** (=30384²).

**8. The Bus Number** — Problem: Bus numbered 1–500, a perfect square, still a perfect square upside-down. — Answer: **196** (=14²; inverts to 961=31², the only such number under 500 using only invertible digits 0,1,6,8,9).

**9. The Hour Hand and the Minute Hand** — Problem: Formula for when hour/minute hands are exactly opposite. — Answer: **Y = 30/11 × [(n−1)×2 + 1]** minutes past 12, where n is the next hour (worked example: between 4 and 5, Y = 270/11 = 24 6/11 min).

**10. To Catch a Thief** — Problem: Thief 7 steps ahead; officer's 2 steps = thief's 5 in length; thief takes 8 steps to officer's 5 (in time). Steps needed to catch him? — ⚠ **Cross-source conflict with file 05**: file 05 (via the other handbook) shows the derivation actually uses a **27-step** head start, not 7, to reach a clean answer — this file's problem statement says "seven steps ahead" verbatim but the solution below only works out cleanly with 27. **Do not use either source's number as-is; re-derive the head start and the answer from scratch.** — Answer (as stated here): **30 officer steps** (thief takes 48 in the same time, +27 head start = 75 thief-steps = 30 officer-steps by the 5:2 length ratio).

**11. The Gong** — Problem: Clock takes 7 seconds to strike 7. How long to strike 10? — Answer: **10.5 seconds** (6 intervals in 7s ⟹ 7/6 s/interval; 10 strikes = 9 intervals × 7/6 = 10.5s).

**12. Something for the Marmalade** — Problem: Girl sells "half an orange more than half" her oranges to each of 3 customers in turn, ending with none, never cutting an orange. Starting count? — Answer: **7 oranges**.

**13. The Counterfeit Note** — Problem: A found Rs 100 note circulates through several debt payments and returns to the finder, then is discovered counterfeit. Who lost what? — Answer: **All transactions are void; every debtor still owes exactly what they owed before the note appeared** — no real loss is created by the note itself.

**14. Cotton or Gold** — Problem: Heavier — a pound of cotton or a pound of gold? — Answer: **Cotton** (avoirdupois pound = 16 oz vs troy pound = 12 oz/5760 grains for gold).

**15. Nuts for the Nuts** — Problem: 770 peanuts (1000 minus 230 kept) split among 3 brothers, ratio Tinku:Rinku=4:3, Tinku:Jojo=6:7; ages (summing to 17.5) in the same proportion. — Answer: **Tinku 264 nuts/6 yrs, Rinku 198/4.5 yrs, Jojo 308/7 yrs** (combined ratio 12:9:14, 35 parts, 22 nuts/part).

**16. The Wedding Anniversary** — Problem: 12th anniversary; wife was 3/4 husband's age at marriage, now she's 5/6 his age. Ages at marriage? — Answer: **Jayant 24, Mohini 18.**

**17. I'll Get It for You Wholesale** — Problem: Minimum weights (integer lb) to weigh any integer amount 1–121 lb. — Answer: **5 weights: 1, 3, 9, 27, 81 lb** (base-3 balanced ternary).

**18. The Broken Glasses** — Problem: 3 paise/delivered glass, −9 paise/broken, net Rs 2.40 from 100 glasses. Number broken? — Answer: **5 broken, 95 delivered safely.**

**19. The Peculiar Number** — Problem: A number equal to 3× the sum of its digits. — Answer: **27** (2+7=9, 9×3=27).

**20. Make a Century** — Problem: 100 as a mixed number using digits 1–9 once each; 11 known solutions, one with a single integer digit. — Answer: e.g. **81 5643/297** or **81 7524/396** (one of eleven valid expressions).

**21. The Perplexed Postal Clerk** — Problem: 75 paise as 2p stamps + 6×that many 1p stamps + remainder in 5p stamps. — Answer: **5×2p, 30×1p, 7×5p** stamps.

**22. The Mystery of the Missing Paisa** — Problem: Two women, 3-for-1p and 2-for-1p, each with 30 marbles unsold, pool and sell at 5-for-2p; total is 24p, not the expected 25p. Explain. — Answer: **The "5 for 2p" shortcut only equals the sum of the separate rates when the pooled marbles are in a 3:2 ratio** — with equal amounts (30 and 30) instead, the combined sale undercharges by 1 paisa per 60 marbles.

**23. Walking Back to Happiness** — Problem: Wife normally picks husband up at the station at 6pm; one day he leaves work an hour early, starts walking, she meets him en route, they arrive 10 min earlier than usual. How long did he walk? — Answer: **55 minutes.**

**24. On the Line** — Problem: 25 stations, tickets sold between any ordered pair. How many distinct ticket types? — Answer: **600** (25×24).

**25. The Legacy** — Problem: Rs 1,920,000 estate; each son gets 3× a daughter's share, each daughter gets 2× the mother's share. Mother's (aunt's) share? — ⚠ **Cross-source conflict with file 05**, which showed two candidate figures (Rs 240,000 or Rs 49,200) depending on family-count assumption. **This source states a single answer without ambiguity — but re-derive independently before trusting either number**, since the family composition (number of sons/daughters) isn't given verbatim in either extracted problem statement, which is exactly why two different readings produced two different figures. — Answer (per this source): **Rs 49,200.**

**26. The Round Table** — Problem: Table diameter = 15× saucer diameter (both circular); saucers placed without overlapping each other or the table edge. Max saucers? — Answer: **187 saucers.**

**27. Down the Escalator** — Problem: Walking down, 26 steps takes 30s; 34 steps takes 18s (escalator also moving). Total visible steps? — Answer: **46 steps.**

**28. The Chess Board** — Problem: 64-square board minus 2 diagonally-opposite corners; can 31 dominoes (2 squares each) cover it? — Answer: **No** — each domino covers one black and one white square, but the two removed corners are the same color, leaving an unequal 30/32 split.

**29. The Game of Cats and Mice** — Problem: Some cats kill 999,919 mice total, each cat killing an equal number, more than the number of cats. — Answer: **991 cats, each killing 1009 mice** (999919 = 991 × 1009, both prime).

**30. The Wheels** — Problem: Forewheel makes 4 more revolutions than hindwheel over 96 ft; if forewheel circumference were 3/2× and hindwheel 4/3× as great, the gap would be only 2 revolutions over the same distance. Circumferences? — Answer: **Forewheel 8 ft, hindwheel 12 ft.**

**31. Blow Hot Blow Cold** — Problem: Temperature reading the same on both Celsius and Fahrenheit scales. — Answer: **−40°** (both scales).

**32. The Llama Race** — Problem: First 3/4 mile run in 6¾ min; first half-mile takes as long as second half-mile; third quarter takes as long as the last quarter. Total time for the mile? — Answer: **9 minutes.**

**33. The Shattered Clock** *(out of scope — diagram)* — Problem: Roman-numeral clock face breaks into 4 parts, each part's numerals summing to 20. — Answer (source): four groupings each summing to 20 (source's own worked grouping is internally inconsistent between the two handbooks — not usable without a diagram anyway).

**34. The Painted Window** *(out of scope — diagram)* — Problem: 4×4 ft square window, half the area painted, remaining clear area still a 4×4 ft square. — Answer: **Paint diagonally / as 4 corner triangles forming an inner diamond**, per source.

**35. Animals on the Farm** — Problem: 5 equal droves (cows/sheep/pigs) sold to 8 dealers at Rs17/cow, Rs2/sheep, Rs2/pig, total Rs 301. — Answer: **120 animals: 3 cows, 8 sheep, 109 pigs.**

**36. Which Is the Better Bargain?** — Problem: Frock A: Rs 35, normally 8/7 of that; Frock B: Rs 30, normally 7/6 of that. Which is the better discount, by how much? — Answer: **Frock B, by about 2.38%.**

**37. Walking All the Way** — Problem: One walker starts noon from Bangalore, the other starts 2pm from Tumkur (same road); they meet at 4:05pm and both arrive at their destinations at the same time. Arrival time? — Answer: **7:00 P.M.**

**38. The Train and the Cyclist** — Problem: Cyclist rides 12 mph, normally meets a train at a level crossing; one day 25 min late, meets the train 6 miles past the crossing. Train's speed? — Answer: **72 mph.**

**39. Something for Profit** — Problem: Buy Rs 60 → sell Rs 70 → buy back Rs 80 → sell Rs 90. Net profit? — Answer: **Rs 20 profit.**

**40. The Digital Game** — Problem: 2-digit number; 2nd digit is 4 less than 1st; number ÷ digit-sum = 7. — Answer: **84.**

**41. The Number and the Square** — Problem: Arrange 1–9 in a 3×3 grid so row 2 = 2× row 1 and row 3 = 3× row 1 (example given: 192/384/576). Other 3 valid arrangements? — Answer: **219/438/657, 273/546/819, 327/654/981** (top rows **192, 219, 273, 327**).

**42. The Faulty Machine** — Problem: 10 machines make flywheels; one makes over/under-weight parts. Find it in 2 weighings. — Answer: **Take n parts from machine n (1 from #1, 2 from #2, …), weigh the combined lot once; the deviation from expected total weight, divided by the per-part error, identifies the faulty machine** (2nd weighing narrows over- vs under-weight if needed).

**43. Squares and Right Angles** *(out of scope — diagram)* — Problem: Make 2 squares + 4 right triangles from 8 straight lines. — Answer: overlapping-squares construction, per source (diagram-dependent).

**44. The Dishonest Merchant** — Problem: Blend Rs32/kg and Rs40/kg coffee into 100 kg, sell at Rs43/kg for 25% profit. Kilos of each? — Answer: **70 kg @ Rs32, 30 kg @ Rs40.**

**45. For the Charities** — Problem: Donate (half your money +Rs1), then (half of what's left +Rs2), then (half of what's left +Rs3), left with Rs1. Starting amount? — Answer: **Rs 42.**

**46. The Number Game** — Problem: Product of 3 consecutive integers, divided by each in turn, quotients sum to 74. — Answer: **4, 5, 6.**

**47. The Sari and the Blouse** — Problem: Sari + blouse = Rs 110; sari costs Rs 100 more than blouse. — Answer: **Sari Rs 105, blouse Rs 5.**

**48. When Was He Born?** — Problem: "Two days back I was ten, next year I'll be thirteen." Age now? — Answer: **11 years old** (born Dec 31; the conversation happens on Jan 1 — book gives the specific dates Jan 1 / Dec 31 of a stated year pair).

**49. The Weight of the Block** — Problem: A block balances with 3/4 lb + 3/4 of itself. — Answer: **3 lb.**

**50. Lucrative Business** — Problem: Rs 2,000 capital, +50% every 3 years, total after 18 years. — Answer: **Rs 22,781.25.**

---

## Puzzles 51–100

**51. The Old Ship** — Problem: "The ship is twice as old as its boiler was when the ship was as old as the boiler is now. Combined age of ship + boiler = 30." Ages? — ⚠ **Cross-source conflict**: file 05 (other handbook) gives **ship 16⅔, boiler 13⅓** (summing to exactly 30); this source gives **"15 and 15, or specifically boiler 12 / ship 18"** — none of these three candidate pairs are mutually consistent, and "15/15" doesn't even satisfy the puzzle's asymmetric phrasing. **Re-derive from the classic age-ratio algebra before using this puzzle** — do not trust either source's number.

**52. The Three Containers** — Problem: Containers of 19 (empty), 13 (full), 7 (full) oz; measure exactly 10 oz. — Answer: **Solvable via a ~15-step pouring sequence** (both sources agree on feasibility; exact step count differs slightly between sources — re-verify the minimal sequence before publishing a step-count answer).

**53. On the Way to Market** — Problem: Met a man with 4 wives, each with 4 bags of 4 dogs with 4 puppies each; how many going to market? — Answer: **Just the narrator (1)** — everyone else was met, i.e. coming from the opposite direction.

**54. A Matter of Denominator** — Problem: Denominator exceeds numerator by 6; +8 to denominator gives 1/3. — Answer: **7/13.**

**55. Right Foot Forward** — Problem: Short man: 3 steps per tall man's 2 steps, both start left foot. When do both step out right together? — Answer: **Never** (the step-parity never realigns).

**56. A Problem of Socks** — Problem: 20 white + 20 brown socks in the dark; how many to guarantee a matching pair? — Answer: **3 socks.**

**57. A Fair Division** — Problem: 100 acres to 3 daughters in ratio 1/3:1/4:1/5; one daughter dies before division. Fair split of the remaining two? — Answer: **Rashmi 4/7, Mala 3/7** (their original ratio 1/3:1/4 renormalized).

**58. Heads I Win, Tails I Lose** — Problem: Gambler bets half his cash each toss; wins and losses end up equal in count. Net result? — Answer: **Net loss** — e.g. after 1 win + 1 loss he has 3/4 × ... actually 1/2×3/2 = 3/4 of original per WL pair? Source states 9/16 after two tosses of each — **re-derive the exact multiplicative factor per win/loss pair before using**, but the qualitative answer (net loser) is solid: repeated ½-up/½-down cycles are multiplicatively lossy.

**59. Mathematics and Literature** — Problem: 100 applicants; 10 neither; 70 some math; 82 some literature. Both? — Answer: **62** (70+82−90=62, via inclusion-exclusion with 90 having at least one).

**60. Problem from Lilavati** — Problem: Reverse-arithmetic chain (×3, +3/4 of product, ÷7, −1/3 of quotient, square, −52, √, +8, ÷10) → 2. Original number? — Answer: **28.**

**61. Up the Ladder** — Problem: Window 40 ft up, ladder foot 9 ft from wall. Ladder length? — Answer: **41 ft** (Pythagorean: √(40²+9²)=41).

**62. Pigs and Ducks** — Problem: 60 eyes, 86 feet total. — Answer: **13 pigs, 17 ducks** (30 animals total from eyes; 4p+2d=86 and p+d=30 ⟹ p=13, d=17).

**63. The Egg Vendor and His Eggs** — Problem: 50–100 eggs; divisible evenly by 2 and 3, remainder 3 when divided by 5; compensation at 50 paise/egg. — Answer: **78 eggs, Rs 39 paid.**

**64. Some Luck!** — Problem: Radha paid Rs2, narrator paid Rs3 of a Rs5 ticket; won 50 sheep (20/30 split by ticket share), but value split equally, narrator pays Radha Rs150 to equalize. Value per sheep? — Answer: **Rs 30/sheep.**

**65. The Faulty Watch** — Problem: Hands coincide every 65 minutes instead of the true ~65 5/11 min. Gain or loss, and rate? — Answer: **Gains 5/11 min per 65 min, i.e. 60/143 min per hour.**

**66. The Trains and the Falcon** — Problem: Trains 50 mi apart, each 25 mph, closing; falcon shuttles at 100 mph between them until they meet. Falcon's total distance? — Answer: **100 miles** (closing time = 50/(25+25)=1 hr; falcon flies 100mph × 1hr).

**67. Which Is More Lucrative?** — Problem: Base Rs 2,000/yr (Rs1,000/half-year); raise options Rs300/yr vs Rs100/half-year. Which is better, by how much? — Answer: **The Rs100/half-year option is more lucrative** (it compounds faster within each year — exact Rs advantage should be recomputed for the specific year count in question).

**68. Little Mammu and the Marbles** — Problem: "Give me 1, I'll have as many as you" / "give me 1, I'll have double you." Marble counts? — Answer: **Mammu 5, Nawal 7.**

**69. A Family Matter** — Problem: Multi-generation age puzzle (Mrs Sareen, 3 daughters, later 2 sons) with several proportional age constraints across time. — Answer: **Mrs Sareen 39; Sudha 21, Seema 18, Reema 18, Sonny 12, Kishu 9.**

**70. The High-Rise** — Problem: 437 apartments split by given percentages across 9 room-count categories. — Answer: **9, 13, 27, 36, 179, 88, 59, 21, 5** across the 2-room through 6-room categories (rounded to whole apartments) — ⚠ note the two sources list slightly different category percentages/order; re-verify the exact category-to-count mapping before use, the total (437) and general method (percentage × total, rounded) are solid.

**71. The Curious License Plate** — Problem: 5-distinct-digit plate reads as 78,633 more when flipped upside down. Original plate? — Answer: **10968** (inverts to 89601; 89601−10968=78633).

**72. Loose or Gain** — Problem: Two lathes sold at Rs600 each, one at 20% loss, one at 20% profit. Net result? — Answer: **Net loss of Rs 50** (costs were Rs750 and Rs500).

**73. On the See-Saw** — Problem: Girl balances 16 bricks on the short arm, 11 bricks on the long arm; brick weighs 3/4 lb + 3/4 of a brick (i.e. 3 lb, per #49's logic). Her weight? — Answer: **≈39.79 lb.**

**74. A Problem of Combination** — Problem: 12 marbles, 3 colors × 4 each; how many must be drawn to guarantee 2 of the same color? — Answer: **4 marbles** (pigeonhole: 3 draws could be one of each color, the 4th forces a repeat).

**75. The Special Number** — Problem: A number's double exceeds its half by 45. — Answer: **30** (2x − x/2 = 45 ⟹ 3x/2=45 ⟹ x=30).

**76. Sawing the Tree Trunk** — Problem: Sawing a 12ft log into a 12ft piece takes 1 min (i.e., one cut). Time for 12 equal pieces? — Answer: **11 minutes** (12 pieces need only 11 cuts).

**77. The Bigamist** — Problem: Trains to two destinations arrive at his station equally often overall, yet he ends up visiting one wife (Churchgate) far more than the other (Bandra). Why? — Answer: **The trains' schedules are offset (e.g. Churchgate trains 1 minute after Bandra trains each cycle)**, so whichever train comes first after his essentially-random arrival is disproportionately the Churchgate one.

**78. The Split** — Problem: Split into two parts where 4/7 of one equals 2/5 of the other, totaling 34 (per file 05's paraphrase) — note this source's problem text differs slightly ("4/7 of one part = 2/5 of the other") from file 05's ("1/x of one = 1/y of other," total unspecified as 34 there too) — treat as the same puzzle family; re-verify the exact fraction pairing before use. — Answer: **14 and 20.**

**79. At the Fete** — Problem: 25 writers, 20 doctors, 18 dentists, 12 bank employees, Rs1330 total; 5 writers = 4 doctors' spend, 12 doctors = 9 dentists' spend, 6 dentists = 8 employees' spend (per-group total spend, not per-person). — Answer: **Writers Rs350, Doctors Rs350, Dentists Rs420, Employees Rs210.**

**80. At the Store** — Problem: Spend half the purse; left with as many paise as had rupees, and half as many rupees as had paise (originally). Starting amount? — Answer: **Rs 99.98.**

**81. The Counterfeit Coins** — Problem: 120 coins, 1 counterfeit (heavier or lighter, unknown which); isolate it and determine heavy/light in 5 weighings. — Answer: **Solvable via a ternary-search weighing tree** (standard counterfeit-coin balance-puzzle method, splitting into groups of ~40 then progressively smaller).

**82. Multiplying Bacteria** — Problem: Container full on day 10, doubling daily. Half-full on which day? — Answer: **Day 9.**

**83. The Mathematical Shepherd** — Problem: Splitting his sheep into two groups, the difference between the group sizes equals the difference between their squares. — Answer: **1 sheep total** (only n=1 makes "difference of squares = difference of the numbers" trivially/uniquely true in the intended sense, per source).

**84. A Puzzling Number** — Problem: A number exceeds the sum of its 1/3, 1/10, and 1/12 parts by 58. — Answer: **120.**

**85. What a Coincidence?** — Problem: 7 players, winner doubles everyone else's money each round, 7 rounds (each wins once), all end with Rs32. Starting amounts? — Answer: **Arun 112.25, Binoy 56.25, Chunder 28.25, Dev 14.25, Edward 7.25, Fakhruddin 3.75, Govind 2** (working backward, halving 6 others and adding to the round's winner each step).

**86. The Idler** — Problem: Rs240/month (30 days) job, forfeits Rs10/idle day, ends with net Rs0 owed either way. Days worked/idled? — Answer: **16⅔ worked, 13⅓ idled.**

**87. Numbers Game** — Problem: 17 matchsticks, players alternately remove 1–4, last-stick-taker wins. Winning first move/strategy? — Answer: **Take 2 first (leaving 15), then always leave a multiple of 5** for the opponent.

**88. Father and Son** — Problem: Father is 4× son's age; in 30 years son will be half father's age. — Answer: **Father 60, son 15.**

**89. A Bargain in Guavas** — Problem: Paid Rs1.20, vendor thrown in 2 extra guavas, effectively 10 paise/dozen less than the going rate. Guavas received? — Answer: **18 guavas.**

**90. The Six Matches** *(out of scope — physical arrangement)* — Problem: Rearrange 6 matchsticks to "make nothing." — Answer: **Arrange them to spell "NIL"** (wordplay, needs a physical/visual layout).

**91. No Change Please!** — Problem: Rs1.15 in 6 coins, yet can't make change for Re1, 50p, 25p, 10p, or 5p. Coins held? — Answer: **One 50p, one 25p, four 10p.**

**92. A Date to Reckon With** — Problem: Which 20th-century year has the most dates where day×month=year (last 2 digits)? — Answer: **1924** (7 such occasions).

**93. Gold for All Occasions** — Problem: Identical buckets — one full of half-sovereigns, one full of full-sovereigns (same coin *count* implied by "identical bucket," different coin size). Which is worth more? — Answer: **The half-sovereign bucket** — it's genuinely full of gold by volume, whereas a bucket of the larger full-sovereign coins packs with more wasted gap space per the puzzle's premise (book's stated lateral-thinking answer — hinges on physical coin-packing, verify the intended reading before adapting to MC).

**94. The Ink-Spot** — Problem: Circular table pushed into a corner touching both walls; an edge ink-spot is 8" from one wall, 9" from the other. Diameter? — Answer: **58 inches.**

**95. Spade for a Heart** *(out of scope — dissection)* — Problem: Cut a spade shape into 3 pieces reassembling into a heart. — Answer: dissection-dependent, no numeric/word answer.

**96. The Number Puzzle** — Problem: Two numbers differ by 3; their squares differ by 51. — Answer: **10 and 7.**

**97. A Problem of Coins** *(out of scope — diagram)* — Problem: Place 10 coins in 5 straight lines, 4 coins/line. — Answer: **Five-pointed star (pentagram) arrangement.**

**98. The Squirrel and the Post** — Problem: Squirrel spirals up a 16ft, 3ft-circumference post, one circuit per 4ft of height. Distance travelled? — Answer: **20 feet** (unroll the cylinder: each 4ft-rise segment is the hypotenuse of a 4ft-rise/3ft-circumference right triangle = 5ft; 4 segments × 5ft = 20ft).

**99. Hearts Apart** — Problem: Two people 63 miles apart walk toward each other at 4mph and 3mph. Distance each travels to meeting? — Answer: **36 miles (4mph walker), 27 miles (3mph walker)** (63 mi ÷ 7mph combined = 9 hrs).

**100. The Curfew** — Problem: One man's 5 beers + another's 3 beers shared equally among 3 (including a friend who pays Rs8 for his share). Fair division of the Rs8? — Answer: **First man Rs7, second man Rs1** (each of 3 people effectively "owes" for 8/3 beers; the friend's Rs8 payment is split by how many beers each original buyer effectively gave away to him).

---

## Puzzles 101–150

**101. A Problem of Age** — Problem: Woman's age digits reversed = husband's age; he's older; difference = 1/11 of their sum. — Answer: **Woman 45, husband 54.**

**102. The Circular Numbers** *(out of scope — diagram/arrangement, unless reframed as "which arrangement is valid")* — Problem: Arrange 1–10 in a circle so any two adjacent numbers sum to the same as the diametrically opposite pair. — Answer: arrangement-dependent.

**103. The Passenger Train and the Goods Train** — Problem: Passenger train takes 3× as long to pass the goods train, whether same or opposite direction. Speed ratio? — Answer: **Passenger train is 2× as fast** as the goods train.

**104. Rice for the Festival** — Problem: 100kg rice to 100 people: old get 3kg, young 2kg, children 0.5kg each. — Answer: **5 old, 25 young, 70 children.**

**105. Threes to Make Thirty-One** — Problem: Write 31 using the digit 3 exactly five times. — ⚠ **Cross-source conflict**: file 05 gives **3³+3+3/3 = 31**; this source gives **"3³³ + 3 − 3/3 = 27+3+1 = 31"** which is written inconsistently (its own arithmetic — 27+3+1=31 — actually matches the file-05 expression **3³+3+3/3**, not literally "3 to the 33rd"; this looks like an OCR/transcription glitch in this source, not a genuine second solution). — Answer: **3³ + 3 + 3/3 = 31** (five 3's: the base, the exponent, the added 3, and the two in "3/3").

**106. Swarm of Bees** — Problem: √(half the swarm) flew to a jasmine bush; 8/9 of the whole swarm remained (this source's phrasing) / stayed behind; the remainder is 2 bees (1 female flying about 1 male). Total bees? — Answer: **72 bees.**

**107. What Were You Doing When the Lights Went Out?** — Problem: Two equal-length candles, one burns out in 4 hrs, the other in 5; extinguished together when remaining stub of one is 4× the other's stub length. Burn duration? — Answer: **3¾ hours** (3 hours 45 minutes).

**108. The Dotted Square** *(out of scope — diagram)* — Problem: 25 dots in a 5×5 grid; connect 12 with straight lines forming a cross enclosing 5 dots, 8 outside. — Answer: diagram-dependent.

**109. Story of the Three Farmers** — Problem: Rs1,000 pasture; farmer A grazes 9 mules; farmer B grazes 12 cows for 2× as long; farmer C's goats graze 2.5× as long as B's cows and C pays half the total cost; given 6 cows ≈ 4 mules and 10 goats ≈ 3 cows in grazing-equivalence. Goats, and A/B's payments? — ⚠ **Cross-source conflict**: file 05 states **"25 goats"**; this source states **"2.5 goats"** for the same puzzle — almost certainly a decimal-point transcription error in one of the two (an integer number of goats is the sane reading, so 25 is far more plausible than 2.5, but **recompute the grazing-equivalence algebra from scratch** rather than trusting either figure outright. Both sources agree the two farmers paid **Rs180 and Rs320.**

**110. Up the Stream — Down the Stream** — Problem: Rowing upstream takes 8 4/7 min; without current it would take 7 min less than the downstream time. Downstream time? — ⚠ **Cross-source conflict**: file 05 gives **3 3/11 minutes**; this source gives **3 11/17 minutes** for what should be the same answer. **Re-derive from the relative-speed algebra (upstream/downstream/still-water rate relationships) before using** — neither figure should be trusted as-is.

**111. Staff and the Steeple** — Problem: 5ft staff casts a 2ft shadow; steeple's shadow at the same hour is 120ft. Steeple height? — ⚠ **Cross-source conflict, and likely arithmetic error in this source**: similar-triangles gives height/shadow = 5/2 for both staff and steeple, so steeple height = 120 × (5/2) = **300 ft** — matching file 05's primary figure. This source instead states **240 ft**, which is simply 120×2 and doesn't match the stated 5:2 ratio. **Use 300 ft, but independently re-verify before publishing** given two sources now disagree in two different ways (file 05 also hedged with an alternate 200ft "print error" note).

**112. Wine and Water** — Problem: 10oz spirits + 10oz water; transfer ¼oz spirits into water, mix, transfer ¼oz of the mixture back. Resulting ratio in the spirits bottle? — Answer: **Symmetric 40:1 ratio** — whatever spirits contaminates the water bottle, an equal-volume "return trip" restores exact proportional symmetry between the two bottles (classic invariant — the two bottles end up mirror images of each other's contamination ratio).

**113. The Long Tunnel** — Problem: 1-mile train at 1 mile/min through a 1-mile tunnel. Time to fully pass through? — Answer: **2 minutes** (front travels 2 miles total — tunnel length + train length — before the tail clears the exit).

**114. The Horse, the Cow and the Sheep** — Problem: Horse+cow clear a pasture in 40 days, horse+sheep in 60, cow+sheep in 90. All three together? — Answer: **37 17/19 days.**

**115. The Two Mathematical Men** — Problem: Age difference 30 (per one phrasing) or ages differing such that difference = 30 and product = 1624. — Answer: **64 and 20** (both sources agree here; file 05 additionally hedges an alternate 58/28 pairing worth double-checking, but 64×20=1280≠1624 — wait, verify: 64−20=44≠30 either. **This entry needs a full independent re-solve**: neither the "difference 30" nor "product 1624" condition is satisfied by 64 & 20 as commonly stated — re-derive the two equations and solve properly before use.)

**116. A Question of Mileage** — Problem: 5 tyres (or litres, per translation) used equally over a 20,000-mile trip. Mileage sustained per tyre? — Answer: **16,000 miles/tyre** (each of 5 tyres is "in use" for 4/5 of the total distance, since only 4 tyres are mounted at once: 20000×4/5=16000).

**117. A Problem of Dissection** *(out of scope — dissection)* — Problem: Cut an L-shaped figure (a square + half of an identical square split diagonally) into 4 congruent pieces. — Answer: dissection-dependent (source says divide into 12 equal triangles, recombine into 4 congruent quads).

**118. The Sixteen Fours** — Problem: Make 1,000 using exactly sixteen 4's. — Answer: **444+444+44+44+4+4+4+4+4+4 = 1000.**

**119. The Strange Two Numbers** — Problem: Smallest two whole numbers where the difference of their squares is a perfect cube and the difference of their cubes is a perfect square. — Answer: **10 and 6** (100−36=64=4³; 1000−216=784=28²).

**120. How Much?** — Problem: I have two 10-paise coins; 2/5 of what I have equals 8/9 (or 4/9, per file 05) of what you have. — ⚠ Note: this source's problem text says "8/9" where file 05's paraphrase says "4/9" — likely a transcription difference between the two extractions of the same puzzle; re-verify the exact fraction before use. — Answer: **18 paise** (both sources agree on the final answer despite the fraction discrepancy, which suggests the fraction transcription differs but resolves to the same equation either way — still worth pinning down the authoritative wording).

**121. The 'Mixed Double'** — Problem: 4 married couples, 3 days of mixed-doubles tennis; no one plays with/against the same person twice, never with/against their own spouse. Valid schedule? — Answer: **A specific 3-day round-robin pairing table** (standard combinatorial-design solution; usable as an MC "how many total matches" or "is this schedule valid" question rather than requiring the full grid).

**122. The Bargain** — Problem: Typewriter price: Rs1024 → Rs640 → Rs400 → Rs250 (consistent ratio reduction each year). Next price? — Answer: **Rs 156.25** (each step ×5/8).

**123. At the Fair** — Problem: 6 pineapples + 2 jackfruits = Rs15; (additional ratio condition about 4 more pineapples for Rs14 than jackfruits for Rs9). Price of each? — Answer: **Pineapple Rs1.75, jackfruit Rs2.25.**

**124. Sections of a Necklace** — Problem: 5 necklace sections of 4 links each; Re1 to cut a link, Re1 to resolder; cheapest way to join into one necklace? — Answer: **Rs 8** — open all 4 links of one section, use them to join the other 4 sections.

**125. The Problem of Square Boards** — Problem: 3 square boards; 1st's area exceeds 2nd's by 5 sq ft, 2nd's exceeds 3rd's by 5 sq ft. Side lengths? — Answer: **31", 41", 49"** (sides whose squares differ by 5 sq ft pairwise per the source's stated solution — note: 41²−31²=720, not 5, so **the "5 sq ft" in the problem almost certainly means something other than literal difference-of-squares as stated, or units differ from what's transcribed — re-derive this one from scratch**, the side lengths 31/41/49 should be checked against whatever the real area-difference condition is.)

**126. Age of Demochares** — Problem: Lived 1/4 of life as a boy, 1/5 as a youth, 1/3 as a man, plus 13 years in dotage. — Answer: **60 years** (1/4+1/5+1/3 = 47/60 of life; remaining 13/60 = 13 years ⟹ total 60).

**127. The Age Old Problem** — Problem: Combined ages of Reena and Seena = 44, with a complex nested "when X was as old as Y will be" age-ratio condition. — Answer: **Reena 27.5, Seena 16.5.**

**128. The Painted Cube** — Problem: 3"×3"×3" cube painted on all outer faces, cut into 27 unit cubes. How many have any paint? — Answer: **26** (all except the single core cube).

**129. Smoking Not Prohibited** — Problem: 6 butts make 1 cigarette; how many cigarettes from 36 butts (including butts from newly-made cigarettes)? — Answer: **7 cigarettes** (36→6 new→smoke them→6 more butts→1 more cigarette; 6+1=7).

**130. Mathematical Taxi Driver** — Problem: Number leaves remainder 1 when divided by 2,3,4,5,6, but divides evenly by 11. Smallest such number? — Answer: **121** (LCM(2..6)=60, so candidates are 60k+1; 121=60×2+1 is divisible by 11).

**131. Dividing the Load Equally** — Problem: 2 crates carried 3 miles by 3 labourers, each carrying equal loads for equal distances. How? — Answer: **Each labourer carries a crate for exactly 2 of the 3 miles**, via a rotation/relay scheme (swap who's carrying which crate so total carry-distance is equal per person).

**132. Mr. Portchester's Problem** — Problem: Two 10-qt containers of wine full, a 5-qt and a 4-qt empty measure; get exactly 3 qt into each of the 5-qt and 4-qt measures with minimal pourings. — Answer: **11 pourings** (per source; a specific step sequence, worth re-verifying the minimum is actually 11 and not fewer before treating that count as the "answer" of an MC question — better to frame the MC question around the end-state, not the pour count, unless the count is reconfirmed).

**133. Dots and Lines** *(out of scope — diagram)* — Problem: 9 dots in a 3×3 grid; connect all with 4 continuous straight lines (classic "think outside the box"). — Answer: a Z-shaped path extending outside the 3×3 boundary.

**134. 'Longfellow and His Bees'** — Problem: 1/5 of a hive flew to one flower, 1/3 to another, 3×the difference of those two counts flew to an arbour, and 1 bee flew about alone. Total bees? — Answer: **15 bees.**

**135. The Tennis Tournament** — Problem: 30-player single-elimination bracket; matches needed to determine the winner? — Answer: **29 matches** (every match eliminates exactly one player; 29 losers needed to leave 1 winner from 30).

**136. The Triangles** — Problem: Count all triangles (any size) in a 5-pointed star. — Answer: **20 triangles.**

**137. Driving Through the Country** — Problem: Day 1: 7 miles; last day: 51 miles; +4 miles each day. Days travelled, total distance? — Answer: **12 days, 348 miles total** (arithmetic series: (7+51)/2 × 12 = 348).

**138. The Sabbath Day** — Problem: Christian (1st day), Jew (7th day), Turk (6th day) each observe their true Sabbath on the same calendar day. How? — Answer: **Two of the three travel around the world in opposite directions**, gaining or losing a day relative to a stationary observer (International Date Line effect), making their "day count" align with the third's on a given date despite differing nominal weekday rules.

**139. The Puzzled Artist** — Problem: Canvas with 4" top/bottom margins, 2" side margins, picture area 72 sq in. Smallest canvas dimensions? — Answer: **10 in × 20 in.**

**140. The Mystery of Number Eleven** — Problem: Largest number using any 9 of the 10 digits (0–9), divisible by 11 with no remainder. — Answer: **987652413.**

**141. The Rose Garden** — Problem: Quadrilateral garden, sides 20/16/12/10 rods, maximum possible area for those side lengths (cyclic quadrilateral). — Answer: **194.4 sq rods** (via Brahmagupta's formula for a cyclic quadrilateral's max area).

**142. Squares Within Square** — Problem: Total squares (any size) in a standard 8×8 grid. — Answer: **30 squares** — ⚠ note: an 8×8 grid of unit squares actually contains 8²+7²+...+1²=204 squares of all sizes; **30 matches a 4×4 grid instead** (1²+2²+3²+4²=30). This looks like a **grid-size mismatch between the problem statement ("8×8") and the stated answer (30, which is the 4×4 total)** — cross-check against file 05, which lists this same puzzle as a 4×4 grid with answer 30. **Use the 4×4 framing; the "8×8" wording here is likely a transcription error.**

**143. The Farmer and the Animals** — Problem: Mules Rs50, sheep Rs40, goats Rs25, pigs Rs10; average price Rs30 across some number bought. How many of each? — Answer: **At least 1 mule, 1 ox(?), 2 goats, 1 pig**, per source — ⚠ note the solution mentions "ox," an animal not in this problem's own stated list (mules/sheep/goats/pigs) — likely a leftover artifact from a different edition/variant of this puzzle. **This puzzle's answer is also explicitly non-unique** ("at least" / "other combinations exist" per file 05) — probably not usable as a single-correct-option MC question without adding a constraint that pins down a unique solution.

**144. The Mango Thieves** — Problem: 3 thieves share <100 mangoes overnight; each in turn eats 1, hides 1/3 of the remainder, sleeps; morning remainder is 1 more than a multiple of 3. Total stolen? — Answer: **79 mangoes** (independently checks out arithmetically: 79→eat1,78,keep⅔=52; 52→eat1,51,keep⅔=34; 34→eat1,33,keep⅔=22=3×7+1 ✓).

**145. The House Where She Lives** — Problem: Houses numbered 1..N on her side of the street; sum of numbers before her house = sum after; 50<N<500. Her house number? — Answer: **House 204** (out of 288 houses total on that side, satisfying the balanced-sum condition for triangular numbers).

**146. A Matter of Rupees and Paises** — Problem: Rs700 in an equal count of 25p, 50p, and Re1 coins. Count of each? — Answer: **400 of each.**

**147. Sawing the Cube** — Problem: 3" cube → 27 unit cubes needs 6 saw cuts normally; can rearranging pieces between cuts reduce this? — Answer: **No — still 6 cuts minimum**, because the single centre cube must have all 6 of its faces exposed by a cut, and no single cut can expose more than one face of that cube regardless of rearrangement.

**148. The Two Trains** — Problem: Two trains start simultaneously toward each other's origin, cross, then arrive 1 hour and 4 hours later respectively. Speed ratio? — Answer: **One train is exactly 2× as fast as the other** (classic result: speed ratio = √(t2/t1) = √(4/1) = 2).

**149. The Squares** — Problem: Find 4 numbers where every pairwise sum and the total sum are all perfect squares (smallest solution). — Answer: **a=10430, b=3970, c=2114, d=386** — ⚠ these are unusually large for the puzzle's apparent difficulty tier; **independently verify by summing all pairs + the total before publishing**, since a transcription slip in even one digit would silently break the "perfect square" property.

**150. The Arithmetical Landlady** — Problem: 99-year lease; 2/3 of elapsed time = 4/5 of remaining time. Years remaining? — Answer: **45 years.**

---

## Cross-source conflicts requiring independent resolution before use

Puzzles where this file and `05-wits-and-wonders-handbook.md` (or this file's own problem/solution text) disagree on the numeric answer — **do not adapt any of these into a puzzle until re-derived from scratch**:

- **#10 To Catch a Thief** — head-start figure (7 vs 27) and resulting step count.
- **#25 The Legacy** — Rs 49,200 vs Rs 240,000.
- **#51 The Old Ship** — three different candidate age pairs across the two sources, none mutually consistent.
- **#70 The High-Rise** — category percentage/ordering mismatch.
- **#78 The Split** — fraction pairing differs slightly (4/7 & 2/5 vs 1/x & 1/y).
- **#105 Threes to Make Thirty-One** — likely just an OCR artifact, not a real second solution; both resolve to the same expression.
- **#109 Three Farmers** — 25 goats vs 2.5 goats (very likely a decimal-point transcription error; 25 is the sane reading but confirm algebraically).
- **#110 Up/Down Stream** — 3 3/11 min vs 3 11/17 min.
- **#111 Staff and the Steeple** — 300 ft (matches the stated 5:2 shadow ratio) vs this source's 240 ft (arithmetically inconsistent with its own problem statement).
- **#115 Two Mathematical Men** — stated answer (64 & 20) doesn't actually satisfy either stated condition (difference 30, product 1624) as transcribed; needs a full re-solve.
- **#120 How Much?** — fraction transcription differs (8/9 vs 4/9) though the final answer (18 paise) matches.
- **#125 Square Boards** — stated side lengths don't obviously satisfy a literal "5 sq ft difference" reading; likely a units/wording issue.
- **#142 Squares Within Square** — grid size in the problem text (8×8) doesn't match the stated answer (30, which is a 4×4 grid's total); use the 4×4 framing.
- **#143 Farmer and Animals** — solution mentions an "ox" absent from the problem's own animal list, and the puzzle is flagged as having multiple valid solutions — probably not MC-safe without added constraints.
