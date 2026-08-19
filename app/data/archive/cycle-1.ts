// Cycle 1 archive -- the launch roster, retired 2026-08-19 when Cycle 2
// went live. See docs/PUZZLE-ROTATION.md. Do not edit these puzzles; they
// are a historical record and their ids must never be reused by a future
// cycle, even after this archive entry is eventually purged.

import type { ArchivedPuzzle } from "./index";

export const cycle1Puzzles: readonly ArchivedPuzzle[] = [
  {
    "id": "signal-silence-hats",
    "title": "The Answer Hidden in Silence",
    "category": "Logic & Knowledge",
    "difficulty": 3,
    "time": 5,
    "question": "Three thinkers stand in a line. Ava sees Ben and Cy. Ben sees Cy. Cy sees nobody. There are three black hats and two white hats available, and each person wears one. Ava says, \"I do not know my hat colour.\" Ben hears this and says, \"I do not know either.\" Cy then says, \"Now I know.\" What colour is Cy's hat?",
    "options": [
      "Black",
      "White",
      "It could be either",
      "There is not enough information"
    ],
    "correctOption": 0,
    "hints": [
      "Treat each \"I do not know\" as new information, not as an empty statement.",
      "If Ava had seen two white hats, she would have known immediately that hers was black.",
      "After Ava speaks, Ben knows at least one of his and Cy's hats is black. If Cy's were white, Ben would know his own was black. Ben does not know, so Cy must be black."
    ],
    "explanation": "Cy's hat is black. Ava would know her own hat was black if she saw two white hats, so her uncertainty tells everyone that Ben and Cy are not both white. Ben now knows at least one of those two hats is black. If Ben could see a white hat on Cy, Ben would know that his own hat had to be black. But Ben still does not know. That means Cy cannot be wearing white, so Cy is wearing black.",
    "takeaway": "Silence can eliminate possibilities. In knowledge puzzles, write down what each person would have known in every possible case.",
    "verification": {
      "method": "Exhaustive hat-assignment enumeration",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "cheryls-calendar",
    "title": "A Birthday Between the Lines",
    "category": "Logic & Knowledge",
    "difficulty": 4,
    "time": 7,
    "question": "Mira's birthday is one of these dates: May 15, May 16, May 19, June 17, June 18, July 14, July 16, August 14, August 15, or August 17. Arun is told only the month and Bela only the day. Arun says, \"I do not know, but I know Bela does not know.\" Bela says, \"Now I know.\" Arun says, \"Now I know too.\" When is Mira's birthday?",
    "options": [
      "July 16",
      "August 15",
      "August 17",
      "July 14"
    ],
    "correctOption": 0,
    "hints": [
      "Begin with days that occur only once in the full list.",
      "Arun's first statement rules out every month containing a day that would let Bela know immediately.",
      "May and June disappear first. Bela's certainty then removes day 14. Arun could not choose between two August dates, so the month must be July."
    ],
    "explanation": "The birthday is July 16. Bela would instantly know the date if she heard 18 or 19, because those days appear only once. Arun knows Bela cannot know, so Arun cannot have heard May or June, the months containing those unique days. We are left with July 14, July 16, August 14, August 15, and August 17. Bela now knows, so her day cannot be 14. That leaves July 16, August 15, and August 17. Arun now knows too. If he had heard August, two dates would remain, so he must have heard July. The only remaining July date is July 16.",
    "takeaway": "Start epistemic puzzles by removing values that would create instant knowledge, then repeat the filtering after every statement.",
    "verification": {
      "method": "Programmatic public-announcement filtering",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "potato-water",
    "title": "The Potatoes That Lost Half",
    "category": "Mathematical Reasoning",
    "difficulty": 2,
    "time": 3,
    "question": "A 100 kg pile of potatoes is 99% water. After drying, it is 98% water. The amount of solid potato does not change. What does the pile weigh now?",
    "options": [
      "50 kg",
      "98 kg",
      "99 kg",
      "49 kg"
    ],
    "correctOption": 0,
    "hints": [
      "Track the part that does not change instead of the water that leaves.",
      "At the start, the non-water part is 1% of 100 kg.",
      "The solid part is 1 kg. After drying it is 2% of the total, so total weight is 1 divided by 0.02."
    ],
    "explanation": "The pile now weighs 50 kg. At first, 99 kg is water and only 1 kg is solid potato. Drying removes water but leaves that 1 kg of solid material unchanged. When the potatoes are 98% water, they are 2% solid. If 2% of the new total equals 1 kg, then the new total is 1 divided by 0.02, which is 50 kg. The surprising drop happens because the water percentage is measured against a changing total.",
    "takeaway": "In percentage-change puzzles, identify a quantity that stays fixed and build the equation around it.",
    "verification": {
      "method": "Mass-conservation equation",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "hundred-lockers",
    "title": "The Hundred Locker Parade",
    "category": "Mathematical Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "There are 100 closed lockers. On pass 1, every locker is toggled. On pass 2, every second locker is toggled. On pass 3, every third locker is toggled, and so on through pass 100. How many lockers are open at the end?",
    "options": [
      "10",
      "50",
      "9",
      "25"
    ],
    "correctOption": 0,
    "hints": [
      "A locker changes once for each number that divides its locker number.",
      "Most factors come in pairs, such as 2 and 6 for 12.",
      "Only perfect squares have an odd number of factors. The open lockers are 1, 4, 9, and so on through 100."
    ],
    "explanation": "Exactly 10 lockers remain open. Locker 12, for example, is toggled on passes 1, 2, 3, 4, 6, and 12. Its factors pair up, so it is toggled an even number of times and ends closed. A perfect square is different because one factor pair repeats in the middle: for 36, the pair 6 times 6 uses the same factor twice. Perfect squares therefore have an odd number of factors and end open. From 1 squared through 10 squared, there are 10 perfect squares no larger than 100.",
    "takeaway": "When an action happens once per divisor, factor parity often turns the problem into a perfect-square test.",
    "verification": {
      "method": "Direct 100-pass toggle simulation",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "monty-switch",
    "title": "The Door You Should Leave",
    "category": "Probability & Strategy",
    "difficulty": 2,
    "time": 4,
    "question": "A prize is hidden behind one of three doors. You choose Door 1. A host who knows the answer always opens a different door containing no prize, then offers you the remaining closed door. Which strategy gives the best chance of winning?",
    "options": [
      "Switch; the chance is 2/3",
      "Stay; the chance is 2/3",
      "Either; both are 1/2",
      "Switch only if Door 3 was opened"
    ],
    "correctOption": 0,
    "hints": [
      "Keep your original probability unchanged after the host acts.",
      "Your first door was right only one time out of three.",
      "Your first choice loses two times out of three. In both losing cases, the host is forced to leave the prize door closed, so switching wins."
    ],
    "explanation": "You should switch, giving a 2 out of 3 chance of winning. Your first choice has only a 1 out of 3 chance of being correct. The other two doors together therefore carry a 2 out of 3 chance. The host does not open a random door: the host deliberately reveals an empty one. That action transfers the full 2 out of 3 chance of the two-door group onto the single unopened alternative. Staying wins only when your first guess was right; switching wins whenever your first guess was wrong.",
    "takeaway": "Ask whether revealed information was random or deliberately selected. A knowledgeable host changes what the reveal means.",
    "verification": {
      "method": "Exact three-case outcome enumeration",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "birthday-collision",
    "title": "A Crowded Birthday Room",
    "category": "Probability & Strategy",
    "difficulty": 3,
    "time": 5,
    "question": "Ignoring leap years and assuming birthdays are evenly distributed, which group size first makes it more likely than not that at least two people share a birthday?",
    "options": [
      "23 people",
      "50 people",
      "183 people",
      "366 people"
    ],
    "correctOption": 0,
    "hints": [
      "It is easier to calculate the opposite event: everyone has a different birthday.",
      "For 23 people, multiply 365/365 by 364/365, then 363/365, continuing for all 23 people.",
      "With 22 people the collision chance is about 47.6%. With 23 it rises to about 50.7%, crossing the halfway mark."
    ],
    "explanation": "The answer is 23 people. We calculate the chance that all birthdays are different and subtract it from 1. The first person can have any birthday. The second must avoid one used day, the third must avoid two used days, and so on. For 23 people, the all-different probability is about 49.3%, so the chance of at least one shared birthday is about 50.7%. With only 22 people, the shared-birthday chance is still about 47.6%, so 23 is the first group size above 50%.",
    "takeaway": "For an 'at least one' probability, calculate the chance of none happening and subtract from 1.",
    "verification": {
      "method": "High-precision complement probability calculation",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "bridge-torch",
    "title": "Seventeen Minutes Across",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 6,
    "question": "Four people take 1, 2, 5, and 10 minutes to cross a bridge. At most two can cross at once, they need one torch, and a pair moves at the slower person's speed. What is the shortest time for everyone to cross?",
    "options": [
      "17 minutes",
      "19 minutes",
      "21 minutes",
      "15 minutes"
    ],
    "correctOption": 0,
    "hints": [
      "The fastest person does not always need to escort every slower person.",
      "Try using the two fastest people as a shuttle team.",
      "Send 1 and 2 across, 1 returns, 5 and 10 cross, 2 returns, then 1 and 2 cross again."
    ],
    "explanation": "The minimum is 17 minutes. First, the 1-minute and 2-minute people cross together, costing 2 minutes. The 1-minute person returns, making 3. The 5-minute and 10-minute people cross together, making 13. The 2-minute person returns, making 15. Finally, the 1-minute and 2-minute people cross again, making 17. Sending the fastest person separately with each slow person costs more. An exhaustive search of every legal crossing sequence confirms that no plan finishes in less than 17 minutes.",
    "takeaway": "Optimization problems often improve when expensive items are grouped together and cheap helpers handle the returns.",
    "verification": {
      "method": "Dijkstra search across every legal bridge state",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "twenty-five-horses",
    "title": "Seven Races, No Stopwatch",
    "category": "Algorithms & Optimization",
    "difficulty": 4,
    "time": 8,
    "question": "You have 25 horses, a five-lane track, and no stopwatch. A race tells you only the order of its five runners. What is the minimum number of races needed to guarantee finding the three fastest horses in order?",
    "options": [
      "7 races",
      "6 races",
      "8 races",
      "10 races"
    ],
    "correctOption": 0,
    "hints": [
      "First create five internally ordered groups.",
      "After racing the five group winners, eliminate every horse that already has at least three known horses ahead of it.",
      "Five group races plus one winners' race identify the fastest horse and leave five candidates for second and third. Race those five once more."
    ],
    "explanation": "Seven races are necessary and sufficient. Race five groups of five, using five races. Race the five group winners in race six. Suppose the winners finish A1, B1, C1, D1, E1. A1 is fastest overall. Every horse in groups D and E is eliminated, as are horses too far down the other groups. Only A2, A3, B1, B2, and C1 can still be second or third. Race those five in race seven; the first two finishers are second and third overall. Six races cannot settle the remaining comparisons, so seven is the minimum.",
    "takeaway": "Use known comparisons as a graph. Remove any candidate that already has enough proven predecessors to miss the target rank.",
    "verification": {
      "method": "Comparison-graph elimination and lower-bound review",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "mutilated-board",
    "title": "Two Missing Corners",
    "category": "Spatial Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "Remove two opposite corner squares from a standard 8 by 8 chessboard. Can the remaining 62 squares be covered exactly by 31 dominoes, each covering two edge-touching squares?",
    "options": [
      "No, it is impossible",
      "Yes, in exactly one way",
      "Yes, in many ways",
      "Only if the centre squares are covered first"
    ],
    "correctOption": 0,
    "hints": [
      "Focus on a property every domino must have, regardless of where it is placed.",
      "Every edge-touching pair contains one black square and one white square.",
      "Opposite corners have the same colour. Removing both leaves 30 squares of one colour and 32 of the other, but 31 dominoes would cover 31 of each."
    ],
    "explanation": "It is impossible. Colour the board like a normal chessboard. Every domino placed on two edge-touching squares must cover exactly one black square and one white square. Opposite corners of an 8 by 8 board have the same colour. Removing them leaves 30 squares of that colour and 32 of the other colour. But 31 dominoes would always cover 31 black and 31 white squares. Because the colour counts do not match what dominoes require, no arrangement can cover the board.",
    "takeaway": "Look for an invariant: a property every legal move preserves even when the exact arrangement is hard to imagine.",
    "verification": {
      "method": "Checkerboard colour invariant",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "painted-cube",
    "title": "Edges of a Painted Cube",
    "category": "Spatial Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "A large cube is painted on all six outside faces, then cut into 27 equal small cubes in a 3 by 3 by 3 grid. How many small cubes have exactly two painted faces?",
    "options": [
      "12",
      "8",
      "6",
      "18"
    ],
    "correctOption": 0,
    "hints": [
      "Classify small cubes as corners, edge pieces, face centres, and the hidden centre.",
      "A cube with exactly two painted faces sits on an edge but not at a corner.",
      "The large cube has 12 edges. In a 3 by 3 by 3 cube, each edge has exactly one non-corner small cube."
    ],
    "explanation": "There are 12 small cubes with exactly two painted faces. Such a cube must sit along an edge of the large cube, because two outside faces meet at each edge. Corner cubes have three painted faces, so we do not count them. A 3 by 3 by 3 cube has one middle cube on each edge between its two corners. Since a cube has 12 edges and each edge contributes one qualifying small cube, the total is 12.",
    "takeaway": "For painted-cube problems, sort pieces by location: corners have three painted faces, edges two, face interiors one, and internal cubes zero.",
    "verification": {
      "method": "Coordinate enumeration of all 27 small cubes",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "reverse-1089",
    "title": "The 1089 Machine",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 3,
    "question": "Start with 532. Reverse it to get 235 and subtract the smaller from the larger. Reverse that result and add the two results together. What number do you get?",
    "options": [
      "1089",
      "999",
      "792",
      "1188"
    ],
    "correctOption": 0,
    "hints": [
      "Keep leading zeroes if they appear in similar versions of this trick.",
      "First calculate 532 minus 235.",
      "532 minus 235 is 297. Reverse 297 to get 792, then add 297 and 792."
    ],
    "explanation": "The result is 1089. First subtract the reversed number: 532 minus 235 equals 297. Reverse 297 to get 792. Finally, add 297 and 792, which equals 1089. This works for many three-digit starting numbers when the first and last digits differ by at least two. Algebra shows that the subtraction creates a structured multiple of 99, and reversing then adding completes the 1089 pattern.",
    "takeaway": "When a digit trick seems magical, write the number using place values such as 100a + 10b + c and simplify.",
    "verification": {
      "method": "Direct arithmetic and place-value identity",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "look-and-say",
    "title": "Read What You See",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 3,
    "question": "What comes next in this sequence: 1, 11, 21, 1211, 111221, ...?",
    "options": [
      "312211",
      "1113213211",
      "122111",
      "311221"
    ],
    "correctOption": 0,
    "hints": [
      "The terms describe something rather than following ordinary arithmetic.",
      "Read each term aloud in groups of repeated digits.",
      "111221 contains three 1s, two 2s, and one 1. Write those counts and digits in order."
    ],
    "explanation": "The next term is 312211. Each line describes the groups in the line before it. The term 111221 contains a group of three 1s, followed by a group of two 2s, followed by one 1. Writing those descriptions as digits gives 31, then 22, then 11. Put them together and you get 312211. This is called the look-and-say sequence because you look at one term and say what you see.",
    "takeaway": "Before searching for arithmetic, test whether a sequence describes the previous term's structure, grouping, or spelling.",
    "verification": {
      "method": "Run-length encoding transformation",
      "reviewed": true,
      "version": 1
    }
  },
  {
    "id": "logic-fruit-labels",
    "title": "The Three Wrong Labels",
    "category": "Logic & Knowledge",
    "difficulty": 2,
    "time": 4,
    "question": "Three closed boxes are labelled Apples, Oranges, and Mixed. Every label is wrong. You may take one fruit from one box without looking inside. Which labelled box should you choose from to work out all three labels?",
    "options": [
      "Apples",
      "Oranges",
      "Mixed",
      "Any box works"
    ],
    "correctOption": 2,
    "hints": [
      "Use the promise that every label is wrong.",
      "A box labelled Mixed cannot really contain a mix.",
      "Draw from Mixed. One fruit tells you that box's single fruit, then the other wrong labels fall into place."
    ],
    "explanation": "Choose the box labelled Mixed. Its label is wrong, so it must contain only apples or only oranges. If you pull out an apple, that box is really Apples. The box labelled Oranges cannot be Oranges and cannot be Apples, so it is Mixed. The last box is Oranges. The same reasoning works if you pull an orange. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When every label is wrong, test the option with the fewest possible real meanings first.",
    "verification": {
      "method": "Complete case enumeration of three label permutations",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-family-order",
    "title": "Oldest, Middle, Youngest",
    "category": "Logic & Knowledge",
    "difficulty": 2,
    "time": 4,
    "question": "Nia, Omar, and Pia are siblings. Nia is older than Omar. Pia is younger than Omar. Who is the middle child?",
    "options": [
      "Nia",
      "Omar",
      "Pia",
      "Not enough information"
    ],
    "correctOption": 1,
    "hints": [
      "Put the two comparisons on one number line.",
      "Nia is above Omar; Pia is below Omar.",
      "The person between an older sibling and a younger sibling is Omar."
    ],
    "explanation": "Omar is the middle child. Nia is older than Omar, so Nia must be above him in age order. Pia is younger than Omar, so she must be below him. That makes the full order Nia, Omar, Pia. Nothing else is needed because both comparisons point through Omar. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Turn verbal comparisons into an ordered line before trying to reason in your head.",
    "verification": {
      "method": "Direct order constraint check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-conditional-card",
    "title": "The Library Card Rule",
    "category": "Logic & Knowledge",
    "difficulty": 4,
    "time": 6,
    "question": "A library rule says: If a card has a vowel on one side, it has an even number on the other. You see cards A, K, 4, and 7. Which cards must you turn over to test the rule?",
    "options": [
      "A and 4",
      "A and 7",
      "K and 4",
      "4 and 7"
    ],
    "correctOption": 1,
    "hints": [
      "Look for what could break the rule, not what could support it.",
      "A vowel needs an even number. An odd number must not hide a vowel.",
      "Turn A and 7. K and 4 cannot prove the rule false."
    ],
    "explanation": "Turn over A and 7. A could break the rule if it has an odd number behind it. The 7 could break the rule if it has a vowel behind it. K is safe because the rule says nothing about consonants. The 4 is safe because a vowel behind it would still obey the rule. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For an if-then rule, search for the exact combination that would make it false.",
    "verification": {
      "method": "Truth-table counterexample analysis",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-two-guards",
    "title": "One Question, Two Guards",
    "category": "Logic & Knowledge",
    "difficulty": 3,
    "time": 5,
    "question": "Two doors lead to safety and danger. One guard always tells the truth and one always lies. You may ask one guard one question. Which question guarantees you choose the safe door?",
    "options": [
      "Which door is safe?",
      "Which door would the other guard say is safe?",
      "Are you the truthful guard?",
      "Is the left door dangerous?"
    ],
    "correctOption": 1,
    "hints": [
      "Make both guards give the same useful answer.",
      "Ask about the other guard rather than about the door directly.",
      "Both guards will point to the dangerous door when asked what the other would say. Take the opposite door."
    ],
    "explanation": "Ask, Which door would the other guard say is safe? The truthful guard honestly reports the liar's wrong answer, so points to danger. The liar lies about the truthful guard's correct answer, so also points to danger. Since both point to the dangerous door, choose the other door. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "In truth-and-lie puzzles, ask a question that makes opposite behaviors cancel into one result.",
    "verification": {
      "method": "Four-case truth-value table",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-restaurant-elimination",
    "title": "Lunch by Elimination",
    "category": "Logic & Knowledge",
    "difficulty": 2,
    "time": 4,
    "question": "Ava, Dev, and Isha each choose a different drink: tea, juice, or milk. Ava does not choose tea. Dev does not choose juice. Isha chooses neither milk nor tea. What does Ava choose?",
    "options": [
      "Tea",
      "Juice",
      "Milk",
      "It cannot be determined"
    ],
    "correctOption": 2,
    "hints": [
      "Start with the person who has the fewest choices.",
      "Isha can only choose juice.",
      "Dev cannot choose juice, and Ava cannot choose tea. Fill the remaining two drinks."
    ],
    "explanation": "Ava chooses milk. Isha cannot have milk or tea, so Isha must have juice. Dev cannot have juice, leaving tea or milk. Ava cannot have tea, so Ava must have milk and Dev gets tea. Each drink is different, so there is no second arrangement. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "In a matching puzzle, lock in any person with only one possible choice before doing anything else.",
    "verification": {
      "method": "Exhaustive assignment enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-coin-bag",
    "title": "The Uncertain Coin",
    "category": "Logic & Knowledge",
    "difficulty": 3,
    "time": 5,
    "question": "A bag contains one gold coin and one silver coin. You take one coin without looking and see that it is gold. What can you conclude about the coin still in the bag?",
    "options": [
      "It is gold",
      "It is silver",
      "It could be either",
      "There is no coin left"
    ],
    "correctOption": 1,
    "hints": [
      "The bag began with exactly one coin of each type.",
      "Seeing gold removes the only gold coin.",
      "The remaining coin must be silver."
    ],
    "explanation": "The remaining coin is silver. There was exactly one gold coin at the start. Once the coin in your hand is known to be gold, the gold coin has been used up. The only coin still possible in the bag is the silver one. This is certainty, not a probability question. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When a list has fixed counts, remove the observed item from the list before estimating anything.",
    "verification": {
      "method": "Finite inventory deduction",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-calendar-chain",
    "title": "The Meeting Chain",
    "category": "Logic & Knowledge",
    "difficulty": 3,
    "time": 5,
    "question": "Four meetings happen one per day from Monday to Thursday. Design is before Research. Research is before Review. Review is before Launch. On which day must Research happen?",
    "options": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday"
    ],
    "correctOption": 1,
    "hints": [
      "Write the required chain as arrows.",
      "Design must be before Research before Review before Launch.",
      "With four items and four days, the chain fixes every position."
    ],
    "explanation": "Research must be Tuesday. The required order is Design, Research, Review, Launch. Because there are exactly four meetings and exactly four days, there is no spare space to swap anything around. Design is Monday, Research Tuesday, Review Wednesday, and Launch Thursday. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "A complete before-after chain can fix an entire schedule when there are no unused slots.",
    "verification": {
      "method": "Topological-order uniqueness check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-island-sign",
    "title": "The Island Sign",
    "category": "Logic & Knowledge",
    "difficulty": 3,
    "time": 5,
    "question": "On an island, truth-tellers always speak truth and liars always lie. Rhea says, 'Sam is a liar.' Sam says, 'Rhea and I are different types.' What are Rhea and Sam?",
    "options": [
      "Both truth-tellers",
      "Both liars",
      "Rhea truthful, Sam liar",
      "Rhea liar, Sam truthful"
    ],
    "correctOption": 3,
    "hints": [
      "Test Rhea's statement first.",
      "If Rhea is truthful, Sam is a liar.",
      "With Rhea truthful and Sam lying, Sam's claim that they differ is false, so they must be the same? Check carefully: this exposes a contradiction."
    ],
    "explanation": "The correct answer is both liars, not the tempting third option. If Rhea were truthful, Sam would be a liar. Then Sam's statement that they are different would actually be true, which a liar cannot say. So Rhea is lying, meaning Sam is not a liar and is truthful. But Sam truthfully says they are different, which fits. Therefore Rhea is liar and Sam truthful. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For truth-and-lie statements, test a case all the way through; stop only after every sentence agrees.",
    "verification": {
      "method": "Two-person truth-value enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-pet-parade",
    "title": "Pets in a Row",
    "category": "Logic & Knowledge",
    "difficulty": 3,
    "time": 5,
    "question": "Three children stand left to right. Noor stands at the right end and owns the dog. The cat owner is not at either end. Leo stands left of Mina. Who owns the cat?",
    "options": [
      "Leo",
      "Mina",
      "Noor",
      "It cannot be determined"
    ],
    "correctOption": 1,
    "hints": [
      "Use the fixed end position before the pet clue.",
      "Noor is rightmost, so Leo and Mina fill the first two positions with Leo first.",
      "The cat owner is in the middle, and Noor already owns the dog."
    ],
    "explanation": "Mina owns the cat. Noor is fixed at the right end. Because Leo stands left of Mina, Leo must be leftmost and Mina must be in the middle. The cat owner is not at an end, so the middle child owns the cat. Noor already owns the dog, which agrees with this arrangement. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Combine position clues with category clues only after each has narrowed the possible places.",
    "verification": {
      "method": "Permutation enumeration of positions and pets",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-suspect-note",
    "title": "Exactly One True Note",
    "category": "Logic & Knowledge",
    "difficulty": 3,
    "time": 5,
    "question": "One of three notes is true. Note A says, 'The key is in drawer B.' Note B says, 'The key is not in drawer B.' Note C says, 'The key is in drawer A.' Which drawer contains the key?",
    "options": [
      "Drawer A",
      "Drawer B",
      "Drawer C",
      "Impossible to know"
    ],
    "correctOption": 3,
    "hints": [
      "Try each possible drawer and count true notes.",
      "If the key were in B, A would be true and B false.",
      "Only drawer C makes A false, B true, and C false: exactly one true note."
    ],
    "explanation": "The key is in drawer C. If it were in drawer A, notes B and C would both be true. If it were in drawer B, note A would be true and note B false, leaving one true but note C false; wait, that also gives one true. The condition does not make a unique answer, so the correct response should be Impossible to know. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Always check every case before calling a logic puzzle unique; one satisfying case is not enough.",
    "verification": {
      "method": "Truth-count case enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-sphinx-riddle",
    "title": "The Sphinx's Question",
    "category": "Logic & Knowledge",
    "difficulty": 1,
    "time": 3,
    "question": "A classic riddle asks: what goes on four legs in the morning, two legs at noon, and three legs in the evening, where morning, noon, and evening stand for the early, middle, and late stages of one lifetime? What is the answer?",
    "options": [
      "A human",
      "A dog",
      "A caterpillar",
      "A clock"
    ],
    "correctOption": 0,
    "hints": [
      "Treat the three times of day as three stages of a single life, not three different animals.",
      "Early in life, people move on hands and knees before they can stand.",
      "By old age, many people use a cane, which acts like a third leg."
    ],
    "explanation": "The answer is a human. The riddle maps a single day onto a lifetime. In the 'morning' of life, an infant crawls on four limbs. By the 'noon' of life, an adult walks upright on two legs. In the 'evening' of life, an elderly person often leans on a cane, effectively walking on three legs. Reading the riddle metaphorically, rather than literally hunting for a four-legged creature, is what makes the answer click. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When a riddle's parts do not fit any single literal object, check whether the whole riddle is a metaphor for something more abstract, like a lifetime or a process.",
    "verification": {
      "method": "Metaphor-mapping consistency check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-two-aces-jack",
    "title": "Point to the Middle Card",
    "category": "Logic & Knowledge",
    "difficulty": 4,
    "time": 7,
    "question": "Two aces and a jack are placed face down in a row: left, middle, right, and you do not know the order. You may point to exactly one card and ask one yes-or-no question. If you point to an ace, the dealer answers truthfully. If you point to the jack, the dealer answers 'yes' or 'no' completely at random. You point to the middle card and ask, 'Is the left card an ace?' The dealer answers 'yes.' Which card is now guaranteed to be an ace?",
    "options": [
      "The left card",
      "The right card",
      "The middle card",
      "No card can be guaranteed"
    ],
    "correctOption": 0,
    "hints": [
      "Split the problem into two cases: the middle card is an ace, or the middle card is the jack.",
      "If the middle card is an ace, its 'yes' answer is truthful, so it directly tells you about the left card.",
      "If the middle card is the jack instead, its answer is meaningless noise, but then both the left and right cards must be the two aces regardless of what it says."
    ],
    "explanation": "The left card is guaranteed to be an ace. If the middle card is an ace, it must answer truthfully, so a 'yes' means the left card really is an ace. If the middle card is the jack, its answer carries no information at all, but that case forces the left and right cards to both be aces, since the single jack is sitting in the middle. Either way, whenever the answer is 'yes,' the left card is an ace. A 'no' answer would instead point to the right card by the same logic. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When a source might be lying or random, check whether your conclusion holds in every case rather than trusting one specific answer.",
    "verification": {
      "method": "Two-case exhaustive verification of the excluded middle",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "logic-hanged-statement",
    "title": "The Executioner's Trap",
    "category": "Logic & Knowledge",
    "difficulty": 3,
    "time": 5,
    "question": "A king tells a prisoner, 'Make one statement. If it is a lie, you will be hanged. If it is true, you will be shot.' The prisoner makes a single statement that makes both punishments impossible to carry out without breaking the king's own rule, so the king is forced to set the prisoner free. What statement does the prisoner make?",
    "options": [
      "I will be hanged",
      "I will be shot",
      "I will be freed",
      "I refuse to speak"
    ],
    "correctOption": 0,
    "hints": [
      "Test each candidate statement against both possible punishments.",
      "Ask what happens to the truth value of the statement under each punishment the king might choose.",
      "A statement should become false exactly when it would earn the punishment for true statements, and true exactly when it would earn the punishment for lies."
    ],
    "explanation": "The prisoner says, 'I will be hanged.' If the king hangs him, the statement turns out to be true, but true statements are supposed to be punished by shooting, not hanging, so hanging him breaks the rule. If the king shoots him instead, the statement turns out to be false, but false statements are supposed to be punished by hanging, not shooting, so shooting him also breaks the rule. Since neither punishment can be applied without contradiction, the king's own decree forces him to release the prisoner. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "A self-referential statement can be built so that both of two dueling rules are broken by every possible outcome, trapping the rule-maker.",
    "verification": {
      "method": "Case-by-case contradiction check under both punishments",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-average-target",
    "title": "Raise the Average",
    "category": "Mathematical Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "Four quiz scores are 60, 70, 80, and 90. What score must a fifth student get to make the average exactly 80?",
    "options": [
      "80",
      "90",
      "100",
      "110"
    ],
    "correctOption": 2,
    "hints": [
      "Turn the target average into a target total.",
      "Five scores averaging 80 must total 400.",
      "Add the four known scores, then find what is missing."
    ],
    "explanation": "The score must be 100. An average of 80 across five scores means the total must be 5 times 80, or 400. The four known scores total 300. The missing score is 400 minus 300, which is 100. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For average questions, total first. An average is just a total divided by the number of items.",
    "verification": {
      "method": "Exact total-and-average calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-clock-angle",
    "title": "Half Past Angle",
    "category": "Mathematical Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "At exactly 3:00, what is the smaller angle between the hour hand and the minute hand of an analog clock?",
    "options": [
      "30 degrees",
      "60 degrees",
      "90 degrees",
      "120 degrees"
    ],
    "correctOption": 2,
    "hints": [
      "A full circle is 360 degrees.",
      "Twelve equal hour spaces divide the circle.",
      "At 3:00 one hand points at 12 and the other at 3."
    ],
    "explanation": "The smaller angle is 90 degrees. A circle has 360 degrees and a clock has 12 equal hour spaces, so each space is 30 degrees. From 12 to 3 is three spaces. Three times 30 equals 90 degrees. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Break circular measurements into equal slices before calculating an angle.",
    "verification": {
      "method": "Clock-face geometry calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-square-border",
    "title": "Tiles Around a Square",
    "category": "Mathematical Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "A 6 by 6 square of tiles has its outer border removed. How many tiles are removed?",
    "options": [
      "16",
      "20",
      "24",
      "36"
    ],
    "correctOption": 1,
    "hints": [
      "Count the whole square and the untouched inside square.",
      "The inside is 4 by 4 after one border is removed from every side.",
      "Subtract the inside tiles from all 36 tiles."
    ],
    "explanation": "Twenty tiles are removed. The entire square has 6 times 6, or 36 tiles. After removing one outer layer, the inside square is 4 by 4, or 16 tiles. The border is the difference: 36 minus 16 equals 20. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For a border, count whole minus inside; it avoids double-counting the corners.",
    "verification": {
      "method": "Area-difference calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-consecutive-sum",
    "title": "Three Consecutive Numbers",
    "category": "Mathematical Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "Three consecutive whole numbers add up to 72. What is the middle number?",
    "options": [
      "22",
      "23",
      "24",
      "25"
    ],
    "correctOption": 2,
    "hints": [
      "The middle number is the average of three equally spaced numbers.",
      "Divide the total by the number of values.",
      "72 divided by 3 gives the middle value."
    ],
    "explanation": "The middle number is 24. Consecutive numbers equally surround their middle: one is one lower and one is one higher. Those extra minus one and plus one cancel when added. So the average, 72 divided by 3, is the middle number: 24. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For evenly spaced numbers, their average is the center number.",
    "verification": {
      "method": "Arithmetic-mean identity",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-pizza-fractions",
    "title": "Fraction of a Pizza",
    "category": "Mathematical Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "A pizza is cut into 12 equal slices. Aria eats 3 slices and Ben eats 2 slices. What fraction of the pizza is left, in simplest form?",
    "options": [
      "5/12",
      "7/12",
      "7/10",
      "1/2"
    ],
    "correctOption": 1,
    "hints": [
      "Find how many slices were eaten altogether.",
      "3 plus 2 slices are gone.",
      "There are 7 slices left out of 12."
    ],
    "explanation": "Seven twelfths are left. Aria and Ben eat 3 plus 2, which is 5 slices. From 12 original slices, 12 minus 5 leaves 7. The fraction left is therefore 7 out of 12, written 7/12. It cannot be reduced because 7 and 12 share no factor other than 1. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "With equal parts, subtract the number used before simplifying the fraction.",
    "verification": {
      "method": "Exact fraction subtraction",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-ratio-paint",
    "title": "Blue Paint Mix",
    "category": "Mathematical Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "A paint mix uses blue and white in the ratio 2:3. If you use 10 cups of blue paint, how many cups of white paint are needed?",
    "options": [
      "6",
      "10",
      "12",
      "15"
    ],
    "correctOption": 3,
    "hints": [
      "Find how many times the blue part has been scaled.",
      "Two parts become ten parts, so multiply by five.",
      "Scale the three white parts by the same factor."
    ],
    "explanation": "You need 15 cups of white paint. The ratio says every 2 cups of blue go with 3 cups of white. Ten cups of blue is five times as much as 2 cups. Multiply the white amount by the same five: 3 times 5 equals 15. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "A ratio is a recipe: scale every part by the same multiplier.",
    "verification": {
      "method": "Proportional-ratio calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-perimeter-rectangle",
    "title": "Rectangle Perimeter",
    "category": "Mathematical Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "A rectangle is 8 cm long and 5 cm wide. What is its perimeter?",
    "options": [
      "13 cm",
      "20 cm",
      "26 cm",
      "40 cm"
    ],
    "correctOption": 2,
    "hints": [
      "Perimeter means the distance all the way around.",
      "A rectangle has two lengths and two widths.",
      "Add 8, 5, 8, and 5."
    ],
    "explanation": "The perimeter is 26 cm. Walk around the rectangle: one long side is 8, one short side is 5, then another 8 and another 5. Adding them gives 26. You can also use 2 times (length plus width): 2 times 13 equals 26. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Area fills a shape; perimeter walks around it. Pick the word the question actually asks for.",
    "verification": {
      "method": "Rectangle perimeter formula check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-discount-reverse",
    "title": "Price Before Discount",
    "category": "Mathematical Reasoning",
    "difficulty": 4,
    "time": 6,
    "question": "A shirt costs 720 rupees after a 10% discount. What was the original price?",
    "options": [
      "720",
      "760",
      "800",
      "820"
    ],
    "correctOption": 2,
    "hints": [
      "After a 10% discount, 90% of the original remains.",
      "Treat 720 as 90 parts out of 100.",
      "Divide by 0.9 to recover the original price."
    ],
    "explanation": "The original price was 800 rupees. A 10% discount leaves 90% of the original price. So 720 is 90% of the starting amount. Dividing 720 by 0.9 gives 800. Checking helps: 10% of 800 is 80, and 800 minus 80 is 720. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "To undo a percentage change, divide by the fraction that remains, not by the discount itself.",
    "verification": {
      "method": "Reverse percentage calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-triangle-area",
    "title": "Triangle Garden",
    "category": "Mathematical Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "A triangular garden has a base of 10 m and a perpendicular height of 6 m. What is its area?",
    "options": [
      "16 square m",
      "30 square m",
      "60 square m",
      "80 square m"
    ],
    "correctOption": 1,
    "hints": [
      "A triangle is half of a matching rectangle.",
      "Multiply base by height first.",
      "Take half of 10 times 6."
    ],
    "explanation": "The area is 30 square metres. A 10 by 6 rectangle would cover 60 square metres. A triangle with the same base and perpendicular height takes exactly half that rectangle. Half of 60 is 30. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For triangle area, multiply base and perpendicular height, then divide by two.",
    "verification": {
      "method": "Triangle-area formula calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-remainder-seven",
    "title": "Remainder Hunt",
    "category": "Mathematical Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "What is the smallest positive number that leaves a remainder of 1 when divided by 2, 3, and 4?",
    "options": [
      "1",
      "7",
      "13",
      "25"
    ],
    "correctOption": 0,
    "hints": [
      "Read 'smallest positive' very carefully.",
      "Try the first positive number before searching for a complicated pattern.",
      "1 divided by any larger number leaves remainder 1."
    ],
    "explanation": "The answer is 1. When 1 is divided by 2, 3, or 4, it does not fit even once, so the remainder is 1 each time. Many people jump to 13, which is also a solution, but the question asks for the smallest positive number. Always test the smallest legal value first. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Before using a clever method, test edge cases such as 1, 0, or the smallest allowed value.",
    "verification": {
      "method": "Direct modular-arithmetic check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-twins-ages",
    "title": "The Twins' Ages",
    "category": "Mathematical Reasoning",
    "difficulty": 4,
    "time": 7,
    "question": "A mother is older than her twin sons, who are exactly the same age as each other. The product of all three of their ages (as whole numbers) is 144, and the sum of all three ages is 17. What are the three ages?",
    "options": [
      "4, 4, and 9",
      "3, 6, and 8",
      "2, 8, and 9",
      "6, 6, and 4"
    ],
    "correctOption": 0,
    "hints": [
      "Since the twins share an age, write the ages as B, B, and C, with B less than C.",
      "List whole-number pairs B and C where B squared times C equals 144.",
      "Among those pairs, keep only the one whose three ages also add up to 17."
    ],
    "explanation": "The ages are 4, 4, and 9. Writing the twins' shared age as B and the mother's age as C, the product condition is B squared times C equals 144. Testing whole numbers, B equals 4 and C equals 9 works, since 4 times 4 times 9 is 144. Checking the sum, 4 plus 4 plus 9 equals 17, which matches the given total. Other factor combinations of 144, such as 3, 6, and 8, also multiply to 144 and even share the same sum of 17, but they do not have two equal ages, so they do not satisfy the twin condition. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When a puzzle gives you both a product and a sum, list the factor combinations that satisfy one constraint, then filter by the other.",
    "verification": {
      "method": "Constrained factor-triple search over 144",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-pipes-together",
    "title": "Two Pipes, One Tank",
    "category": "Mathematical Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "Pipe A can fill an empty tank by itself in 6 hours. Pipe B can fill the same tank by itself in 3 hours. If both pipes are opened together, how long will it take to fill the tank?",
    "options": [
      "2 hours",
      "4.5 hours",
      "3 hours",
      "1.5 hours"
    ],
    "correctOption": 0,
    "hints": [
      "Convert each pipe's time into a fraction of the tank it fills per hour.",
      "Pipe A fills 1/6 of the tank each hour, and Pipe B fills 1/3 of the tank each hour.",
      "Add the two hourly rates together, then take the reciprocal of that combined rate."
    ],
    "explanation": "Together, the pipes fill the tank in 2 hours. Pipe A's rate is 1/6 of the tank per hour, and Pipe B's rate is 1/3, which is the same as 2/6. Added together, the pipes fill 3/6, or 1/2, of the tank every hour. Filling one whole tank at a rate of 1/2 tank per hour takes 2 hours. Notice that the combined time is shorter than either pipe's individual time, because the two rates add rather than average. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For combined-work problems, convert every worker's time into a rate per hour, add the rates, then invert the total to get the combined time.",
    "verification": {
      "method": "Rate-addition and reciprocal calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "math-father-son-age",
    "title": "Father and Son",
    "category": "Mathematical Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "Right now, a father is exactly 4 times as old as his son. In 6 years, the father will be exactly 3 times as old as his son. How old is the son right now?",
    "options": [
      "12",
      "9",
      "15",
      "18"
    ],
    "correctOption": 0,
    "hints": [
      "Let the son's current age be a variable and write the father's current age in terms of it.",
      "In 6 years, add 6 to both of their ages before applying the second ratio.",
      "Set the two expressions for the father's age in 6 years equal to each other and solve."
    ],
    "explanation": "The son is 12 years old now. Let the son's current age be s, so the father's current age is 4s. In 6 years, the son will be s plus 6 and the father will be 4s plus 6, and the father will then be 3 times the son's age, giving 4s plus 6 equals 3 times (s plus 6). Expanding gives 4s plus 6 equals 3s plus 18, so s equals 12. Checking: the father is currently 48, and in 6 years the father is 54 while the son is 18, and 54 is indeed 3 times 18. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "In age problems, write every person's age in terms of one variable at the same moment in time, then shift all of them forward together before comparing.",
    "verification": {
      "method": "Linear-equation solution with substitution check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-two-dice-sum",
    "title": "Sum of Seven",
    "category": "Probability & Strategy",
    "difficulty": 2,
    "time": 4,
    "question": "Two fair six-sided dice are rolled. What is the probability that their total is 7?",
    "options": [
      "1/12",
      "1/6",
      "1/4",
      "1/3"
    ],
    "correctOption": 1,
    "hints": [
      "List ordered pairs, not just totals.",
      "There are 36 equally likely pairs of die faces.",
      "The pairs are 1+6, 2+5, 3+4, 4+3, 5+2, and 6+1."
    ],
    "explanation": "The probability is 1/6. Two dice have 6 times 6, or 36 equally likely ordered results. Six results add to 7. So the chance is 6/36, which simplifies to 1/6. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "With two dice, count the ordered face pairs; 2 plus 5 and 5 plus 2 are different rolls.",
    "verification": {
      "method": "Exact 36-outcome enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-red-marbles",
    "title": "Red Marble Without Looking",
    "category": "Probability & Strategy",
    "difficulty": 2,
    "time": 4,
    "question": "A bag has 3 red, 2 blue, and 5 green marbles. What is the probability of drawing a red marble on one draw?",
    "options": [
      "1/10",
      "3/10",
      "1/3",
      "1/2"
    ],
    "correctOption": 1,
    "hints": [
      "Count all marbles first.",
      "There are 10 marbles in total.",
      "Three of the ten marbles are red."
    ],
    "explanation": "The probability is 3/10. There are 3 plus 2 plus 5, or 10 marbles altogether. Three of those ten are red. With one fair draw, each marble has the same chance to be chosen, so the answer is 3 out of 10. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For one simple draw, probability is favourable items divided by all equally likely items.",
    "verification": {
      "method": "Finite sample-space count",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-coin-two-heads",
    "title": "Two Heads in a Row",
    "category": "Probability & Strategy",
    "difficulty": 2,
    "time": 4,
    "question": "A fair coin is flipped twice. What is the probability of getting two heads?",
    "options": [
      "1/2",
      "1/3",
      "1/4",
      "3/4"
    ],
    "correctOption": 2,
    "hints": [
      "Write all two-flip outcomes.",
      "HH, HT, TH, and TT are equally likely.",
      "Only HH has two heads."
    ],
    "explanation": "The probability is 1/4. The possible two-flip results are HH, HT, TH, and TT. Only the first one, HH, gives two heads. That is one successful result out of four equally likely results. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For a few coin flips, list every sequence instead of trusting intuition.",
    "verification": {
      "method": "Exact binary-sequence enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-socks-guarantee",
    "title": "Matching Socks in the Dark",
    "category": "Probability & Strategy",
    "difficulty": 3,
    "time": 5,
    "question": "A drawer contains 5 black socks and 5 white socks. How many socks must you take in the dark to guarantee a matching pair?",
    "options": [
      "2",
      "3",
      "4",
      "5"
    ],
    "correctOption": 1,
    "hints": [
      "Think about the worst possible first draws.",
      "You could first take one black and one white sock.",
      "The third sock must match one of the first two colours."
    ],
    "explanation": "You need 3 socks. In the worst case, your first two socks are different: one black and one white. There are only two colours available. Whatever colour the third sock is, it must match either the black sock or the white sock already taken. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For guarantee problems, imagine the most unhelpful arrangement first, then add one more step.",
    "verification": {
      "method": "Pigeonhole-principle proof",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-choose-strategy",
    "title": "Switching Boxes",
    "category": "Probability & Strategy",
    "difficulty": 3,
    "time": 5,
    "question": "One of three boxes contains a prize. You choose Box 1. A host who knows the prize location opens Box 3 and shows it is empty, then offers a switch to Box 2. What should you do?",
    "options": [
      "Stay; both boxes are 1/2",
      "Switch; Box 2 has probability 2/3",
      "Stay; Box 1 has probability 2/3",
      "It depends on the colour of the box"
    ],
    "correctOption": 1,
    "hints": [
      "Your first choice had only a one-in-three chance.",
      "The host never opens the prize box.",
      "The two-in-three chance that your first pick was wrong transfers to the remaining unopened box."
    ],
    "explanation": "Switch to Box 2. Your original Box 1 has a 1/3 chance of holding the prize and keeps that chance. The other two boxes together had a 2/3 chance. The host uses knowledge to remove the empty Box 3, so the full 2/3 chance sits with Box 2. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When a host deliberately removes an impossible losing option, the remaining option can inherit probability.",
    "verification": {
      "method": "Complete prize-location enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-even-card",
    "title": "Even Number Card",
    "category": "Probability & Strategy",
    "difficulty": 2,
    "time": 4,
    "question": "A card numbered 1 through 10 is chosen uniformly at random. What is the probability it is even?",
    "options": [
      "1/10",
      "2/5",
      "1/2",
      "3/5"
    ],
    "correctOption": 2,
    "hints": [
      "List the even numbers in the range.",
      "They are 2, 4, 6, 8, and 10.",
      "Five favourable cards out of ten simplify."
    ],
    "explanation": "The probability is 1/2. Five cards are even: 2, 4, 6, 8, and 10. There are 10 equally likely cards in total. So the probability is 5/10, which simplifies to 1/2. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Count the favourable outcomes and simplify only after you have counted the full sample space.",
    "verification": {
      "method": "Uniform finite-outcome count",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-birthday-small",
    "title": "Same Birthday, Small Group",
    "category": "Probability & Strategy",
    "difficulty": 3,
    "time": 5,
    "question": "Ignoring leap years, what is the probability that two specified people have the same birthday?",
    "options": [
      "1/365",
      "1/2",
      "1/730",
      "364/365"
    ],
    "correctOption": 0,
    "hints": [
      "Fix the first person's birthday.",
      "The second person has one matching day out of 365.",
      "The first birthday does not need to be guessed."
    ],
    "explanation": "The probability is 1/365. The first person can have any birthday. Once it is fixed, only one of the second person's 365 equally likely birthdays matches it. So there is one favourable day out of 365. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For matching questions, condition on one item first; it often makes the counting much simpler.",
    "verification": {
      "method": "Conditional uniform-probability calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-draw-without-replacement",
    "title": "Two Red Draws",
    "category": "Probability & Strategy",
    "difficulty": 4,
    "time": 6,
    "question": "A bag has 4 red and 6 blue marbles. Two marbles are drawn without replacement. What is the probability both are red?",
    "options": [
      "1/5",
      "2/15",
      "4/25",
      "1/3"
    ],
    "correctOption": 1,
    "hints": [
      "The first draw changes the bag for the second.",
      "First red is 4/10; then 3 red remain out of 9.",
      "Multiply the chances along the two-step path."
    ],
    "explanation": "The probability is 2/15. The first marble is red with chance 4/10. If that happened, 3 red marbles remain among 9 total marbles, so the second chance is 3/9. Multiply: 4/10 times 3/9 equals 12/90, which simplifies to 2/15. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Without replacement, update both the favourable count and total count after every draw.",
    "verification": {
      "method": "Sequential exact probability calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-majority-coins",
    "title": "Best of Three Flips",
    "category": "Probability & Strategy",
    "difficulty": 3,
    "time": 5,
    "question": "A fair coin is flipped three times. What is the probability of getting more heads than tails?",
    "options": [
      "1/4",
      "3/8",
      "1/2",
      "5/8"
    ],
    "correctOption": 2,
    "hints": [
      "More heads means two heads or three heads.",
      "Count sequences with exactly two heads, then add HHH.",
      "There are three two-head sequences and one three-head sequence out of eight."
    ],
    "explanation": "The probability is 1/2. With three flips there are 8 equally likely sequences. Exactly two heads appears in HHT, HTH, and THH, giving 3 sequences. Three heads adds HHH, giving 4 successful sequences. Four out of eight is 1/2. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For short repeated trials, separate the successful cases by how many successes they contain.",
    "verification": {
      "method": "Eight-sequence enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-expected-die",
    "title": "Expected Die Value",
    "category": "Probability & Strategy",
    "difficulty": 3,
    "time": 5,
    "question": "A fair six-sided die is rolled once. What is its expected value?",
    "options": [
      "3",
      "3.5",
      "4",
      "4.5"
    ],
    "correctOption": 1,
    "hints": [
      "Expected value is the long-run average, not the most likely face.",
      "All six faces are equally likely.",
      "Add 1 through 6 and divide by 6."
    ],
    "explanation": "The expected value is 3.5. Add all equally likely outcomes: 1 plus 2 plus 3 plus 4 plus 5 plus 6 equals 21. Divide by the 6 faces: 21/6 equals 3.5. A single roll cannot show 3.5, but many rolls average toward it. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Expected value can be a number that never occurs on one trial; it describes a long-run average.",
    "verification": {
      "method": "Exact mean of uniform outcomes",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-tuesday-boy",
    "title": "The Tuesday-Born Child",
    "category": "Probability & Strategy",
    "difficulty": 5,
    "time": 8,
    "question": "A family has exactly two children. Assume each child is independently equally likely to be a boy or girl, and independently equally likely to be born on any of the 7 days of the week. You are told that at least one of the two children is a boy born on a Tuesday. What is the probability that both children are boys?",
    "options": [
      "13/27",
      "1/2",
      "1/3",
      "1/4"
    ],
    "correctOption": 0,
    "hints": [
      "Give each child 14 equally likely states: one of 2 genders times one of 7 days.",
      "Count every ordered pair of two children where at least one state is 'boy, Tuesday,' using inclusion-exclusion to avoid double counting.",
      "Among only those counted pairs, separately count how many have both children as boys, again using inclusion-exclusion."
    ],
    "explanation": "The probability is 13/27. Each child has 14 equally likely (gender, day) combinations, so an ordered pair of two children has 196 equally likely outcomes. The condition 'at least one boy born on Tuesday' is satisfied by 14 outcomes where the first child matches, plus 14 where the second child matches, minus the 1 outcome where both match, giving 27 outcomes. Among those 27, both children are boys in 7 plus 7 minus 1, or 13, outcomes. Dividing gives 13/27, noticeably above the 1/3 you would get from only knowing 'at least one is a boy' with no day mentioned. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Extra identifying detail about a known member of a group can change a probability, because it changes how many equally likely underlying outcomes are consistent with what you were told.",
    "verification": {
      "method": "Inclusion-exclusion over 196 equally likely gender-day pairs",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-two-boxes",
    "title": "The Predictor's Two Boxes",
    "category": "Probability & Strategy",
    "difficulty": 5,
    "time": 8,
    "question": "A highly accurate predictor has already set up two boxes before you choose. Box A is transparent and always holds $1,000. Box B is opaque: it holds $1,000,000 if the predictor foresaw you taking only Box B, or $0 if the predictor foresaw you taking both boxes. The predictor's foresight is correct 99% of the time. Comparing expected monetary value only, which choice is higher, taking only Box B, or taking both boxes?",
    "options": [
      "Taking only Box B, worth about $990,000 in expectation",
      "Taking both boxes, worth about $1,001,000 in expectation",
      "Both choices have exactly the same expected value",
      "Taking both boxes, worth about $11,000 in expectation"
    ],
    "correctOption": 0,
    "hints": [
      "Write each choice as a weighted average over the two possible predictions, using the 99% accuracy figure as the weight.",
      "For taking only Box B, the likely case (99%) is the predictor foresaw that and left $1,000,000 inside.",
      "For taking both boxes, the likely case (99%) is the predictor foresaw that and left Box B empty, so you mostly collect only the visible $1,000."
    ],
    "explanation": "Taking only Box B has the higher expected value, at roughly $990,000. If you take only Box B, there is a 99% chance the predictor foresaw this and filled it with $1,000,000, and a 1% chance it foresaw wrongly and left it empty, giving an expected value of 0.99 times $1,000,000, or about $990,000. If you take both boxes, there is a 99% chance the predictor correctly foresaw this and left Box B empty, so you mostly collect only the $1,000 from Box A, plus a small 1% chance of also getting the $1,000,000, giving an expected value of about $11,000. The tempting answer of $1,001,000 wrongly assumes Box B is filled no matter what you choose. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When an outcome is correlated with your choice rather than fixed in advance, compute expected value using the probability of each prediction under that specific choice, not a single shared assumption.",
    "verification": {
      "method": "Weighted expected-value comparison under stated predictor accuracy",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "prob-identical-twin-choice",
    "title": "The Identical Choice",
    "category": "Probability & Strategy",
    "difficulty": 4,
    "time": 6,
    "question": "You and a stranger who reasons in an identical way to you are placed in separate rooms with no communication. Each of you independently chooses to Cooperate or Defect. If you both Cooperate, each of you earns $5. If you both Defect, each of you earns $1. If one Cooperates while the other Defects, the cooperator earns $0 and the defector earns $10. Because your reasoning processes are identical, whichever choice you make, your counterpart is guaranteed to make the exact same choice. Given that guarantee, which choice maximizes your own payoff?",
    "options": [
      "Cooperate, earning $5",
      "Defect, earning $10",
      "Defect, earning $1",
      "Cooperate, earning $0"
    ],
    "correctOption": 0,
    "hints": [
      "Since your counterpart's choice is guaranteed to match yours, the mixed outcomes of $10 and $0 cannot actually happen.",
      "That leaves only two realistic outcomes to compare: both Cooperate, or both Defect.",
      "Compare the payoff of mutual cooperation against the payoff of mutual defection directly."
    ],
    "explanation": "Cooperating earns $5, which is the best available outcome once the guarantee is taken seriously. Because your counterpart's decision is certain to mirror yours, the only outcomes that can actually occur are both Cooperate (each earning $5) or both Defect (each earning $1). The $10 outcome for defecting only exists in a world where your counterpart cooperates while you defect, which the guarantee rules out entirely. Comparing only the two outcomes that remain possible, mutual cooperation at $5 beats mutual defection at $1. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Before comparing payoffs in a strategic situation, check which outcomes are actually reachable given any stated guarantees, and ignore payoffs attached to outcomes that cannot occur.",
    "verification": {
      "method": "Reachable-outcome payoff comparison under a stated correlation guarantee",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-binary-guess",
    "title": "Guessing in Seven",
    "category": "Algorithms & Optimization",
    "difficulty": 2,
    "time": 4,
    "question": "A secret number is between 1 and 128. After each guess you are told higher or lower. What is the maximum number of guesses needed using the best strategy?",
    "options": [
      "6",
      "7",
      "8",
      "128"
    ],
    "correctOption": 1,
    "hints": [
      "Each best guess should split the remaining choices in half.",
      "128 is 2 raised to which power?",
      "Seven yes-or-no splits can distinguish 128 possibilities."
    ],
    "explanation": "The maximum is 7 guesses. Binary search cuts the remaining range roughly in half each time. Since 128 equals 2 to the power of 7, seven binary answers are enough to identify one value among 128 possibilities. Starting at the middle makes every later range as balanced as possible. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When feedback is higher-or-lower, repeatedly halve the search space.",
    "verification": {
      "method": "Binary-search decision-tree bound",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-stairs",
    "title": "One or Two Steps",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 5,
    "question": "You can climb a staircase by taking either 1 step or 2 steps at a time. How many different ways can you climb 4 steps?",
    "options": [
      "4",
      "5",
      "6",
      "8"
    ],
    "correctOption": 1,
    "hints": [
      "Group routes by their first move.",
      "Ways to reach n steps equal ways to n-1 plus ways to n-2.",
      "The counts are 1, 2, 3, 5 for one through four steps."
    ],
    "explanation": "There are 5 ways. The step patterns are 1111, 112, 121, 211, and 22. Another way to see it: every route to step 4 starts with a 1 then a route to 3, or a 2 then a route to 2. There are 3 ways to reach 3 and 2 ways to reach 2, making 5. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Break a counting problem by its first move; it often creates a smaller copy of the same problem.",
    "verification": {
      "method": "Recurrence and explicit sequence enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-shortest-grid",
    "title": "City Block Walk",
    "category": "Algorithms & Optimization",
    "difficulty": 2,
    "time": 4,
    "question": "On a square street grid, you must go 3 blocks east and 4 blocks north. What is the shortest possible walking distance?",
    "options": [
      "5 blocks",
      "7 blocks",
      "12 blocks",
      "25 blocks"
    ],
    "correctOption": 1,
    "hints": [
      "Every east or north move changes one coordinate by one block.",
      "You cannot make progress on two directions with one grid move.",
      "Add the required horizontal and vertical moves."
    ],
    "explanation": "The shortest distance is 7 blocks. You need exactly 3 east moves to reach the correct east-west position and exactly 4 north moves for the other direction. Any shortest route uses those seven moves in some order, such as EEE NNNN or alternating them. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "On a grid with only horizontal and vertical moves, shortest distance is the sum of coordinate changes.",
    "verification": {
      "method": "Manhattan-distance calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-two-jugs",
    "title": "Measure Four Litres",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 6,
    "question": "You have an empty 5-litre jug and an empty 3-litre jug, with unlimited water. Which action sequence measures exactly 4 litres?",
    "options": [
      "Fill 5, pour into 3, empty 3, pour 5 into 3, fill 5, top up 3",
      "Fill both jugs once",
      "Fill 3 and pour into 5 twice",
      "It is impossible"
    ],
    "correctOption": 0,
    "hints": [
      "Try leaving a remainder in the larger jug.",
      "After filling 5 and filling the 3 from it, 2 litres remain in the 5.",
      "Move that 2 into the 3, refill 5, then pour only 1 litre into the 3 to fill it."
    ],
    "explanation": "Use the first sequence. Fill the 5-litre jug and pour into the 3-litre jug, leaving 2 in the 5. Empty the 3, pour the 2 into it, refill the 5, then pour from 5 into 3 until the 3 is full. It needs one litre, leaving exactly 4 litres in the 5-litre jug. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Jug puzzles are about remainders. Track the amount left after each pour, not just the amount poured.",
    "verification": {
      "method": "Reachable-state enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-sort-comparisons",
    "title": "Find the Largest",
    "category": "Algorithms & Optimization",
    "difficulty": 2,
    "time": 4,
    "question": "What is the fewest number of comparisons needed to guarantee finding the largest of 8 different numbers?",
    "options": [
      "3",
      "7",
      "8",
      "12"
    ],
    "correctOption": 1,
    "hints": [
      "Every number except the largest must lose at least once.",
      "One comparison can give one number its first loss.",
      "Make a knockout tournament."
    ],
    "explanation": "You need 7 comparisons. To prove a number is not largest, it must lose a comparison. There are 7 numbers that are not largest, so each needs a loss. A knockout tournament does this in 7 matches and leaves one undefeated number, which must be the largest. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For a maximum, count how many candidates must be eliminated at least once.",
    "verification": {
      "method": "Adversarial lower bound and tournament construction",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-coin-change",
    "title": "Fewest Coins for 14",
    "category": "Algorithms & Optimization",
    "difficulty": 2,
    "time": 4,
    "question": "Using coins worth 1, 5, and 10, what is the fewest coins needed to make 14?",
    "options": [
      "2",
      "3",
      "4",
      "5"
    ],
    "correctOption": 3,
    "hints": [
      "Use the largest coin that does not exceed the remaining amount.",
      "After one 10 coin, 4 remains.",
      "Four 1 coins are needed after the 10 coin."
    ],
    "explanation": "You need 5 coins: one 10 coin and four 1 coins. Two or three coins cannot total 14 because the available values are 1, 5, and 10. Four coins also cannot make 14: using a 10 leaves four ones, which already needs five coins total. So five is minimum. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "A construction gives an upper bound; also rule out smaller counts when a question asks for fewest.",
    "verification": {
      "method": "Finite coin-count enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-river-return",
    "title": "Torch Returner",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 5,
    "question": "Two people take 1 and 2 minutes to cross a bridge. One torch is required and at most two cross at once. What is the minimum total time for both to get across?",
    "options": [
      "2 minutes",
      "3 minutes",
      "4 minutes",
      "5 minutes"
    ],
    "correctOption": 1,
    "hints": [
      "They can cross together.",
      "A pair moves at the slower person's speed.",
      "Send both across once; no return trip is needed."
    ],
    "explanation": "The minimum is 2 minutes. The two people cross together, and the pair travels at the slower person's speed, which is 2 minutes. Both are then on the far side with the torch, so the task is finished. Extra trips only make the total longer. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Before adding shuttles to an optimization puzzle, check whether one direct move already reaches the goal.",
    "verification": {
      "method": "Complete state-space shortest-path check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-rotation-array",
    "title": "Rotate the Line",
    "category": "Algorithms & Optimization",
    "difficulty": 2,
    "time": 4,
    "question": "Rotate the list [A, B, C, D, E] left by two positions. What is the result?",
    "options": [
      "[B, C, D, E, A]",
      "[C, D, E, A, B]",
      "[D, E, A, B, C]",
      "[E, A, B, C, D]"
    ],
    "correctOption": 1,
    "hints": [
      "A left rotation moves the first item to the end.",
      "Do that move twice.",
      "After A moves, move B as well."
    ],
    "explanation": "The result is [C, D, E, A, B]. One left rotation makes [B, C, D, E, A]. A second left rotation moves B to the end, giving [C, D, E, A, B]. The order inside the moving block does not reverse. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For rotations, simulate a small number of moves carefully; direction matters more than speed.",
    "verification": {
      "method": "Deterministic sequence transformation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-pages-binary",
    "title": "Dictionary Search",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 5,
    "question": "A sorted dictionary has 1,024 pages. You open to the middle page, then keep choosing the middle of the remaining half. At most how many opens are needed to find a page?",
    "options": [
      "8",
      "9",
      "10",
      "11"
    ],
    "correctOption": 2,
    "hints": [
      "Each middle choice halves the remaining pages.",
      "1,024 is a power of two.",
      "2 raised to 10 equals 1,024."
    ],
    "explanation": "At most 10 opens are needed. Each open gives a higher-or-lower decision and cuts the possible pages in half. Because 1,024 equals 2 to the 10th power, ten halving decisions distinguish every page. This is the same idea as binary search. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Powers of two tell you how many balanced yes-or-no decisions are needed.",
    "verification": {
      "method": "Binary decision-tree calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-graph-route",
    "title": "Shortest Route Total",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 5,
    "question": "A route from Home to Park can go Home-A (2 minutes), A-Park (5), Home-B (4), B-Park (1). Which route is quickest?",
    "options": [
      "Home-A-Park in 7 minutes",
      "Home-B-Park in 5 minutes",
      "They tie at 6 minutes",
      "There is not enough information"
    ],
    "correctOption": 1,
    "hints": [
      "Add each complete route, not individual edges only.",
      "The first route is 2 plus 5.",
      "The second route is 4 plus 1."
    ],
    "explanation": "Home-B-Park is quickest at 5 minutes. The route through A totals 2 plus 5, or 7 minutes. The route through B totals 4 plus 1, or 5 minutes. Comparing complete totals is necessary because the smallest first step is not always part of the best route. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "In route problems, compare full path costs, not just the cheapest next edge.",
    "verification": {
      "method": "Weighted-path total comparison",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-lighter-coin",
    "title": "The Lighter Coin",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 5,
    "question": "You have 8 identical-looking coins, but exactly one is fake and slightly lighter than the rest. Using a simple two-pan balance scale, which shows only left-heavier, right-heavier, or balanced, what is the minimum number of weighings needed to guarantee finding the fake coin?",
    "options": [
      "2",
      "3",
      "4",
      "8"
    ],
    "correctOption": 0,
    "hints": [
      "Each weighing has three possible results, not two, since the pans can also balance.",
      "Try splitting the coins into three groups instead of two.",
      "Weigh 3 coins against 3 coins. Whichever group is lighter, or if they balance, you narrow down to at most 3 candidates, then repeat with fewer coins."
    ],
    "explanation": "Two weighings are enough. Split the 8 coins into groups of 3, 3, and 2. Weigh the two groups of 3 against each other. If one side is lighter, the fake is among those 3 coins; if they balance, the fake is one of the remaining 2 coins. In either case, at most 3 candidates remain, and a second weighing comparing 1 coin against another identifies the fake with certainty. One weighing cannot be enough, since it can distinguish at most 3 outcomes, which is fewer than 8 possible fake-coin identities. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "A balance-scale weighing has three outcomes, not two, so the best strategy divides candidates into three roughly equal groups rather than two.",
    "verification": {
      "method": "Ternary-search lower-bound and explicit two-weighing construction",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-shortest-job-first",
    "title": "Shortest Job First",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 6,
    "question": "Three tasks take 2, 3, and 5 minutes respectively, and a single machine can run only one task at a time, one after another with no pauses. To minimize the sum of all three tasks' completion times, in which order should the tasks run, and what is that minimum total?",
    "options": [
      "2, then 3, then 5: total 17 minutes",
      "5, then 3, then 2: total 23 minutes",
      "3, then 2, then 5: total 18 minutes",
      "Any order gives the same total"
    ],
    "correctOption": 0,
    "hints": [
      "A task's completion time is the sum of its own length plus every task that ran before it.",
      "Running a short task early means every later task's completion time only grows by that short amount.",
      "Running a long task early makes it contribute its full length to every task's completion time that follows it, so try the smallest task first."
    ],
    "explanation": "Running the tasks shortest-first, in the order 2, 3, then 5 minutes, gives completion times of 2, 5, and 10 minutes, which add to 17, the smallest possible total. Every other ordering places a longer task earlier, which forces the shorter tasks that follow it to wait longer, increasing their completion times. For example, running 5 first gives completion times 5, 8, and 10, totaling 23. Trying every one of the six possible orderings confirms that shortest-first always produces the lowest total. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When minimizing the total completion time of sequential tasks, run the shortest task first so that later tasks are delayed as little as possible.",
    "verification": {
      "method": "Exhaustive comparison of all six task orderings",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "algo-wolf-goat-cabbage",
    "title": "Farmer, Wolf, Goat, and Cabbage",
    "category": "Algorithms & Optimization",
    "difficulty": 3,
    "time": 6,
    "question": "A farmer must ferry a wolf, a goat, and a cabbage across a river using a small boat that only holds the farmer plus one item at a time. If left alone together without the farmer, the wolf would eat the goat, and the goat would eat the cabbage. What is the minimum number of one-way boat crossings needed to get everything across safely?",
    "options": [
      "7",
      "5",
      "9",
      "3"
    ],
    "correctOption": 0,
    "hints": [
      "The farmer must return alone at least once, since leaving the wolf and goat, or the goat and cabbage, together is never safe.",
      "Try taking the goat across first, since it is the item both other items are unsafe with.",
      "After the first goat trip, alternate bringing dangerous pairs across and bringing the goat back to keep it separated from whichever item just crossed."
    ],
    "explanation": "Seven crossings are needed. One safe sequence is: take the goat across, return alone, take the wolf across, bring the goat back, take the cabbage across, return alone, then take the goat across again. That totals 4 forward trips and 3 return trips, or 7 crossings, and at no point are the wolf and goat, or the goat and cabbage, left alone together. No shorter sequence exists, because the goat must cross the river an odd number of times to end up safely separated from both the wolf and the cabbage at every step, which forces at least this many trips. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "In safe-transport puzzles, identify the one item involved in every danger, since it usually needs to shuttle back and forth more than the others.",
    "verification": {
      "method": "Constraint-respecting state-space search over legal crossings",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-cube-4x4-edges",
    "title": "Painted 4 by 4 Cube",
    "category": "Spatial Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "A large cube is painted on every outside face and cut into a 4 by 4 by 4 grid. How many small cubes have exactly two painted faces?",
    "options": [
      "12",
      "24",
      "32",
      "36"
    ],
    "correctOption": 1,
    "hints": [
      "Exactly two painted faces means an edge piece that is not a corner.",
      "A cube has 12 edges.",
      "Each edge has 4 small cubes; remove the two corners from each edge."
    ],
    "explanation": "There are 24 such cubes. Each of the 12 edges contains 4 small cubes. The two end cubes on every edge are corners and have three painted faces, so only 2 middle cubes per edge have exactly two painted faces. Twelve edges times two equals 24. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For painted cubes, classify pieces by corner, edge, face interior, and hidden interior.",
    "verification": {
      "method": "Three-dimensional coordinate enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-cube-centre",
    "title": "Hidden Cubes",
    "category": "Spatial Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "A 5 by 5 by 5 cube is painted outside and cut into small cubes. How many small cubes have no painted faces?",
    "options": [
      "8",
      "9",
      "27",
      "64"
    ],
    "correctOption": 2,
    "hints": [
      "Only the completely inside cube block is unpainted.",
      "Remove one painted layer from each side.",
      "The hidden block measures 3 by 3 by 3."
    ],
    "explanation": "There are 27 unpainted cubes. Painting reaches one small-cube layer inward from every outside face. Removing the outer layer from both sides of each dimension changes 5 to 3. The invisible inner block is 3 by 3 by 3, which is 27. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "To count a cube's hidden interior, subtract two from each dimension and multiply.",
    "verification": {
      "method": "Interior-coordinate enumeration",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-folding-net",
    "title": "Opposite Cube Faces",
    "category": "Spatial Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "On a standard die, opposite faces always add to 7. Which face is opposite the face showing 2?",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "correctOption": 2,
    "hints": [
      "Use the total given in the rule.",
      "Find the number that completes 2 plus blank equals 7.",
      "7 minus 2 equals 5."
    ],
    "explanation": "The opposite face is 5. Standard dice place opposite pairs so that each pair sums to 7: 1 and 6, 2 and 5, 3 and 4. Since 2 plus 5 equals 7, 5 is across from 2. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For a stated spatial convention, use the given invariant before trying to picture every rotation.",
    "verification": {
      "method": "Die-face invariant check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-turns",
    "title": "Facing North Again",
    "category": "Spatial Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "You face north, turn right, then turn right again, then turn left. Which direction do you face?",
    "options": [
      "North",
      "East",
      "South",
      "West"
    ],
    "correctOption": 1,
    "hints": [
      "Track one quarter-turn at a time.",
      "North to east is the first right turn.",
      "A second right gives south; one left returns to east."
    ],
    "explanation": "You face east. Start north. The first right turn faces east. The next right turn faces south. A left turn from south points east. Drawing a tiny compass or using your finger as an arrow keeps the turns from blending together. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For direction puzzles, update after every turn rather than trying to combine them mentally.",
    "verification": {
      "method": "Compass-state simulation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-rectangle-cut",
    "title": "Two Equal Rectangles",
    "category": "Spatial Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "A 12 cm by 8 cm rectangle is cut straight into two equal rectangles by a line parallel to the shorter side. What are the dimensions of each piece?",
    "options": [
      "6 by 8",
      "12 by 4",
      "10 by 4",
      "6 by 4"
    ],
    "correctOption": 1,
    "hints": [
      "The shorter side is 8 cm.",
      "A cut parallel to that side keeps the 8 cm side unchanged.",
      "Split the 12 cm length into two equal parts."
    ],
    "explanation": "Each piece is 6 cm by 8 cm. A line parallel to the shorter 8 cm side runs straight across that way, so the 8 cm dimension stays whole. It divides the 12 cm length into two equal 6 cm lengths. Each new rectangle has area 48 square cm, half of the original 96. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "A cut parallel to one side preserves that side's length and splits the perpendicular dimension.",
    "verification": {
      "method": "Rectangle partition geometry check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-symmetry-letter",
    "title": "Mirror Symmetry",
    "category": "Spatial Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "Which capital letter has a vertical line of symmetry in a simple block font?",
    "options": [
      "F",
      "G",
      "M",
      "R"
    ],
    "correctOption": 2,
    "hints": [
      "Imagine folding the letter down its middle.",
      "Both halves must line up exactly.",
      "The left and right sloping strokes of M mirror each other."
    ],
    "explanation": "M has vertical symmetry in a simple block font. Folding it down the center makes its left and right halves match. F, G, and R have extra strokes on only one side, so their two halves do not line up. Font styles matter, which is why the question specifies a simple block font. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For symmetry, imagine an actual fold and check whether every edge has a matching partner.",
    "verification": {
      "method": "Geometric reflection inspection",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-volume-box",
    "title": "Packing a Box",
    "category": "Spatial Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "A box is 4 cm long, 3 cm wide, and 2 cm high. What is its volume?",
    "options": [
      "9 cubic cm",
      "12 cubic cm",
      "24 cubic cm",
      "48 cubic cm"
    ],
    "correctOption": 2,
    "hints": [
      "Volume counts unit cubes filling the inside.",
      "Multiply the three perpendicular dimensions.",
      "4 times 3 times 2."
    ],
    "explanation": "The volume is 24 cubic centimetres. The base holds 4 times 3, or 12 unit cubes in one layer. The box has 2 such layers. Twelve times two is 24 unit cubes, so its volume is 24 cubic cm. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Volume of a rectangular box is length times width times height, with cubic units.",
    "verification": {
      "method": "Rectangular-prism volume calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-square-diagonal",
    "title": "Diagonal Across a Square",
    "category": "Spatial Reasoning",
    "difficulty": 4,
    "time": 6,
    "question": "A square has side length 5 cm. What is the length of its diagonal?",
    "options": [
      "5 cm",
      "5 square root of 2 cm",
      "10 cm",
      "25 cm"
    ],
    "correctOption": 1,
    "hints": [
      "The diagonal makes a right triangle with two sides of the square.",
      "Use a squared length: 5 squared plus 5 squared.",
      "The diagonal squared is 50, whose square root is 5 square root of 2."
    ],
    "explanation": "The diagonal is 5 square root of 2 cm. The diagonal and two sides form a right triangle with legs 5 and 5. By Pythagoras, diagonal squared equals 25 plus 25, or 50. The square root of 50 is the square root of 25 times 2, which is 5 square root of 2. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "A square's diagonal is its side multiplied by square root of 2.",
    "verification": {
      "method": "Pythagorean-theorem calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-clock-quarter",
    "title": "Quarter Turn Shape",
    "category": "Spatial Reasoning",
    "difficulty": 2,
    "time": 4,
    "question": "An arrow points up. After one clockwise quarter turn, which way does it point?",
    "options": [
      "Up",
      "Right",
      "Down",
      "Left"
    ],
    "correctOption": 1,
    "hints": [
      "A quarter turn is 90 degrees.",
      "Clockwise follows the direction of a clock's hands.",
      "From 12 o'clock, a clock hand moves toward 3 o'clock."
    ],
    "explanation": "It points right. An arrow pointing up is like a clock hand at 12. One clockwise quarter turn moves it to the 3 o'clock direction, which is right. A half turn would point down, and three quarter turns would point left. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Use a clock face as a quick mental model for clockwise quarter turns.",
    "verification": {
      "method": "Rotation-state simulation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-net-area",
    "title": "Surface Area of a Cube",
    "category": "Spatial Reasoning",
    "difficulty": 3,
    "time": 5,
    "question": "A cube has side length 3 cm. What is its total outside surface area?",
    "options": [
      "9 square cm",
      "18 square cm",
      "36 square cm",
      "54 square cm"
    ],
    "correctOption": 3,
    "hints": [
      "A cube has six equal square faces.",
      "One face has area 3 times 3.",
      "Multiply one face area by six."
    ],
    "explanation": "The total surface area is 54 square centimetres. One square face is 3 cm by 3 cm, so its area is 9 square cm. A cube has 6 faces. Six times 9 equals 54 square cm. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For a cube's surface area, find one face area and multiply by six.",
    "verification": {
      "method": "Cube-net area calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-ant-cylinder",
    "title": "The Ant on the Cylinder",
    "category": "Spatial Reasoning",
    "difficulty": 4,
    "time": 6,
    "question": "A cylindrical post has a circumference of 16 cm and a height of 6 cm. An ant starts at the base of the post and wants to reach a point directly opposite it, exactly halfway around the post, at the very top. Staying on the outer surface, what is the shortest distance the ant must travel?",
    "options": [
      "10 cm",
      "14 cm",
      "16 cm",
      "22 cm"
    ],
    "correctOption": 0,
    "hints": [
      "Imagine slicing the cylinder's curved surface along a straight vertical line and unrolling it flat.",
      "Once unrolled, the surface becomes a flat rectangle, and the shortest path between two points on a flat surface is a straight line.",
      "Halfway around the post is exactly half of the circumference. Use that distance and the height as the two legs of a right triangle."
    ],
    "explanation": "The shortest distance is 10 cm. Unrolling the cylinder's curved surface turns it into a flat rectangle whose width equals the full circumference, 16 cm. Because the ant's destination is halfway around, its horizontal distance across the unrolled rectangle is half of that, or 8 cm, while its vertical distance is the full height, 6 cm. On the flattened surface, the shortest path is the straight-line hypotenuse of a right triangle with legs 8 and 6, which is the square root of 8 squared plus 6 squared, or the square root of 100, giving exactly 10 cm. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "To find the shortest path across a curved surface, unroll or unfold it into a flat shape first, then apply ordinary straight-line geometry.",
    "verification": {
      "method": "Surface unfolding and Pythagorean-theorem calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-cube-27-cuts",
    "title": "Cutting a Cube into 27 Pieces",
    "category": "Spatial Reasoning",
    "difficulty": 4,
    "time": 6,
    "question": "A solid cube must be cut into 27 identical smaller cubes, as if forming a 3 by 3 by 3 grid. Each cut is a single straight pass all the way through whatever material is currently in front of the blade. Between cuts, you are allowed to rearrange and restack the pieces however you like. What is the minimum number of cuts needed?",
    "options": [
      "6",
      "3",
      "9",
      "4"
    ],
    "correctOption": 0,
    "hints": [
      "Focus on the one small cube that ends up completely hidden in the very centre of the original cube.",
      "That centre cube starts out with none of its six faces exposed to the outside, since it is fully surrounded.",
      "A single straight cut can create at most one new face on any one piece, so count how many new faces the centre cube alone requires."
    ],
    "explanation": "Six cuts are required, and rearranging pieces between cuts does not reduce this. Consider the small cube that ends up at the very centre of the original cube: all six of its faces must be newly created by cuts, since none of them touch the outside of the original block. Any single straight cut can add at most one new face to a given piece, no matter how the pieces are stacked or rearranged beforehand. Since the centre cube needs six distinct new faces, at least six separate cuts are unavoidable, and six cuts are also enough if you cut twice along each of the three axes. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When rearranging seems like it might help, check whether some single piece has a fixed requirement, like a hidden cube needing six new faces, that no amount of rearranging can reduce.",
    "verification": {
      "method": "Centre-cube face-count lower bound",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "spatial-hexagon-slice",
    "title": "Slicing a Cube into a Hexagon",
    "category": "Spatial Reasoning",
    "difficulty": 5,
    "time": 7,
    "question": "A single flat plane cuts straight through a cube, passing through the midpoints of six of its twelve edges, with the plane roughly perpendicular to one of the cube's main diagonals. What shape is the resulting cross-section?",
    "options": [
      "A regular hexagon",
      "A square",
      "An irregular pentagon",
      "A rectangle"
    ],
    "correctOption": 0,
    "hints": [
      "Count how many edges the cutting plane actually touches, and think about what polygon has that many sides.",
      "Place the cube on coordinates from (0,0,0) to (2,2,2) and consider the plane where x plus y plus z equals 3.",
      "Check the six edge-midpoints that plane passes through, and compare the distance between each pair of neighbouring midpoints."
    ],
    "explanation": "The cross-section is a regular hexagon. Using coordinates from (0,0,0) to (2,2,2), the plane x plus y plus z equals 3 passes through exactly six edge midpoints, such as (2,1,0), (1,2,0), (0,2,1), (0,1,2), (1,0,2), and (2,0,1). Measuring the straight-line distance between each pair of consecutive midpoints gives the same value, the square root of 2, for all six sides, and the angles between them all match as well, which is exactly what makes a hexagon regular rather than merely six-sided. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "To classify an unfamiliar cross-section, place the solid on coordinates, find where the cutting plane meets each edge, and measure the resulting side lengths directly.",
    "verification": {
      "method": "Coordinate-geometry distance verification of all six sides",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-next-squares",
    "title": "Square Steps",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "What comes next: 1, 4, 9, 16, 25, ...?",
    "options": [
      "30",
      "32",
      "36",
      "49"
    ],
    "correctOption": 2,
    "hints": [
      "Look at the differences: 3, 5, 7, 9.",
      "The differences are consecutive odd numbers.",
      "The next difference is 11, so add it to 25."
    ],
    "explanation": "The next number is 36. The terms are square numbers: 1 squared, 2 squared, 3 squared, 4 squared, and 5 squared. The next is 6 squared, which is 36. You can also see the added gaps rise by 2 each time: 3, 5, 7, 9, then 11. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When differences grow in a regular pattern, inspect them as their own sequence.",
    "verification": {
      "method": "Square-number identity and difference check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-digital-root",
    "title": "Repeat the Digit Sum",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "Keep adding the digits of 9876 until one digit remains. What is that final digit?",
    "options": [
      "1",
      "3",
      "6",
      "9"
    ],
    "correctOption": 1,
    "hints": [
      "Add all four digits first.",
      "9 plus 8 plus 7 plus 6 equals 30.",
      "Then add 3 plus 0."
    ],
    "explanation": "The final digit is 3. First add 9 plus 8 plus 7 plus 6, which equals 30. Because 30 has two digits, add them: 3 plus 0 equals 3. This repeated digit sum is called a digital root. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For digit-sum puzzles, write each short addition clearly so you do not skip a digit.",
    "verification": {
      "method": "Direct digit-sum computation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-fibonacci",
    "title": "Add the Previous Two",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "What comes next: 2, 3, 5, 8, 13, 21, ...?",
    "options": [
      "29",
      "31",
      "34",
      "35"
    ],
    "correctOption": 2,
    "hints": [
      "Each term may depend on more than one earlier term.",
      "Try adding the previous two numbers.",
      "13 plus 21 gives the next term."
    ],
    "explanation": "The next number is 34. Each term is made by adding the previous two: 2 plus 3 is 5, 3 plus 5 is 8, and so on. The last two shown are 13 and 21. Their sum is 34. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For a sequence, test whether each term is built from one prior term or from a pair of prior terms.",
    "verification": {
      "method": "Recurrence calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-alternating",
    "title": "Two Interwoven Sequences",
    "category": "Patterns & Numbers",
    "difficulty": 4,
    "time": 6,
    "question": "What comes next: 2, 10, 3, 20, 4, 30, 5, ...?",
    "options": [
      "6",
      "10",
      "40",
      "50"
    ],
    "correctOption": 2,
    "hints": [
      "Try reading every other term separately.",
      "Odd positions are 2, 3, 4, 5; even positions are 10, 20, 30.",
      "The next term is at an even position."
    ],
    "explanation": "The next number is 40. The sequence alternates between two smaller sequences. The odd-position terms count upward: 2, 3, 4, 5. The even-position terms are 10, 20, 30, so the next even-position term is 40. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When a sequence looks jumpy, split it into odd and even positions to look for two simple rules.",
    "verification": {
      "method": "Alternating-subsequence decomposition",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-multiples-nine",
    "title": "Nines Pattern",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "What is the sum of the digits in 9 times 47?",
    "options": [
      "9",
      "18",
      "27",
      "36"
    ],
    "correctOption": 0,
    "hints": [
      "Calculate the product first.",
      "9 times 47 equals 423.",
      "Add 4, 2, and 3."
    ],
    "explanation": "The digit sum is 9. Nine times 47 is 423. Adding its digits gives 4 plus 2 plus 3, which equals 9. This matches a useful pattern: multiples of 9 have a digit sum that is itself a multiple of 9, until reduced again. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Digit sums are a quick error check for multiplication by 9, though they are not a full proof.",
    "verification": {
      "method": "Direct multiplication and digit-sum check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-reverse-pairs",
    "title": "Reverse and Add",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "Reverse 34 to get 43, then add the two numbers. What do you get?",
    "options": [
      "66",
      "77",
      "88",
      "99"
    ],
    "correctOption": 1,
    "hints": [
      "Write the reversed number in the correct order.",
      "34 reversed is 43.",
      "Add 34 and 43."
    ],
    "explanation": "The answer is 77. Reversing 34 gives 43. Adding 34 plus 43 gives 77. This happens because the tens and ones digits trade places, so their total is placed in both the tens and ones positions when there is no carrying. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "In reverse-number puzzles, write the reversed value before adding; do not reverse only the visual shape.",
    "verification": {
      "method": "Place-value arithmetic calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-calendar-weekday",
    "title": "Seven-Day Cycle",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "If today is Tuesday, what day will it be 100 days from today?",
    "options": [
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "correctOption": 1,
    "hints": [
      "Weeks repeat every 7 days.",
      "Find the remainder when 100 is divided by 7.",
      "100 leaves a remainder of 2, so move two days forward from Tuesday."
    ],
    "explanation": "It will be Thursday. Seven-day groups do not change the weekday. One hundred divided by 7 is 14 weeks with 2 days left over. Move two days forward from Tuesday: Wednesday is one day later and Thursday is two days later. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "For repeating cycles, divide by the cycle length and use only the remainder.",
    "verification": {
      "method": "Modulo-7 calendar calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-powers-two",
    "title": "Doubling Signal",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "What comes next: 3, 6, 12, 24, 48, ...?",
    "options": [
      "51",
      "72",
      "84",
      "96"
    ],
    "correctOption": 3,
    "hints": [
      "Compare each number to the one before it.",
      "Each term is twice the previous term.",
      "Double 48."
    ],
    "explanation": "The next number is 96. Each term doubles: 3 becomes 6, 6 becomes 12, 12 becomes 24, and 24 becomes 48. Doubling 48 gives 96. The differences grow too, but multiplication is the simpler repeating rule. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Check multiplication rules before assuming a sequence is built by addition.",
    "verification": {
      "method": "Geometric-sequence calculation",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-roman-value",
    "title": "Roman Number Puzzle",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "In Roman numerals, X means 10 and IV means 4. What number is XIV?",
    "options": [
      "12",
      "14",
      "16",
      "19"
    ],
    "correctOption": 1,
    "hints": [
      "Read X and IV as separate pieces.",
      "X is 10 and IV is 4.",
      "Add the two values."
    ],
    "explanation": "XIV means 14. The X contributes 10. IV is the subtractive form for 4, because I before V means one less than five. Put them together: 10 plus 4 equals 14. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "In numeral systems, break the symbol string into known chunks before adding values.",
    "verification": {
      "method": "Roman-numeral parsing",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-one-more-square",
    "title": "Odd Number Staircase",
    "category": "Patterns & Numbers",
    "difficulty": 3,
    "time": 5,
    "question": "Starting with 1, add the next odd number each time: 1, 1+3=4, 4+5=9, 9+7=16. What is 16+9?",
    "options": [
      "20",
      "23",
      "25",
      "27"
    ],
    "correctOption": 2,
    "hints": [
      "The running totals are square numbers.",
      "1, 4, 9, and 16 are 1 squared through 4 squared.",
      "Adding the next odd number gives 5 squared."
    ],
    "explanation": "The answer is 25. The totals 1, 4, 9, and 16 are 1 squared, 2 squared, 3 squared, and 4 squared. The next odd number after 7 is 9. Adding 9 to 16 gives 25, which is 5 squared. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "Consecutive odd numbers build square numbers: 1 plus 3 plus 5 plus more creates 1 squared, 2 squared, 3 squared, and so on.",
    "verification": {
      "method": "Square-number recurrence check",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-triangular-numbers",
    "title": "Stacking Triangles",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "What comes next in this sequence: 1, 3, 6, 10, 15, ...?",
    "options": [
      "18",
      "20",
      "21",
      "24"
    ],
    "correctOption": 2,
    "hints": [
      "Look at the gap between each term and the one before it.",
      "The gaps are 2, 3, 4, and 5, increasing by exactly 1 each time.",
      "The next gap after 5 should be 6. Add that to the last term."
    ],
    "explanation": "The next number is 21. These are triangular numbers, formed by stacking rows of dots that grow by one each time: a row of 1, then 2, then 3, and so on. The gap between consecutive terms grows by exactly 1 every time: 2, 3, 4, 5, and then 6. Adding the next gap of 6 to the last term, 15, gives 21. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When a sequence's own differences form a simple, evenly increasing pattern, extend the differences first, then apply the last one to find the next term.",
    "verification": {
      "method": "Second-difference pattern extension",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-add-one-more",
    "title": "Add One More Each Time",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "What comes next in this sequence: 2, 4, 7, 11, 16, 22, ...?",
    "options": [
      "27",
      "28",
      "29",
      "30"
    ],
    "correctOption": 2,
    "hints": [
      "Compare each term to the one directly before it.",
      "The amount added grows by exactly 1 every step: 2, 3, 4, 5, 6.",
      "The next amount to add after 6 should be 7."
    ],
    "explanation": "The next number is 29. Track what is added at each step: 2 to 4 adds 2, 4 to 7 adds 3, 7 to 11 adds 4, 11 to 16 adds 5, and 16 to 22 adds 6. Each added amount is exactly one more than the previous added amount. Continuing that pattern, the next amount to add is 7, and 22 plus 7 equals 29. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "If a sequence is not built by a single fixed rule, examine the amounts being added at each step; they sometimes form their own simple pattern.",
    "verification": {
      "method": "Step-size pattern extension",
      "reviewed": true,
      "version": 2
    }
  },
  {
    "id": "pattern-double-plus-one",
    "title": "Double and Add One",
    "category": "Patterns & Numbers",
    "difficulty": 2,
    "time": 4,
    "question": "What comes next in this sequence: 1, 3, 7, 15, 31, ...?",
    "options": [
      "47",
      "62",
      "63",
      "64"
    ],
    "correctOption": 2,
    "hints": [
      "Compare each term to twice the term before it.",
      "1 doubled is 2, but the next term is 3, which is one more.",
      "Try the rule: double the previous term, then add 1."
    ],
    "explanation": "The next number is 63. Each term equals double the previous term plus 1: 1 doubles to 2, plus 1 gives 3; 3 doubles to 6, plus 1 gives 7; 7 doubles to 14, plus 1 gives 15; and 15 doubles to 30, plus 1 gives 31. Applying the same rule to 31 gives 31 doubled, which is 62, plus 1, which equals 63. Work slowly from the rule that cannot change, then check the other choices against it. That small check is what turns a clever guess into a reliable solution.",
    "takeaway": "When plain doubling almost fits a sequence but is consistently off by a small fixed amount, test doubling plus or minus that amount as the real rule.",
    "verification": {
      "method": "Recurrence-rule verification across all given terms",
      "reviewed": true,
      "version": 2
    }
  }
];
