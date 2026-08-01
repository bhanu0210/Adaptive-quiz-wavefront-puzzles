// Subscriber learning-library tips. Lives here (not Supabase) so the Tips
// page can never fail to load at runtime -- it's bundled at build time,
// same as the puzzle content. To add or edit a tip, change this file and
// open a PR, the same workflow already used for puzzle rotation.
//
// The first 24 entries (sort_order 1-4 per category) were migrated
// verbatim from the puzzle_learning_tips Supabase table on 2026-08-01,
// keeping their original ids. Entries with sort_order 5-6 per category
// are new, added directly to this file rather than the database.

export type LearningTip = { id: string; category: string; title: string; body: string; sort_order: number };

export const learningTips: LearningTip[] = [
  // Logic & Knowledge
  { id: "7a282d02-fcec-4548-96f2-1fb31036398a", category: "Logic & Knowledge", sort_order: 1, title: "Treat statements as moves", body: "Every public statement changes the puzzle. List possibilities before and after each person speaks, then remove only the cases that statement makes impossible." },
  { id: "8767be5f-753c-4d81-86cc-5fefc0b7d24b", category: "Logic & Knowledge", sort_order: 2, title: "Build a tiny table", body: "For people, places, or dates, make a small grid. Mark definite matches first, then cross out conflicts instead of guessing." },
  { id: "e5a65f86-1c6c-4fdc-b985-00fd289e9f21", category: "Logic & Knowledge", sort_order: 3, title: "Test the strongest case first", body: "When someone says they do not know, start with the case that would have let them know immediately. Remove it, then repeat after each later statement." },
  { id: "3a1dfc5a-d2ef-4edb-bd68-344917ead6b5", category: "Logic & Knowledge", sort_order: 4, title: "Separate must from might", body: "Write what a clue forces and what it merely allows. This stops a plausible-looking arrangement from being mistaken for the only arrangement." },
  { id: "restate-double-negatives", category: "Logic & Knowledge", sort_order: 5, title: "Restate double negatives positively", body: "\"Not (A and not B)\" is hard to hold in your head. Rewrite it as \"if A then B\" before reasoning about it -- the positive form is almost always easier to check against the clues." },
  { id: "track-who-sees-what", category: "Logic & Knowledge", sort_order: 6, title: "Track who can see what, not who knows what", body: "In hat and seating puzzles, first write down exactly what each person can physically observe. Only after that's fixed should you layer on what a statement reveals they now know -- conflating the two is the most common source of errors." },

  // Mathematical Reasoning
  { id: "7a11b65e-7644-4cfa-b14e-3ea499138ffb", category: "Mathematical Reasoning", sort_order: 1, title: "Find what stays fixed", body: "When percentages, mixtures, or weights change, look for the amount that cannot change. It often creates one clean equation." },
  { id: "77807924-1cae-4e88-af58-149fc8bf3942", category: "Mathematical Reasoning", sort_order: 2, title: "Estimate before calculating", body: "A rough answer is a safety rail. If the exact result is far from your estimate, revisit the setup." },
  { id: "b967f98f-270e-41cd-b1e7-ad7c224e4920", category: "Mathematical Reasoning", sort_order: 3, title: "Turn words into conserved units", body: "For drying, mixtures, or percentages, choose kilograms of solids, total items, or another fixed unit before touching percentages." },
  { id: "51e213d0-86b7-4649-8b48-29f1cf1aa1db", category: "Mathematical Reasoning", sort_order: 4, title: "Check the base of every percentage", body: "A percentage always belongs to a total. If the total changes, the same percentage can represent a very different amount." },
  { id: "work-backward-from-options", category: "Mathematical Reasoning", sort_order: 5, title: "Work backward from the answer options", body: "For multiple-choice arithmetic, plugging a given option back into the problem is often faster than solving algebraically from scratch -- especially when the algebra would involve fractions or multiple variables." },
  { id: "convert-to-common-unit", category: "Mathematical Reasoning", sort_order: 6, title: "Convert everything to one common unit first", body: "Most errors happen when a problem mixes percentages, ratios, and raw counts in the same sentence. Pick one unit -- usually the raw count -- and convert every other quantity into it before writing any equation." },

  // Probability & Strategy
  { id: "dd5d10f9-e356-467c-96b9-942240672ff8", category: "Probability & Strategy", sort_order: 1, title: "Count the opposite event", body: "For at least one questions, it is often easier to count none first, then subtract from one." },
  { id: "09ccd7f7-bff8-4ee4-8619-a49f9a088952", category: "Probability & Strategy", sort_order: 2, title: "Check whether a reveal was deliberate", body: "Information from a knowledgeable chooser is not random. Work out what they were forced to reveal before changing the odds." },
  { id: "e442ba53-f5e7-43c0-93a3-55fb309fb6b7", category: "Probability & Strategy", sort_order: 3, title: "List equally likely cases", body: "Before using a fraction, write the actual outcomes and check that each is equally likely. A host rule can make them uneven." },
  { id: "9c3681e3-b067-4f75-8e03-e9413274ea49", category: "Probability & Strategy", sort_order: 4, title: "Use small simulations as a check", body: "For a strategy puzzle, test a few complete cases by hand. A tiny simulation catches an incorrect intuition quickly." },
  { id: "expected-value-weighted-average", category: "Probability & Strategy", sort_order: 5, title: "Expected value is a weighted average, not the likely outcome", body: "Multiply every possible outcome by its own probability and sum them. Don't just pick the single most probable branch and assume it's the best play -- a rare but huge payoff can beat a common small one." },
  { id: "check-independence-first", category: "Probability & Strategy", sort_order: 6, title: "Check independence before multiplying probabilities", body: "P(A and B) = P(A) × P(B) only holds when A and B don't affect each other. If knowing one event changes the odds of the other, multiply by the conditional probability instead, not the plain one." },

  // Algorithms & Optimization
  { id: "0222dd78-cc35-42be-a361-e99afbf45451", category: "Algorithms & Optimization", sort_order: 1, title: "State the goal exactly", body: "Write the finish condition and every rule before trying moves. Good algorithms remove unnecessary moves." },
  { id: "41dd584e-5f43-4b95-a643-fd26801d2add", category: "Algorithms & Optimization", sort_order: 2, title: "Halve when the list is sorted", body: "If an ordered list can be split in two after every answer, think binary search. Powers of two reveal the decision count." },
  { id: "fd15a736-922e-4bb6-9fa2-6f4258cf579d", category: "Algorithms & Optimization", sort_order: 3, title: "Compare complete paths", body: "The cheapest first step is not always part of the cheapest route. Add the full cost of every candidate path." },
  { id: "6696587a-a4d5-4d08-8471-33bdbb0f4858", category: "Algorithms & Optimization", sort_order: 4, title: "Prove a minimum in two directions", body: "Show one construction that reaches the goal, then rule out every smaller possibility. Together those prove optimality." },
  { id: "greedy-then-counterexample", category: "Algorithms & Optimization", sort_order: 5, title: "Try greedy first, then hunt for a counterexample", body: "Grab the locally best option at each step, then deliberately try to break your own solution. If you can't construct a case where it fails, it's very likely optimal -- and if you can, that failing case usually points straight at the real rule." },
  { id: "sort-by-tightest-constraint", category: "Algorithms & Optimization", sort_order: 6, title: "Sort by whichever constraint bites hardest", body: "For scheduling or ordering puzzles, sort candidates by deadline, capacity, or whatever limit is tightest -- not by the order they're listed in. The right sort key usually makes the rest of the puzzle almost mechanical." },

  // Spatial Reasoning
  { id: "aa35cdc4-4a05-457d-bba9-bea85fd755b6", category: "Spatial Reasoning", sort_order: 1, title: "Classify before counting", body: "For painted cubes, separate corners, edges, face centers, and hidden cubes. Each group follows a simpler rule." },
  { id: "76ad030c-9054-4117-b684-928c91309312", category: "Spatial Reasoning", sort_order: 2, title: "Draw the smallest useful picture", body: "A compass arrow, two-by-two grid, or unfolded face is often enough. Do not rotate the entire object only in your head." },
  { id: "a5f359e5-fe70-4275-8f69-02e6b0a11e2a", category: "Spatial Reasoning", sort_order: 3, title: "Use coordinates when pictures get busy", body: "For cubes and grids, label positions as corner, edge, face, or interior. This replaces unreliable mental rotation with a countable system." },
  { id: "b83352b7-97b2-4194-bbbe-9b94d6ff90f9", category: "Spatial Reasoning", sort_order: 4, title: "Look for an invariant", body: "Colouring, parity, and opposite-face totals do not change when an object moves. Use them before trying every possible rotation." },
  { id: "label-faces-before-folding", category: "Spatial Reasoning", sort_order: 5, title: "Label faces with letters before folding", body: "For net and unfolding puzzles, write a letter on each face in your mental picture before you fold it. Tracking letters through the fold is far more reliable than tracking raw orientation." },
  { id: "cut-with-symmetry", category: "Spatial Reasoning", sort_order: 6, title: "Cut the shape in half with its own symmetry", body: "If a figure has an obvious mirror line or rotational symmetry, solve one half and reflect or rotate the answer -- instead of reasoning through the whole shape from scratch." },

  // Patterns & Numbers
  { id: "9f28c72e-a7a0-4b9e-a8fb-826728c0d7b6", category: "Patterns & Numbers", sort_order: 1, title: "Inspect the gaps", body: "When a sequence is unclear, write the differences. If needed, split odd and even positions into two smaller sequences." },
  { id: "d5a59772-88ea-4737-8ac2-7b1fea5b0cb0", category: "Patterns & Numbers", sort_order: 2, title: "Use cycle remainders", body: "For repeating patterns such as weekdays or clock turns, divide by the cycle length and keep only the remainder." },
  { id: "b0224113-4323-4b57-a68c-f0d323ac1369", category: "Patterns & Numbers", sort_order: 3, title: "Try parity and remainders", body: "Odd/even behavior and remainders after division often expose a number pattern more quickly than calculating large terms." },
  { id: "3c3e0ba1-6f2c-4af2-b888-39aaf2ad2875", category: "Patterns & Numbers", sort_order: 4, title: "Prefer the simplest rule that fits all terms", body: "A valid sequence rule must explain every shown term. Test differences, ratios, alternating positions, and cycles in that order." },
  { id: "second-differences-quadratic", category: "Patterns & Numbers", sort_order: 5, title: "Check second differences for a quadratic pattern", body: "If the gaps between terms aren't constant, but the gaps between those gaps are, the sequence follows a quadratic (n²-based) rule, not a linear one -- write the second-difference row before guessing." },
  { id: "recognize-classic-families", category: "Patterns & Numbers", sort_order: 6, title: "Recognize the classic families first", body: "Squares (1, 4, 9, 16), triangular numbers (1, 3, 6, 10), and Fibonacci-style sums (each term is the sum of the two before it) cover a large share of pattern puzzles -- check the sequence against these before deriving a rule from scratch." },
];
