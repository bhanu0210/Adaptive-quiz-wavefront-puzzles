type Category =
  | "Logic & Knowledge"
  | "Mathematical Reasoning"
  | "Probability & Strategy"
  | "Algorithms & Optimization"
  | "Spatial Reasoning"
  | "Patterns & Numbers";

type Puzzle = {
  id: string;
  title: string;
  category: Category;
  difficulty: number;
  time: number;
  question: string;
  options: string[];
  correctOption: number;
  hints: [string, string, string];
  explanation: string;
  takeaway: string;
  verification: { method: string; reviewed: boolean; version: number };
};

// Cycle 2 roster (published ${new Date().toISOString().slice(0,10)}). 90 puzzles total:
// 2 per category live in puzzles.json, the remaining 13 per category live here.
// Sourced from docs/puzzle-sources/*.md (families logged in USED-LOG.md) plus
// original authorship where the anthologies didn't cover a category; every
// computable answer was independently re-derived, not copied from a source's
// stated answer -- see docs/PUZZLE-ROTATION.md.
export const launchExpansion: Puzzle[] = [
  { id: "c2-logic-birthday-boy", title: "Two Days Ago I Was Ten", category: "Logic & Knowledge", difficulty: 2, time: 4,
    question: "A boy tells you: 'Two days ago I was ten years old, and next year I will turn thirteen.' Both statements are completely true. How old is the boy on the day he speaks?",
    options: ["Ten", "Eleven", "Twelve", "The statements cannot both be true"], correctOption: 1,
    hints: [
      "For both statements to hold, a birthday must fall between 'two days ago' and today, and a calendar year boundary must fall there too.",
      "Try placing his birthday on the 31st of December and the conversation on the 1st of January.",
      "Count carefully which calendar year each future birthday lands in, remembering that 'next year' means the year after the current one."
    ],
    explanation: "He is eleven. Suppose he speaks on 1 January and his birthday is 31 December. Two days earlier, on 30 December, he had not yet had that birthday, so he was ten. On 31 December he turned eleven, which is his age today. Later in the current calendar year, on 31 December, he turns twelve. Then in the following calendar year, which is 'next year', he turns thirteen. Every statement checks out, and the apparent impossibility comes from the birthday and the New Year sitting one day apart.",
    takeaway: "When a statement about time looks contradictory, look for a boundary such as a birthday or a year change sitting inside the interval described.",
    verification: { method: "Explicit calendar walk-through across a year boundary", reviewed: true, version: 1 } },
  { id: "c2-logic-barber-paradox", title: "The Village Barber", category: "Logic & Knowledge", difficulty: 2, time: 4,
    question: "A village is described as follows: the barber shaves every man in the village who does not shave himself, and shaves no man who does shave himself. Assuming the barber is a man living in that village, who shaves the barber?",
    options: ["The barber shaves himself", "Someone else in the village shaves him", "Nobody shaves him; he grows a beard", "No such barber can exist"], correctOption: 3,
    hints: [
      "Test both possibilities for the barber himself and see whether either survives the rule.",
      "If he shaves himself, then by the rule he is someone the barber does not shave, which is a contradiction.",
      "If he does not shave himself, then by the rule the barber must shave him, which is also a contradiction."
    ],
    explanation: "No such barber can exist. Suppose he shaves himself. The rule says the barber shaves no man who shaves himself, so the barber does not shave him, contradicting the assumption. Now suppose he does not shave himself. The rule says the barber shaves every man who does not shave himself, so the barber does shave him, again contradicting the assumption. Both cases fail, so the village as described cannot exist. The right response is to reject the premise, not to hunt for a third shaver.",
    takeaway: "When every possible answer to a question leads to a contradiction, the correct move is to reject the question's premise rather than invent a new option.",
    verification: { method: "Exhaustive two-case contradiction on a self-referential definition", reviewed: true, version: 1 } },
  { id: "c2-logic-counterfeit-circle", title: "The Note That Went Around", category: "Logic & Knowledge", difficulty: 3, time: 5,
    question: "You find a 100-rupee note on the street. You pay your plumber with it, who pays his milkman, who pays his tailor, who buys a sewing machine from a neighbour, who uses it to repay a 100-rupee loan she owed you. You then discover the note was counterfeit all along. Counting the whole chain, how much real value was destroyed?",
    options: ["Nothing; every person ends up exactly where they started", "100 rupees, borne by the plumber", "100 rupees, borne by you", "500 rupees, one hundred lost by each of five people"], correctOption: 0,
    hints: [
      "Track each person separately: what real goods or services did they give away, and what real debt did the note discharge for them?",
      "Everyone in the middle of the chain both received the note and spent it, so their two sides cancel.",
      "You received 100 rupees of plumbing for a note that cost you nothing, but your genuine 100-rupee loan was repaid with worthless paper; those two cancel too."
    ],
    explanation: "Nothing real was destroyed in this particular closed loop. The plumber gave a service worth 100 but used the note to clear a 100-rupee debt to his milkman, so he broke even. The milkman, tailor, and neighbour are all in the same position: each received the note as payment and passed it on as payment. You found the note for free and got 100 rupees of plumbing from it, but the note came back as repayment of a genuine 100-rupee loan, so you lost exactly what you gained. Because the note travelled in a complete circle and returned to the person who introduced it, every gain is matched by a loss on the same ledger.",
    takeaway: "In a chain of transactions, track each participant's own gains and losses separately rather than assuming the loss lands wherever the fraud is discovered.",
    verification: { method: "Per-participant ledger accounting around a closed transaction loop", reviewed: true, version: 1 } },
  { id: "c2-logic-sabbath-day", title: "Three Sabbaths, One Day", category: "Logic & Knowledge", difficulty: 3, time: 5,
    question: "A Christian keeps the first day of the week as his Sabbath, a Jew keeps the seventh, and a Turk keeps the sixth. All three are devout and none will change his rule. How can all three genuinely keep their own true Sabbath on the very same calendar day, in the same place?",
    options: ["One of them must be mistaken about his own calendar", "Two of them travel around the world in opposite directions before meeting", "They wait for a leap year, when the weekdays realign", "It is impossible under any circumstances"], correctOption: 1,
    hints: [
      "Nobody is allowed to change which day of their own week they observe, so the answer cannot involve bending a religious rule.",
      "A traveller who circles the globe eastward counts one day more than a stationary observer; westward, one day fewer.",
      "If one man arrives having gained a day and another having lost one, their personal day counts can be two apart while they stand together."
    ],
    explanation: "Two of the three circumnavigate the globe in opposite directions before meeting. A traveller going continuously eastward crosses the sun's daily path once more than someone standing still, so his personal count of elapsed days runs one ahead. A traveller going west runs one behind. When all three meet in one place, their private day counts differ by up to two, so the day the first calls the seventh, the second calls the sixth, and the third calls the first. Each keeps his own rule honestly; the calendar date they share is simply labelled differently in each man's own reckoning.",
    takeaway: "A shared moment in time can carry different day labels for different observers, which resolves apparent scheduling contradictions without anyone breaking a rule.",
    verification: { method: "Date-line day-count reasoning across opposite circumnavigations", reviewed: true, version: 1 } },
  { id: "c2-logic-one-equals-two", title: "Where the Proof Breaks", category: "Logic & Knowledge", difficulty: 3, time: 5,
    question: "Here is a 'proof' that 1 equals 2. Start with a = b. Step 1: multiply both sides by a to get ab = a². Step 2: subtract b² to get ab − b² = a² − b². Step 3: factor both sides to get b(a − b) = (a + b)(a − b). Step 4: cancel (a − b) from both sides to get b = a + b. Step 5: substitute a = b to get b = 2b, so 1 = 2. Which step is invalid?",
    options: ["Step 1", "Step 3", "Step 4", "Step 5"], correctOption: 2,
    hints: [
      "Check each step against what it actually requires to be legal, not just whether the algebra looks tidy.",
      "Cancelling a factor from both sides of an equation is really dividing both sides by that factor.",
      "Use the very first assumption, a = b, to work out the numerical value of the factor being cancelled."
    ],
    explanation: "Step 4 is invalid. Cancelling (a − b) from both sides means dividing both sides by (a − b). But the proof opened by assuming a = b, which makes a − b exactly zero, and division by zero is undefined. Every other step is legitimate: multiplying both sides by a, subtracting b², and factoring are all valid operations on any numbers. The error is well hidden because the offending quantity is written as a symbolic expression rather than as the zero it actually equals.",
    takeaway: "Before cancelling a factor from both sides of an equation, substitute the given conditions to check that the factor is not secretly zero.",
    verification: { method: "Step-by-step validity audit with substitution of the stated premise", reviewed: true, version: 1 } },
  { id: "c2-logic-knights-three", title: "Three Islanders", category: "Logic & Knowledge", difficulty: 3, time: 6,
    question: "On an island every inhabitant is either a knight, who always tells the truth, or a knave, who always lies. You meet three islanders. Ana says, 'Exactly one of us three is a knight.' Bo says, 'Ana is a knave.' Cai says, 'Ana and Bo are both knaves.' How many knights are among the three?",
    options: ["Zero", "One", "Two", "Three"], correctOption: 1,
    hints: [
      "Each islander's type must match the truth of their own sentence: a knight's sentence is true, a knave's sentence is false.",
      "Bo and Ana directly contradict each other, so exactly one of those two is a knight; test both branches.",
      "In the branch where Ana is a knave, work out who the knights actually are and then check whether Ana's sentence really came out false."
    ],
    explanation: "There is exactly one knight, and it is Ana. Suppose Ana is a knight. Her sentence, that exactly one of the three is a knight, must then be true, so Bo and Cai are both knaves. Check them: Bo says Ana is a knave, which is false, exactly what a knave should say. Cai says Ana and Bo are both knaves, which is also false since Ana is a knight. Everything fits. Now suppose instead Ana is a knave. Then Bo's claim that Ana is a knave is true, so Bo is a knight, and Cai's claim that both Ana and Bo are knaves is false, so Cai is a knave. That leaves Bo as the only knight, which makes Ana's sentence about exactly one knight true, and a knave cannot say something true. This branch collapses, so the first arrangement is the only consistent one.",
    takeaway: "Test a knight-and-knave arrangement by checking every sentence against it, including the sentence of the person you assumed was lying, since that is usually where a false branch collapses.",
    verification: { method: "Exhaustive enumeration of all eight knight-knave assignments", reviewed: true, version: 1 } },
  { id: "c2-logic-passcode-hallway", title: "The Passcode and the Hallway", category: "Logic & Knowledge", difficulty: 4, time: 7,
    question: "A three-number passcode uses positive whole numbers written in non-decreasing order. Clue one: the three numbers multiply to 36. Clue two: their sum equals the number of the hallway you entered from, which you can see but we cannot. Clue three, which you only had to ask for because clues one and two together were not enough: the largest of the three numbers appears exactly once. What is the passcode?",
    options: ["1, 6, 6", "2, 2, 9", "1, 4, 9", "3, 3, 4"], correctOption: 1,
    hints: [
      "List every non-decreasing triple of positive whole numbers whose product is 36, and write down each triple's sum.",
      "The fact that a third clue was needed is itself information: it means the sum you could see did not single out one triple.",
      "Find the only sum shared by two different triples, then use the third clue to break the tie between them."
    ],
    explanation: "The passcode is 2, 2, 9. The triples multiplying to 36 are 1-1-36 (sum 38), 1-2-18 (21), 1-3-12 (16), 1-4-9 (14), 1-6-6 (13), 2-2-9 (13), 2-3-6 (11), and 3-3-4 (10). If the hallway number had been any sum other than 13, it would have identified a unique triple and no third clue would have been necessary. Since a third clue was needed, the sum must be 13, which is shared by 1-6-6 and 2-2-9. The third clue says the largest number appears exactly once. In 1-6-6 the largest value, 6, is repeated, so that triple is eliminated, leaving 2-2-9.",
    takeaway: "The fact that someone needed more information is itself a clue, because it rules out every case that would already have been decisive.",
    verification: { method: "Full enumeration of factor triples of 36 filtered by sum ambiguity and uniqueness of the maximum", reviewed: true, version: 1 } },
  { id: "c2-logic-temple-liars", title: "The Unanimous Trio", category: "Logic & Knowledge", difficulty: 4, time: 7,
    question: "You send eight students down four unknown corridors, split as one pair and two trios. You know that exactly two of the eight students have been cursed and may say anything, true or false, while the other six always report honestly. One trio returns and all three members give exactly the same report. What can you conclude about that report?",
    options: ["It is definitely true", "It is definitely false", "It is true only if the pair also agrees with it", "Nothing; two liars could have swayed it"], correctOption: 0,
    hints: [
      "Count the maximum number of unreliable students that could possibly be inside a single group of three.",
      "Since only two students are cursed in total, a trio must contain at least one honest reporter.",
      "Ask what would have to happen for a unanimous trio to be wrong, given that at least one member always tells the truth."
    ],
    explanation: "The report is definitely true. Only two students in the whole group are cursed, so a trio of three must contain at least one honest reporter, who by definition states the truth. Because all three members gave identical reports, the honest member's truthful statement is the report itself. It does not matter whether the other two are honest or cursed, and it does not matter what the cursed students would have said in isolation, because unanimity forces their stated answer to match the honest one. Had a cursed student lied, the trio would have disagreed rather than been unanimous.",
    takeaway: "When unreliable members are outnumbered inside a group, unanimity from that group is proof, because at least one member could not have said anything but the truth.",
    verification: { method: "Pigeonhole bound on liars per group combined with unanimity constraint", reviewed: true, version: 1 } },
  { id: "c2-logic-bigamist-trains", title: "The Uneven Coin Flip", category: "Logic & Knowledge", difficulty: 4, time: 7,
    question: "A man works at a station midway between two lines. Trains on the northern line arrive every ten minutes, and trains on the southern line also arrive every ten minutes. He always boards whichever train arrives first after he reaches the platform, and he reaches the platform at a completely random time each evening. Over a year he ends up taking the northern train about nine times out of ten. What explains this?",
    options: ["The northern trains are more frequent than stated", "The two timetables are offset so the northern train arrives shortly before the southern one", "He unconsciously times his arrival to catch the northern train", "The northern trains travel faster, so they arrive first"], correctOption: 1,
    hints: [
      "Both lines genuinely run every ten minutes, so frequency is not the explanation; look at where inside the ten-minute cycle each train falls.",
      "Draw one ten-minute cycle as a line and mark the arrival instants of the two trains on it.",
      "The train he catches is whichever comes next, so work out how much of the ten-minute cycle sits immediately before each train."
    ],
    explanation: "The timetables are offset. Suppose the northern train arrives at 1:00, 1:10, 1:20 and so on, while the southern train arrives one minute later at 1:01, 1:11, 1:21. If he reaches the platform at any moment in the nine minutes between a southern arrival and the next northern arrival, the northern train is next. Only in the single minute between a northern arrival and the following southern arrival does he catch the southern train. Since his arrival time is uniformly random across the cycle, he takes the northern train nine minutes out of every ten. Equal frequency does not mean equal share, because what matters is the size of the waiting window that leads to each train.",
    takeaway: "Equal frequency does not imply equal probability; what decides a first-come outcome is the length of the interval preceding each event, not how often it occurs.",
    verification: { method: "Uniform-arrival interval analysis over one repeating timetable cycle", reviewed: true, version: 1 } },
  { id: "c2-logic-unexpected-hanging", title: "The Unexpected Inspection", category: "Logic & Knowledge", difficulty: 4, time: 8,
    question: "A teacher announces: 'There will be a surprise inspection one weekday next week, and on the morning of the inspection you will not know it is coming.' A student argues it cannot happen: it cannot be Friday, since by Thursday evening only Friday would remain and it would not be a surprise; so it cannot be Thursday either by the same reasoning; and so on back to Monday. The inspection nevertheless happens on Wednesday and genuinely surprises everyone. Where does the student's argument actually fail?",
    options: ["The elimination of Friday is itself invalid", "The argument silently assumes the announcement is still trustworthy at every step, even after concluding it cannot be kept", "The teacher lied, so the announcement carried no information", "The argument fails only because a week has five days rather than seven"], correctOption: 1,
    hints: [
      "Look carefully at what the student must assume to be true in order to eliminate each day in turn.",
      "Each elimination step relies on the announcement being reliable, yet the argument's own conclusion is that the announcement cannot be fulfilled.",
      "Ask whether a student who has convinced himself no inspection can occur would in fact be surprised by one."
    ],
    explanation: "The argument fails because it uses the announcement's reliability to derive that the announcement cannot be kept, and then keeps using that reliability anyway. Each backward step assumes the students will still be reasoning from a trustworthy announcement when that day arrives. But once the student concludes no inspection can occur, he has abandoned belief in the announcement, and a student in that state is precisely someone who can be surprised on any day. The self-undermining nature of the reasoning is the flaw: the conclusion destroys the premise the argument needed at every earlier step. The Friday elimination taken alone is sound, which is what makes the chain so persuasive.",
    takeaway: "An argument is unsound if its conclusion removes the very assumption each of its steps depended on, even when every individual step looks valid.",
    verification: { method: "Premise-dependency audit of the backward induction chain", reviewed: true, version: 1 } },
  { id: "c2-logic-green-eyes", title: "One Hundred Green-Eyed Logicians", category: "Logic & Knowledge", difficulty: 5, time: 12,
    question: "One hundred perfect logicians are held on an island. Each can see everyone else's eye colour but never their own, there are no reflections, and no communication of any kind is allowed. Any prisoner who correctly deduces their own eye colour may ask to leave that night. All one hundred have green eyes, but none knows it. A visitor announces publicly, 'At least one of you has green eyes' — something every prisoner could already see. On which night do they leave?",
    options: ["Nobody ever leaves, since no new information was given", "The first night", "The ninety-ninth night", "The hundredth night"], correctOption: 3,
    hints: [
      "Work out the small cases first: what happens if there were only one green-eyed prisoner, then only two, then only three?",
      "With two prisoners, each sees one green-eyed person and stays put on night one; the fact that the other also stayed is itself the clue on night two.",
      "Each additional prisoner adds exactly one more night of shared waiting, so extend the pattern from n prisoners to one hundred."
    ],
    explanation: "All one hundred leave on the hundredth night. With one green-eyed prisoner, the announcement tells them immediately and they leave on night one. With two, each sees one green-eyed person, so neither leaves on night one; each then reasons that if their own eyes were not green the other would have seen nobody and left on night one, so both leave on night two. The pattern continues: with n green-eyed prisoners, all leave on night n. The announcement mattered not because it told anyone something new, but because it made the fact common knowledge, meaning everyone knows that everyone knows that everyone knows it, without limit. That shared certainty is what starts the countdown.",
    takeaway: "Knowing a fact is different from that fact being common knowledge, and only common knowledge can start a chain of mutual deductions.",
    verification: { method: "Induction on the number of green-eyed prisoners, verified from the base cases upward", reviewed: true, version: 1 } },
  { id: "c2-logic-zebra-fish", title: "Who Owns the Fish?", category: "Logic & Knowledge", difficulty: 5, time: 15,
    question: "Five houses in a row have different colours, and their owners have different nationalities, drinks, cigar brands, and pets. Clues: the Brit lives in the red house; the Swede keeps dogs; the Dane drinks tea; the green house is immediately left of the white house; the green house owner drinks coffee; the Pall Mall smoker keeps birds; the yellow house owner smokes Dunhill; the man in the centre house drinks milk; the Norwegian lives in the first house; the Blends smoker lives next to the cat owner; the horse owner lives next to the Dunhill smoker; the BlueMaster smoker drinks root beer; the German smokes Prince; the Norwegian lives next to the blue house; the Blends smoker has a neighbour who drinks water. Who owns the fish?",
    options: ["The Brit", "The Swede", "The German", "The Dane"], correctOption: 2,
    hints: [
      "Start with the two clues that fix an absolute position: the Norwegian is in house one and milk is drunk in house three.",
      "Use the green-immediately-left-of-white constraint together with the blue house next to the Norwegian to pin down every house colour.",
      "Once colours, nationalities, and drinks are fixed, the cigar clues force the pets, and the fish is whatever remains."
    ],
    explanation: "The German owns the fish. The Norwegian is in house one and milk is in house three. Since the Norwegian is next to the blue house, house two is blue. Green must be immediately left of white, and green's owner drinks coffee, so green cannot be house three, which drinks milk; that forces green into house four and white into house five. House one cannot be red because the Brit lives in the red house and house one is Norwegian, so house one is yellow and house three is red with the Brit. Yellow means house one smokes Dunhill, so the horse is in house two. House one cannot drink tea, milk, coffee, or root beer, so it drinks water, which places the Blends smoker in house two, the only neighbour. House two therefore drinks tea and is the Dane, leaving root beer and BlueMaster for house five. The German smokes Prince, which must be house four, leaving Pall Mall for house three and the Swede for house five. Pall Mall means birds in house three, the Swede has the dog in house five, the cat sits next to Blends in house one, and the only pet left, the fish, belongs to the German in house four.",
    takeaway: "In a large constraint grid, always spend your first moves on the clues that fix absolute positions, since every relative clue becomes far cheaper to apply afterwards.",
    verification: { method: "Full constraint propagation across all fifteen clues with uniqueness confirmed by elimination", reviewed: true, version: 1 } },
  { id: "c2-logic-control-room", title: "The Control Room Floor", category: "Logic & Knowledge", difficulty: 5, time: 10,
    question: "A pyramid has one room on its top floor, two rooms on the second floor, three on the third, and so on downward. The control panel sits on the highest floor where every room has exactly three doors leading to other rooms on that same floor, except the control room itself, which has exactly one. Doors only connect rooms on the same floor. Which floor from the top holds the control panel?",
    options: ["The second floor", "The fourth floor", "The sixth floor", "The eighth floor"], correctOption: 2,
    hints: [
      "Count doors twice: every door touches exactly two rooms, so the total of all rooms' door counts must be an even number.",
      "On a floor with N rooms, that total is three times (N minus one), plus one for the control room, which is 3N minus 2.",
      "Parity rules out every odd floor, so check the even floors in order from the top and try to actually draw a valid layout for each."
    ],
    explanation: "The sixth floor. Every door joins exactly two rooms, so adding up all the rooms' door counts must give an even number. On a floor of N rooms that total is 3(N − 1) + 1, which equals 3N − 2, and this is even only when N is even. That eliminates every odd floor immediately. The second floor fails because its single non-control room would need three doors but has only one other room to connect to. The fourth floor also fails: the control room uses up its one door, and the three remaining rooms cannot each reach three doors using only each other. The sixth floor works: connect the control room to one room, let that room also join two others, and wire the remaining four rooms so every one of the five non-control rooms ends with exactly three doors. Since it is the first even floor that admits a valid layout, it is the highest one that satisfies the rules.",
    takeaway: "A counting argument such as the handshake rule can eliminate most candidates instantly, but you still need an explicit construction to confirm the survivors are genuinely possible.",
    verification: { method: "Handshake-lemma parity elimination plus explicit graph construction on six vertices", reviewed: true, version: 1 } },
  { id: "c2-math-sari-blouse", title: "The Sari and the Blouse", category: "Mathematical Reasoning", difficulty: 2, time: 4,
    question: "A sari and a blouse together cost 110 rupees. The sari costs 100 rupees more than the blouse. How much does the blouse cost?",
    options: ["5 rupees", "10 rupees", "55 rupees", "100 rupees"], correctOption: 0,
    hints: [
      "Resist the instinct to answer 10; check that answer against the second condition before accepting it.",
      "If the blouse costs b, the sari costs b + 100, and the two together must total 110.",
      "That gives the equation 2b + 100 = 110, so solve it for b rather than guessing."
    ],
    explanation: "The blouse costs 5 rupees. Letting the blouse cost b, the sari costs b + 100, and together they come to b + (b + 100) = 110, so 2b = 10 and b = 5. The sari therefore costs 105. Checking the difference, 105 − 5 = 100, exactly as stated. Almost everyone first answers 10 rupees, but that would make the sari 100 and the difference only 90, not 100. The mistake comes from subtracting the 100 once instead of splitting the remaining 10 between both items.",
    takeaway: "When a total and a difference are both given, the smaller item is half of the total minus the difference, not simply the total minus the difference.",
    verification: { method: "Two-equation linear system solved and verified against both stated conditions", reviewed: true, version: 1 } },
  { id: "c2-math-pigs-ducks", title: "Sixty Eyes, Eighty-Six Feet", category: "Mathematical Reasoning", difficulty: 2, time: 4,
    question: "A farmer keeps only pigs and ducks. Between them all, there are 60 eyes and 86 feet. How many pigs does he have?",
    options: ["13", "17", "20", "24"], correctOption: 0,
    hints: [
      "Every animal, pig or duck, has exactly two eyes, so the eye count tells you the total number of animals.",
      "Sixty eyes means thirty animals in total.",
      "Pigs have four feet and ducks have two, so write 4p + 2d = 86 alongside p + d = 30."
    ],
    explanation: "There are 13 pigs. Since every animal has two eyes, 60 eyes means 30 animals altogether. Writing p for pigs and d for ducks gives p + d = 30 and 4p + 2d = 86. Doubling the first equation gives 2p + 2d = 60, and subtracting it from the second leaves 2p = 26, so p = 13 and therefore d = 17. Checking: 13 pigs contribute 52 feet and 17 ducks contribute 34 feet, totalling 86, while all 30 animals contribute 60 eyes.",
    takeaway: "When one measurement is identical across every item, use it first to fix the total count, which reduces the remaining problem to a single equation.",
    verification: { method: "Two-equation linear system verified by substituting the solution back into both counts", reviewed: true, version: 1 } },
  { id: "c2-math-broken-necklace", title: "Lilavati's Broken Necklace", category: "Mathematical Reasoning", difficulty: 2, time: 4,
    question: "A pearl necklace breaks. One third of the pearls fall to the ground, one fifth stay on the couch, one sixth are found by the girl, and one tenth are recovered by her lover. Six pearls remain on the string. How many pearls were on the necklace?",
    options: ["24", "30", "36", "60"], correctOption: 1,
    hints: [
      "Let the total be x and write every scattered group as a fraction of x, then add the six that stayed.",
      "The four fractions plus six pearls must reconstruct the whole necklace.",
      "Put the fractions over a common denominator of 30 and see what fraction of the necklace the six remaining pearls represent."
    ],
    explanation: "The necklace had 30 pearls. Writing the total as x gives x/3 + x/5 + x/6 + x/10 + 6 = x. Over a common denominator of 30, the four fractions become 10/30 + 6/30 + 5/30 + 3/30, which is 24/30, or four fifths of the necklace. So the six remaining pearls are the missing one fifth, which makes the whole necklace 30 pearls. Checking: 10 fell, 6 stayed on the couch, 5 were found by the girl, 3 by her lover, and 6 remained, totalling exactly 30.",
    takeaway: "When several fractions of a whole are listed, add them first and let the leftover amount tell you the size of the remaining fraction.",
    verification: { method: "Fraction summation over a common denominator with a full parts-total reconciliation", reviewed: true, version: 1 } },
  { id: "c2-math-golden-gate-average", title: "There and Back Again", category: "Mathematical Reasoning", difficulty: 3, time: 5,
    question: "You drive across a bridge at 40 miles per hour and return along the identical route at 25 miles per hour. What is your average speed for the whole round trip?",
    options: ["32.5 miles per hour", "30 and 10/13 miles per hour", "33 and 1/3 miles per hour", "31.5 miles per hour"], correctOption: 1,
    hints: [
      "Average speed is always total distance divided by total time, never the average of the two speeds.",
      "Call the one-way distance D; the outward leg takes D/40 hours and the return leg takes D/25 hours.",
      "Total distance is 2D and total time is 13D/200, so divide one by the other and watch D cancel."
    ],
    explanation: "The average speed is 400/13, which is 30 and 10/13 miles per hour. Calling the one-way distance D, the outward trip takes D/40 hours and the return takes D/25 hours, giving a total time of 5D/200 + 8D/200 = 13D/200. The total distance is 2D, so the average speed is 2D ÷ (13D/200) = 400/13. The tempting answer of 32.5 is simply the average of 40 and 25, which would only be correct if equal time were spent at each speed. In reality more time is spent at the slower speed, which drags the true average below the midpoint.",
    takeaway: "Averaging rates that apply over equal distances requires the harmonic mean, which always lands below the plain arithmetic average.",
    verification: { method: "Total-distance over total-time computation with exact fractional arithmetic", reviewed: true, version: 1 } },
  { id: "c2-math-charities-backwards", title: "Three Donations Home", category: "Mathematical Reasoning", difficulty: 3, time: 5,
    question: "Walking home you give one group half your money plus one rupee more. To the next group you give half of what remains plus two rupees more. To a third group you give half of what is then left plus three rupees more. You arrive home with exactly one rupee. How much did you start with?",
    options: ["26 rupees", "34 rupees", "42 rupees", "50 rupees"], correctOption: 2,
    hints: [
      "Working forwards means guessing; work backwards from the one rupee you ended with instead.",
      "To undo a step of 'give away half, then give away k more', first add k back, then double.",
      "Undo the three steps in reverse order using k values of 3, then 2, then 1."
    ],
    explanation: "You started with 42 rupees. Work backwards from the final one rupee. Before the temple gift, add back the 3 and double: (1 + 3) × 2 = 8. Before the orphanage gift, add back the 2 and double: (8 + 2) × 2 = 20. Before the first gift, add back the 1 and double: (20 + 1) × 2 = 42. Checking forwards: from 42 you give 21 + 1 = 22, leaving 20; then 10 + 2 = 12, leaving 8; then 4 + 3 = 7, leaving 1, exactly as described.",
    takeaway: "When each step halves an unknown amount, run the process backwards, since inverting a halving is a doubling and removes all guesswork.",
    verification: { method: "Reverse iteration of each halving step, confirmed by a forward re-simulation", reviewed: true, version: 1 } },
  { id: "c2-math-lilavati-chain", title: "The Beaming-Eyed Maiden", category: "Mathematical Reasoning", difficulty: 4, time: 8,
    question: "Take a number. Multiply it by 3, then increase the result by three quarters of itself, then divide by 7, then reduce the result by one third of itself, then multiply the result by itself, then subtract 52, then take the square root, then add 8, then divide by 10. The final answer is 2. What was the original number?",
    options: ["21", "24", "28", "32"], correctOption: 2,
    hints: [
      "Start at the final answer of 2 and undo each instruction in reverse order.",
      "Undoing 'divide by 10' is multiplying by 10; undoing 'take the square root' is squaring.",
      "Two steps need algebra rather than a single operation: undoing 'reduce by one third of itself' means multiplying by 3/2, and undoing 'increase by three quarters of itself' means multiplying by 4/7."
    ],
    explanation: "The original number is 28. Working backwards from 2: multiply by 10 to get 20, subtract 8 to get 12, square it to get 144, add 52 to get 196, take the square root to get 14. Now undo the reduction by one third: if a quantity reduced by a third of itself gives 14, then two thirds of it is 14, so it was 21. Multiply by 7 to undo the division, giving 147. Undo the increase by three quarters: if a quantity increased by three quarters of itself gives 147, then seven quarters of it is 147, so it was 84. Finally divide by 3 to get 28. Running the whole chain forward from 28 reproduces 2 exactly.",
    takeaway: "Inverting a proportional step such as 'increase by three quarters of itself' means dividing by the resulting multiplier, not simply subtracting that fraction back.",
    verification: { method: "Step-by-step inverse computation with a full forward re-verification from the recovered value", reviewed: true, version: 1 } },
  { id: "c2-math-demochares-age", title: "The Age of Demochares", category: "Mathematical Reasoning", difficulty: 4, time: 6,
    question: "Demochares has lived one quarter of his life as a boy, one fifth as a youth, and one third as a man, and has spent the last thirteen years in old age. How old is he?",
    options: ["48", "60", "72", "84"], correctOption: 1,
    hints: [
      "Add the three fractional stages together and see how much of his life they account for.",
      "Use a common denominator of 60 for one quarter, one fifth, and one third.",
      "The remaining fraction of his life corresponds exactly to the thirteen years of old age."
    ],
    explanation: "Demochares is 60. Over a common denominator of 60, his boyhood is 15/60 of his life, his youth is 12/60, and his manhood is 20/60. Together those account for 47/60, leaving 13/60 for old age. Since old age lasted thirteen years, 13/60 of his life equals 13 years, so each sixtieth of his life is one year and his full life is 60 years. Checking: 15 years as a boy, 12 as a youth, 20 as a man, and 13 in old age adds to exactly 60.",
    takeaway: "When fractional stages leave a remainder that is given in absolute units, the remainder fraction converts directly into the size of the whole.",
    verification: { method: "Common-denominator fraction summation with the residual matched to the stated absolute figure", reviewed: true, version: 1 } },
  { id: "c2-math-escalator-steps", title: "Down the Moving Escalator", category: "Mathematical Reasoning", difficulty: 4, time: 8,
    question: "Walking down a moving escalator, if you take 26 steps yourself you reach the bottom in 30 seconds. If you hurry and take 34 steps you reach the bottom in only 18 seconds. Timing runs from the moment you step on to the moment you step off. How many steps does the escalator have in total?",
    options: ["40", "46", "52", "58"], correctOption: 1,
    hints: [
      "The escalator carries you down some steps for free while you walk down the rest yourself.",
      "If the escalator has N steps and you walk 26 of them, it must have supplied N − 26 steps during those 30 seconds.",
      "Set the escalator's step rate from each trip equal to each other: (N − 26)/30 must equal (N − 34)/18."
    ],
    explanation: "The escalator has 46 steps. Let N be the total and let the escalator move at a constant rate. On the slow trip you contributed 26 steps, so the escalator supplied N − 26 steps over 30 seconds. On the fast trip you contributed 34 steps, so it supplied N − 34 over 18 seconds. Since the escalator's speed is the same both times, (N − 26)/30 = (N − 34)/18. Cross-multiplying gives 18N − 468 = 30N − 1020, so 12N = 552 and N = 46. Checking: the escalator supplied 20 steps in 30 seconds and 12 steps in 18 seconds, both a rate of two thirds of a step per second.",
    takeaway: "When you and a moving surface both contribute to the same journey, set the surface's rate from two different trips equal to each other to eliminate the unknown total.",
    verification: { method: "Rate-equality equation across two trips with the resulting escalator speed verified as consistent", reviewed: true, version: 1 } },
  { id: "c2-math-cats-mice", title: "The Cats and the Mice", category: "Mathematical Reasoning", difficulty: 4, time: 8,
    question: "A number of cats together killed exactly 999,919 mice, and every cat killed the same number of mice. There was more than one cat, each cat killed more than one mouse, and each cat killed more mice than there were cats in total. How many cats were there?",
    options: ["991", "1009", "1111", "9091"], correctOption: 0,
    hints: [
      "The number of cats must divide 999,919 exactly, so start by factoring that number.",
      "999,919 factors into exactly two primes, which means there is only one way to split it into a cat count and a per-cat count.",
      "Of the two factors, the cat count must be the smaller one, since each cat killed more mice than there were cats."
    ],
    explanation: "There were 991 cats. The number 999,919 factors as 991 × 1009, and both of those are prime, so the only way to write it as a number of cats times mice per cat, with both greater than one, is 991 and 1009 in some order. The extra condition says each cat killed more mice than there were cats, so the cat count must be the smaller factor. That gives 991 cats, each killing 1009 mice. Checking: 991 × 1009 = 991,000 + 8,919 = 999,919, exactly as required.",
    takeaway: "When a total must split into equal groups, factor it first; if the factorisation is into two primes, the extra conditions only have to choose between two arrangements.",
    verification: { method: "Prime factorisation of 999,919 with the ordering fixed by the stated inequality", reviewed: true, version: 1 } },
  { id: "c2-math-lease-years", title: "The Arithmetical Landlady", category: "Mathematical Reasoning", difficulty: 4, time: 7,
    question: "A lease was originally granted for 99 years. Today, two thirds of the time that has already elapsed equals four fifths of the time still to come. How many years of the lease remain?",
    options: ["36", "45", "54", "60"], correctOption: 1,
    hints: [
      "Let the remaining years be f, so the elapsed years are 99 − f.",
      "Write the stated relationship as two thirds of (99 − f) equals four fifths of f.",
      "Clear the fractions by multiplying through by 15, then solve the resulting linear equation."
    ],
    explanation: "45 years remain. Let f be the years still to come, so 99 − f years have already passed. The condition says (2/3)(99 − f) = (4/5)f. Multiplying both sides by 15 gives 10(99 − f) = 12f, so 990 − 10f = 12f and 22f = 990, giving f = 45. That means 54 years have elapsed. Checking: two thirds of 54 is 36, and four fifths of 45 is also 36, so the two quantities match exactly and the elapsed and remaining years add back to 99.",
    takeaway: "Setting up a single unknown for one part of a fixed total lets you express the other part immediately, turning a wordy condition into one linear equation.",
    verification: { method: "Single-variable linear equation with both stated fractions recomputed as a check", reviewed: true, version: 1 } },
  { id: "c2-math-horse-cow-sheep", title: "Three Animals, One Pasture", category: "Mathematical Reasoning", difficulty: 5, time: 10,
    question: "A horse and a cow grazing together clear a pasture in 40 days. The horse and a sheep together clear it in 60 days. The cow and the sheep together clear it in 90 days. How long would all three grazing together take to clear the same pasture?",
    options: ["30 days", "37 and 17/19 days", "42 and 1/2 days", "63 and 1/3 days"], correctOption: 1,
    hints: [
      "Convert each pairing into a rate: the fraction of the pasture that pair clears in one day.",
      "Adding all three pair rates counts every animal exactly twice, so it equals twice the combined rate of all three.",
      "Find the total of 1/40, 1/60, and 1/90, halve it to get the three-animal rate, then take the reciprocal."
    ],
    explanation: "All three together take 720/19 days, which is 37 and 17/19 days. Write h, c, and s for the fractions of pasture each animal clears per day. Then h + c = 1/40, h + s = 1/60, and c + s = 1/90. Adding all three equations gives 2(h + c + s) = 1/40 + 1/60 + 1/90. Over a common denominator of 360 that is 9/360 + 6/360 + 4/360 = 19/360. Halving gives h + c + s = 19/720, so the three animals together clear 19/720 of the pasture per day and need 720/19 days to finish. That is a little under 38 days, sensibly faster than any pair on its own.",
    takeaway: "Adding every pairwise rate counts each participant twice, so halving that total gives the combined rate without ever solving for the individuals.",
    verification: { method: "Pairwise rate summation with exact fractional arithmetic and a reciprocal conversion back to days", reviewed: true, version: 1 } },
  { id: "c2-math-two-trains-ratio", title: "After They Pass", category: "Mathematical Reasoning", difficulty: 5, time: 9,
    question: "Two trains set off at the same moment, one from each of two cities, travelling towards each other at constant speeds. After they pass one another, the first train reaches its destination 1 hour later, and the second reaches its destination 4 hours later. How many times faster is the first train than the second?",
    options: ["Twice as fast", "Four times as fast", "One and a half times as fast", "Sixteen times as fast"], correctOption: 0,
    hints: [
      "After passing, each train still has to cover the distance the other train has already travelled.",
      "If the trains meet after time t, then train one covers train two's earlier distance in 1 hour and vice versa in 4 hours.",
      "This gives v1 × 1 = v2 × t and v2 × 4 = v1 × t; multiply the two equations together and watch the unknown t cancel."
    ],
    explanation: "The first train is exactly twice as fast. Let the trains meet after time t, with speeds v1 and v2. Before meeting, train two covered distance v2 × t, and train one covers that same remaining stretch in 1 hour, so v1 × 1 = v2 × t. Likewise train one covered v1 × t before meeting, and train two covers that in 4 hours, so v2 × 4 = v1 × t. Multiplying the two equations gives 4 × v1 × v2 = v1 × v2 × t², so t² = 4 and t = 2 hours. Substituting back, v1 = 2 × v2. The speed ratio is the square root of the ratio of the two post-meeting times, which is the square root of 4, or 2.",
    takeaway: "For two objects meeting head-on, the speed ratio equals the square root of the inverse ratio of their remaining travel times, not the ratio itself.",
    verification: { method: "Simultaneous distance equations with the meeting time eliminated by multiplication", reviewed: true, version: 1 } },
  { id: "c2-math-mango-thieves", title: "The Mango Thieves", category: "Mathematical Reasoning", difficulty: 5, time: 10,
    question: "Three boys steal a basket of fewer than 100 mangoes and fall asleep. In the night the first wakes, eats one mango, hides exactly one third of what remains, and sleeps again. The second then wakes, eats one, hides exactly one third of what remains, and sleeps. The third does the same. In the morning the pile left over is exactly one more than a number divisible by three. How many mangoes were stolen?",
    options: ["52", "67", "79", "94"], correctOption: 2,
    hints: [
      "After each thief eats one mango, the remainder must be exactly divisible by three for him to hide a third of it.",
      "That divisibility condition has to hold three separate times, which eliminates almost every starting number.",
      "Test candidates under 100 by simulating all three nightly raids, then check the morning remainder leaves a remainder of one when divided by three."
    ],
    explanation: "They stole 79 mangoes. Starting with 79, the first thief eats one leaving 78, which divides by three, so he hides 26 and leaves 52. The second eats one leaving 51, which divides by three, so he hides 17 and leaves 34. The third eats one leaving 33, which divides by three, so he hides 11 and leaves 22. In the morning 22 remain, and since 22 is 3 × 7 + 1, the pile is exactly one more than a multiple of three, as stated. Testing every number below 100 confirms 79 is the only starting count for which all three divisibility conditions and the morning remainder all hold.",
    takeaway: "When a process repeats a divisibility requirement several times, each repetition slices the candidate set down sharply, so a short exhaustive search beats clever algebra.",
    verification: { method: "Exhaustive simulation of all starting counts below 100 against every stated divisibility condition", reviewed: true, version: 1 } },
  { id: "c2-prob-die-even-prime", title: "Even and Prime", category: "Probability & Strategy", difficulty: 2, time: 4,
    question: "A fair six-sided die is rolled once. What is the probability that the number showing is both even and prime?",
    options: ["0", "1/6", "1/3", "1/2"], correctOption: 1,
    hints: [
      "List the even faces and the prime faces separately, then look for overlap.",
      "The even faces are 2, 4, and 6; the prime faces are 2, 3, and 5.",
      "Only one number appears on both lists, and it is the smallest prime."
    ],
    explanation: "The probability is 1/6. The even faces are 2, 4, and 6, while the prime faces are 2, 3, and 5. The only face on both lists is 2, since 2 is the only even prime number: every other even number is divisible by 2 and therefore has a factor besides one and itself. With exactly one favourable face out of six equally likely faces, the probability is 1/6. Answering 0 is a common slip from assuming primes must be odd.",
    takeaway: "When two conditions must hold at once, list each set separately and take the overlap rather than combining the probabilities.",
    verification: { method: "Set intersection over the six equally likely die faces", reviewed: true, version: 1 } },
  { id: "c2-prob-three-dice-sixes", title: "Three Sixes at Once", category: "Probability & Strategy", difficulty: 2, time: 4,
    question: "Three fair six-sided dice are rolled together. What is the probability that all three show a six?",
    options: ["1/18", "1/36", "1/108", "1/216"], correctOption: 3,
    hints: [
      "The three dice are independent, so multiply their individual probabilities.",
      "Each die shows a six with probability 1/6.",
      "Multiply one sixth by itself three times."
    ],
    explanation: "The probability is 1/216. Each die independently shows a six with probability 1/6, and because the dice do not influence each other, the chance that all three do so is 1/6 × 1/6 × 1/6 = 1/216. Another way to see it is to count outcomes directly: three dice produce 6 × 6 × 6 = 216 equally likely results, and exactly one of them is triple six. The wrong answer of 1/18 comes from adding the probabilities instead of multiplying.",
    takeaway: "Independent events combine by multiplication, and multiplying probabilities always makes the result smaller, never larger.",
    verification: { method: "Independent-event multiplication cross-checked against a 216-outcome enumeration", reviewed: true, version: 1 } },
  { id: "c2-prob-at-least-one-six", title: "At Least One Six", category: "Probability & Strategy", difficulty: 3, time: 5,
    question: "Two fair six-sided dice are rolled. What is the probability that at least one of them shows a six?",
    options: ["1/6", "1/3", "11/36", "1/2"], correctOption: 2,
    hints: [
      "Counting the successful cases directly risks double-counting the roll where both dice show a six.",
      "It is easier to compute the probability of the opposite event: neither die shows a six.",
      "Each die avoids a six with probability 5/6, so subtract the resulting product from 1."
    ],
    explanation: "The probability is 11/36. Computing it directly is error-prone, because the six rolls where the first die is a six and the six rolls where the second die is a six overlap in the double-six roll, so a naive count of 6 + 6 = 12 double-counts one outcome. The clean method is to find the opposite: neither die shows a six with probability 5/6 × 5/6 = 25/36. Subtracting from 1 gives 11/36. Checking by direct count, 5 + 5 + 1 = 11 favourable outcomes out of 36, which matches.",
    takeaway: "For 'at least one' questions, compute the probability of none and subtract from one, which sidesteps double-counting overlapping cases.",
    verification: { method: "Complement rule verified against a direct enumeration of the 36 ordered outcomes", reviewed: true, version: 1 } },
  { id: "c2-prob-four-flips-two-heads", title: "Exactly Two of Four", category: "Probability & Strategy", difficulty: 3, time: 5,
    question: "A fair coin is flipped four times. What is the probability of getting exactly two heads?",
    options: ["1/4", "3/8", "1/2", "5/8"], correctOption: 1,
    hints: [
      "Four flips produce sixteen equally likely sequences in total.",
      "Count how many of those sequences contain exactly two heads and two tails.",
      "The sequences are HHTT, HTHT, HTTH, THHT, THTH, and TTHH."
    ],
    explanation: "The probability is 3/8. Four flips give 2 × 2 × 2 × 2 = 16 equally likely sequences. The sequences with exactly two heads are HHTT, HTHT, HTTH, THHT, THTH, and TTHH, which is six of them. So the probability is 6/16, which reduces to 3/8. Note that exactly two heads is the single most likely outcome, yet it still happens less than half the time, because the other possibilities such as one head or three heads together outweigh it.",
    takeaway: "The most likely individual outcome of repeated trials is often still a minority outcome, so count sequences rather than reasoning from what feels typical.",
    verification: { method: "Full enumeration of all sixteen four-flip sequences", reviewed: true, version: 1 } },
  { id: "c2-prob-birthday-23", title: "Twenty-Three in a Room", category: "Probability & Strategy", difficulty: 3, time: 6,
    question: "Twenty-three people are in a room, and birthdays are spread evenly across 365 days with no leap years. What is the approximate probability that at least two of them share a birthday?",
    options: ["About 6 percent", "About 23 percent", "About 50 percent", "About 99 percent"], correctOption: 2,
    hints: [
      "Count the pairs of people, not the people: twenty-three people form 253 different pairs.",
      "Compute the probability that all twenty-three birthdays are different, then subtract from one.",
      "Multiply 365/365 by 364/365 by 363/365 and so on down to 343/365, then take one minus the result."
    ],
    explanation: "The probability is about 50 percent, slightly over half. Work out the chance that all twenty-three birthdays are different: the first person can have any birthday, the second must avoid one day (364/365), the third must avoid two (363/365), and so on down to 343/365 for the twenty-third. Multiplying all those factors gives roughly 0.493, so the chance of at least one shared birthday is about 0.507. The result feels impossible because people instinctively compare themselves against the other twenty-two, but the question is about any pair matching, and twenty-three people form 253 pairs.",
    takeaway: "When a question asks whether any pair in a group matches, count pairs rather than individuals, since pair counts grow roughly with the square of group size.",
    verification: { method: "Complement of the all-distinct product computed exactly and confirmed to exceed one half", reviewed: true, version: 1 } },
  { id: "c2-prob-monty-hundred", title: "A Hundred Doors", category: "Probability & Strategy", difficulty: 3, time: 6,
    question: "There are 100 doors, one hiding a prize. You pick one door. A host who knows exactly where the prize is then opens 98 of the other doors, all empty, leaving your door and one other closed. He offers you the chance to switch. What is your probability of winning if you switch?",
    options: ["1/100", "1/2", "99/100", "It makes no difference"], correctOption: 2,
    hints: [
      "Your original pick was made when you had no information at all, so its chance is fixed at that moment.",
      "The host never opens the prize door, so his choices carry information rather than being random.",
      "All the probability that was spread across the other ninety-nine doors has to end up somewhere."
    ],
    explanation: "Switching wins with probability 99/100. Your original door was chosen blind, so it had a 1 in 100 chance of hiding the prize and nothing that happened afterwards changes that. The remaining 99 doors together held a 99 in 100 chance. Because the host knows where the prize is and deliberately opens only empty doors, he never reveals the prize, so that entire 99 in 100 chance collapses onto the single door he chose to leave closed. The hundred-door version makes the effect obvious in a way the three-door version does not: the host effectively told you where the prize is, unless your first blind guess happened to be right.",
    takeaway: "When someone with full knowledge deliberately eliminates only losing options, the surviving option inherits all of the probability they removed.",
    verification: { method: "Conditional probability over prize locations, exploiting the host's constrained choice rule", reviewed: true, version: 1 } },
  { id: "c2-prob-bertrand-boxes", title: "The Three Boxes", category: "Probability & Strategy", difficulty: 4, time: 7,
    question: "Three boxes each contain two coins. One holds two gold coins, one holds two silver coins, and one holds one of each. You pick a box at random and draw one coin at random from it, and it turns out to be gold. What is the probability that the other coin in that same box is also gold?",
    options: ["1/2", "2/3", "1/3", "3/4"], correctOption: 1,
    hints: [
      "Think in terms of individual coins rather than boxes, since each box gives you two different ways to draw a coin.",
      "There are three gold coins in total across all the boxes, and each is equally likely to be the one you drew.",
      "Of those three gold coins, count how many have a gold partner in the same box."
    ],
    explanation: "The probability is 2/3. Label the gold coins: the two-gold box holds G1 and G2, and the mixed box holds G3. Since you chose a box at random and then a coin at random, every one of the six coins was equally likely, so given that you drew gold, each of G1, G2, and G3 is equally likely to be the coin in your hand. If you drew G1 or G2, the other coin in that box is gold. Only if you drew G3 is the partner silver. That makes two favourable cases out of three. The intuitive answer of 1/2 wrongly treats the two boxes as equally likely, ignoring that the two-gold box gave you twice as many chances to draw a gold coin in the first place.",
    takeaway: "Condition on the individual outcome you actually observed, not on the container it came from, because containers offering more chances of that outcome are more likely to be the source.",
    verification: { method: "Conditional probability over six equally likely coin draws", reviewed: true, version: 1 } },
  { id: "c2-prob-prisoner-hats", title: "Ten Hats in a Line", category: "Probability & Strategy", difficulty: 4, time: 8,
    question: "Ten prisoners stand in a line, each able to see only the hats of everyone in front of them. Each wears a black or white hat assigned at random. Starting from the back, each must call out a guess of their own hat colour, and everyone hears every guess. They may agree a strategy beforehand. Using the best possible strategy, how many are guaranteed to guess correctly?",
    options: ["Five", "Nine", "Ten", "Only one, the rest are guessing"], correctOption: 1,
    hints: [
      "The person at the back can see everything but has nobody behind them, so their own guess cannot be informed.",
      "Let the back person sacrifice their own accuracy to broadcast a single piece of information about everyone else's hats.",
      "Have the back person call out a colour that encodes whether the number of black hats they can see is odd or even."
    ],
    explanation: "Nine are guaranteed correct, and the tenth has a fifty percent chance. The prisoner at the back counts the black hats in front of them and calls 'black' if that count is odd and 'white' if it is even. This tells nobody their own colour, but it fixes the parity of black hats among the front nine. The ninth prisoner counts the black hats they can see; comparing that count's parity to the announced parity reveals their own hat exactly. Every prisoner after that tracks the guesses already called out, updates the expected parity accordingly, compares it to what they can still see, and deduces their own hat with certainty. Only the back prisoner is genuinely guessing.",
    takeaway: "One person can broadcast a single bit of shared structure, such as odd or even, that lets everyone else deduce their own unknown with certainty.",
    verification: { method: "Parity-encoding strategy verified by tracing the deduction chain down the line", reviewed: true, version: 1 } },
  { id: "c2-prob-heads-i-win", title: "Betting Half Your Pocket", category: "Probability & Strategy", difficulty: 4, time: 7,
    question: "A gambler repeatedly bets exactly half the money currently in his pocket on a coin toss. Winning doubles the stake, so his pocket grows by half; losing forfeits the stake, so his pocket shrinks by half. After a long session he has won exactly as many tosses as he has lost. Where does he stand?",
    options: ["Exactly even, since wins and losses balanced", "Ahead, because wins add more than losses take", "Behind, and further behind the longer he played", "It depends on the order of the wins and losses"], correctOption: 2,
    hints: [
      "Track his money as a multiplier rather than as an amount added or subtracted.",
      "A win multiplies his pocket by 3/2, and a loss multiplies it by 1/2.",
      "Work out the combined effect of one win paired with one loss, and check whether it is above or below 1."
    ],
    explanation: "He ends up behind, and the gap widens with every matched pair of tosses. A win multiplies his pocket by 3/2 and a loss multiplies it by 1/2. One win paired with one loss multiplies his money by 3/2 × 1/2 = 3/4, a loss of a quarter of everything he had, and the order does not matter because multiplication commutes. After n wins and n losses he holds (3/4) raised to the power n of his starting money, which shrinks steadily towards zero. The trap is that the amounts feel symmetric, but a win adds half of a smaller pot while a loss removes half of a larger one.",
    takeaway: "When each outcome scales your total rather than adding a fixed amount, combine the outcomes by multiplying, since equal counts of proportional gains and losses do not cancel.",
    verification: { method: "Multiplicative factor analysis over paired win-loss outcomes", reviewed: true, version: 1 } },
  { id: "c2-prob-false-positive", title: "The Positive Test Result", category: "Probability & Strategy", difficulty: 5, time: 9,
    question: "A disease affects 1 percent of a population. A test correctly identifies 99 percent of people who have the disease, and correctly clears 99 percent of people who do not. Someone tests positive. What is the probability they actually have the disease?",
    options: ["About 99 percent", "About 50 percent", "About 90 percent", "About 1 percent"], correctOption: 1,
    hints: [
      "Imagine a concrete population of 10,000 people rather than working with percentages directly.",
      "Of 10,000 people, 100 have the disease and 9,900 do not; work out how many of each group test positive.",
      "Compare the number of true positives against the number of false positives, which come from a much larger group."
    ],
    explanation: "The probability is about 50 percent. Take 10,000 people. Of these, 100 have the disease and the test catches 99 of them. The other 9,900 are healthy, and the test wrongly flags 1 percent of them, which is 99 people. So 198 people test positive in total, and only 99 of those genuinely have the disease, giving exactly 1/2. The result is startling because a 99 percent accurate test sounds nearly conclusive, but the healthy group is 99 times larger, so even its small error rate produces as many false alarms as there are true cases.",
    takeaway: "A test's accuracy alone never tells you what a positive result means; the base rate of the condition matters just as much, and a rare condition produces many false positives.",
    verification: { method: "Natural-frequency computation over a concrete population of 10,000", reviewed: true, version: 1 } },
  { id: "c2-prob-three-prisoners", title: "The Warden's Answer", category: "Probability & Strategy", difficulty: 5, time: 9,
    question: "Three prisoners, A, B, and C, await sentencing; exactly one will be pardoned, chosen uniformly at random. Prisoner A asks the warden to name one of the other two who will definitely be executed. The warden, who knows the outcome and picks at random between B and C when both are doomed, replies 'B will be executed.' What is A's probability of being pardoned now?",
    options: ["1/2, since only A and C remain", "1/3, unchanged", "2/3, since B is eliminated", "1/4"], correctOption: 1,
    hints: [
      "The warden was always going to be able to name a doomed prisoner, whichever of the three is pardoned.",
      "Because the answer was guaranteed to exist, hearing it cannot tell A anything about A's own fate.",
      "Work out where B's original one third of probability goes: it must move to C, not be split evenly."
    ],
    explanation: "A's probability stays at 1/3. The key point is that the warden could always name a doomed prisoner no matter who was pardoned, so receiving such a name was certain in advance and therefore carries no information about A. Formally, if A is pardoned, the warden names B with probability 1/2. If B is pardoned, the warden must name C. If C is pardoned, the warden must name B. So hearing 'B' happens with probability 1/6 from A being pardoned and 1/3 from C being pardoned, giving A a conditional probability of (1/6) divided by (1/6 + 1/3), which is 1/3. B's original third transfers entirely to C, who now stands at 2/3.",
    takeaway: "Information only updates a probability if the answer received was not guaranteed in advance; a certain answer changes nothing about the asker.",
    verification: { method: "Bayesian conditioning on the warden's stated tie-breaking rule", reviewed: true, version: 1 } },
  { id: "c2-prob-hat-derangement", title: "Nobody Gets Their Own", category: "Probability & Strategy", difficulty: 5, time: 10,
    question: "Four people leave their hats at a cloakroom, and the attendant returns the four hats in a completely random order. What is the probability that not a single person receives their own hat?",
    options: ["1/24", "3/8", "1/4", "1/2"], correctOption: 1,
    hints: [
      "There are 4 factorial, or 24, equally likely ways to hand back four hats.",
      "Count the arrangements where nobody gets their own hat; these are called derangements.",
      "Use the pattern that the number of derangements of n items equals (n − 1) times the sum of the derangement counts for n − 1 and n − 2."
    ],
    explanation: "The probability is 3/8. There are 24 equally likely ways to return four hats. The arrangements where nobody gets their own hat are the derangements, and for four items there are exactly nine of them. You can count these with the rule that the derangement count for n items equals (n − 1) times the sum of the counts for n − 1 and n − 2: starting from 1 derangement of zero items and 0 of one item, the counts run 1, 0, 1, 2, 9. So the probability is 9/24, which reduces to 3/8. As the number of people grows this probability settles quickly near 0.368, which is one divided by the mathematical constant e.",
    takeaway: "For 'nobody gets a match' problems, count derangements rather than subtracting the obvious cases, since overlapping matches make direct subtraction unreliable.",
    verification: { method: "Derangement recurrence for four items over the full 24-permutation sample space", reviewed: true, version: 1 } },
  { id: "c2-prob-secretary-stop", title: "When to Stop Looking", category: "Probability & Strategy", difficulty: 5, time: 10,
    question: "You must hire exactly one candidate from a large pool. Candidates arrive one at a time in random order, you can rank each against all those seen so far, and you must accept or reject immediately with no recalls. The best strategy is to reject a fixed opening fraction of candidates, then hire the first one who beats everybody seen so far. With a large pool, what is your probability of hiring the very best candidate?",
    options: ["About 5 percent", "About 25 percent", "About 37 percent", "About 50 percent"], correctOption: 2,
    hints: [
      "Rejecting too few candidates means you settle early on someone mediocre; rejecting too many means the best one probably already passed.",
      "The optimal cut-off point turns out to be the same fraction as the eventual success probability.",
      "That fraction is one divided by the mathematical constant e, which is roughly 2.718."
    ],
    explanation: "The probability is about 37 percent. The optimal strategy rejects the first 1/e of the candidates, roughly 37 percent of them, purely to establish a benchmark, then hires the first candidate afterwards who is better than everyone seen so far. Rejecting a smaller opening sample makes you likely to settle on someone merely good; rejecting a larger one makes it likely the best candidate was already in the discarded batch. Balancing these two failure modes puts both the optimal cut-off and the resulting success rate at 1/e, about 0.368. What makes this striking is that the success rate does not fade as the pool grows: even with a thousand candidates, this rule finds the single best one more than a third of the time.",
    takeaway: "In irreversible sequential choices, spend an opening portion purely gathering information, then commit to the first option that beats everything observed.",
    verification: { method: "Standard optimal-stopping result with the 1/e threshold and success rate", reviewed: true, version: 1 } },
  { id: "c2-algo-tennis-matches", title: "Thirty Players, One Winner", category: "Algorithms & Optimization", difficulty: 2, time: 4,
    question: "Thirty players enter a singles knockout tournament where a player is eliminated the moment they lose a match. Byes are allowed wherever the bracket needs them. How many matches must be played in total to determine the champion?",
    options: ["15", "29", "30", "31"], correctOption: 1,
    hints: [
      "Instead of building the bracket, count the eliminations required.",
      "Every match eliminates exactly one player, no more and no less.",
      "To leave one champion standing, twenty-nine players must be eliminated."
    ],
    explanation: "Exactly 29 matches are needed. Each match eliminates precisely one player, so the total number of matches always equals the number of players eliminated. To crown a single champion out of thirty entrants, twenty-nine players must lose exactly once, requiring twenty-nine matches. This holds regardless of how the bracket is arranged or how many byes are handed out, which is why you never need to draw the tournament tree to answer it. The same reasoning gives n − 1 matches for any n players.",
    takeaway: "Counting what each step destroys is often far simpler than simulating the structure that produces it.",
    verification: { method: "Elimination-invariant argument valid for any bracket arrangement", reviewed: true, version: 1 } },
  { id: "c2-algo-cigarette-butts", title: "Six Butts to One", category: "Algorithms & Optimization", difficulty: 2, time: 4,
    question: "A full cigarette can be rolled from six discarded butts. Starting with 36 butts, and collecting the butt left behind by every cigarette you smoke, how many cigarettes can you smoke in total?",
    options: ["6", "7", "8", "9"], correctOption: 1,
    hints: [
      "Do not stop after the first round; smoking those cigarettes creates new butts.",
      "36 butts make 6 cigarettes, and smoking those 6 leaves 6 fresh butts.",
      "Those 6 new butts are exactly enough to roll one more cigarette."
    ],
    explanation: "You can smoke 7 cigarettes. The 36 starting butts roll into 6 cigarettes. Smoking those six leaves six new butts, which is exactly enough to roll a seventh cigarette. Smoking the seventh leaves just one butt, far short of the six needed for another, so the process stops there. The total is 6 + 1 = 7. The common answer of 6 forgets that the butts from the first batch are themselves raw material.",
    takeaway: "When a process regenerates part of its own input, keep iterating until the leftover falls below the threshold rather than stopping after the first pass.",
    verification: { method: "Iterative resource simulation until the remainder falls below the conversion threshold", reviewed: true, version: 1 } },
  { id: "c2-algo-necklace-links", title: "Five Sections, One Necklace", category: "Algorithms & Optimization", difficulty: 3, time: 6,
    question: "You have five separate sections of chain, each made of four links, and you want them joined into a single closed necklace. A goldsmith charges one rupee to cut open a link and one rupee to solder it shut again. What is the cheapest possible total cost?",
    options: ["5 rupees", "8 rupees", "10 rupees", "16 rupees"], correctOption: 1,
    hints: [
      "The obvious approach opens one link in each of five sections, but you can do better by sacrificing a whole section.",
      "Consider completely dismantling one section into its four separate links.",
      "Four loose links are exactly enough connectors to join the remaining four sections into a closed loop."
    ],
    explanation: "The cheapest cost is 8 rupees. The obvious method opens one link on each of five sections and closes them again, costing five cuts and five solders for 10 rupees. The better method is to completely dismantle a single section, cutting all four of its links open. That leaves four loose links and four intact sections. Each loose link is then used to join two sections together, and closing the loop of four sections requires exactly four joins. The total is four cuts and four solders, or 8 rupees. The insight is that sacrificing one whole section turns it into free connectors.",
    takeaway: "Sometimes the cheapest route destroys one unit entirely to supply the connectors that every other unit needs, rather than modifying each unit a little.",
    verification: { method: "Comparison of the naive per-section strategy against full dismantling, with join counts verified for a closed loop", reviewed: true, version: 1 } },
  { id: "c2-algo-hanoi-three", title: "Three Discs to Move", category: "Algorithms & Optimization", difficulty: 3, time: 6,
    question: "Three discs of different sizes are stacked largest to smallest on the first of three pegs. You may move one disc at a time to any peg, but never place a larger disc on top of a smaller one. What is the minimum number of moves to rebuild the whole stack on another peg?",
    options: ["5", "6", "7", "9"], correctOption: 2,
    hints: [
      "To move the bottom disc, every disc above it must first be stacked out of the way on the spare peg.",
      "Moving the top two discs to the spare peg takes three moves, then the largest disc moves once.",
      "Then the two-disc stack must be rebuilt on top of it, taking three more moves."
    ],
    explanation: "Seven moves are needed. To free the largest disc you must first move the top two discs onto the spare peg, which takes three moves. Moving the largest disc to the target peg takes one more, bringing the total to four. Then the two-disc stack must be rebuilt on top of it, taking another three moves, for seven in total. The pattern generalises neatly: moving n discs takes 2 to the power n, minus 1, moves, since each extra disc roughly doubles the work by requiring the whole stack above it to be relocated twice.",
    takeaway: "A problem that must solve a smaller copy of itself twice grows exponentially, doubling with each added element.",
    verification: { method: "Recursive move-count derivation confirmed against the 2^n − 1 closed form", reviewed: true, version: 1 } },
  { id: "c2-algo-burning-ropes", title: "Forty-Five Minutes of Rope", category: "Algorithms & Optimization", difficulty: 3, time: 6,
    question: "You have two ropes and a lighter. Each rope burns away completely in exactly 60 minutes, but neither burns at a uniform rate, so half a rope does not mean half an hour. How do you measure exactly 45 minutes?",
    options: ["Burn one rope from both ends, then the other rope from both ends", "Burn the first rope from both ends and the second from one end at the same time, then light the second rope's other end when the first is gone", "Cut one rope in half and burn both halves together", "It cannot be done with uneven burn rates"], correctOption: 1,
    hints: [
      "Lighting a rope at both ends makes the two flames meet after exactly half the total burn time, no matter how uneven the rope is.",
      "Start the second rope burning from one end at the same moment, so it is partly consumed when the first rope finishes.",
      "When the first rope is gone, the second rope has exactly 30 minutes of burn left in it; lighting its other end halves that remaining time."
    ],
    explanation: "Light the first rope at both ends and the second rope at one end, all at the same moment. The first rope's two flames consume it in exactly 30 minutes, because however unevenly it burns, the two flames together cover the whole rope and meet when half the total burn time has passed. At that 30-minute mark, the second rope has exactly 30 minutes of burning left in it. Now light the second rope's other end as well: two flames consume that remaining 30 minutes' worth in 15 minutes. Total elapsed time is 30 + 15 = 45 minutes. Cutting a rope in half does not work, because uneven burning means half the length is not half the time.",
    takeaway: "When a quantity burns unevenly, lighting both ends reliably halves the remaining time even though you cannot predict any individual portion.",
    verification: { method: "Two-flame burn-time halving argument applied twice with explicit timing", reviewed: true, version: 1 } },
  { id: "c2-algo-bridge-four", title: "Four Across the Bridge", category: "Algorithms & Optimization", difficulty: 4, time: 7,
    question: "Four people must cross a dark bridge that holds at most two at a time, and anyone crossing must carry the single torch. Their individual crossing times are 1, 2, 5, and 10 minutes; a pair moves at the slower person's pace, and the torch must be walked back each time. What is the minimum total time for all four to get across?",
    options: ["17 minutes", "19 minutes", "21 minutes", "23 minutes"], correctOption: 0,
    hints: [
      "The obvious strategy has the fastest person escort everyone, but that makes the slowest crossing happen alone with a fast partner wasted.",
      "Try sending the two slowest people across together, so their large times overlap and you pay for them only once.",
      "First get the two fastest people across so one of them is waiting on the far side to bring the torch back after the slow pair crosses."
    ],
    explanation: "The minimum is 17 minutes. Send the 1 and 2 across together, taking 2 minutes. The 1 returns with the torch, taking 1 minute, for 3 so far. Now send the 5 and 10 across together, taking 10 minutes, for 13 so far. The 2, already waiting on the far side, returns with the torch in 2 minutes, for 15. Finally the 1 and 2 cross together in 2 minutes, reaching 17. The key move is pairing the two slowest walkers so the 5 and 10 overlap and you only pay 10 once. The obvious strategy of having the fastest person escort each of the others individually costs 19 minutes, because the 5 and 10 are then paid separately.",
    takeaway: "When a group moves at its slowest member's pace, pair the slow members together so their costs overlap instead of accumulating.",
    verification: { method: "Exhaustive comparison of the two candidate optimal strategies over the full crossing schedule", reviewed: true, version: 1 } },
  { id: "c2-algo-river-lions", title: "Lions and Wildebeest", category: "Algorithms & Optimization", difficulty: 4, time: 8,
    question: "Three lions and three wildebeest must cross a river on a raft that carries at most two animals, and at least one animal must be aboard to row it back. If lions ever outnumber wildebeest on either bank, counting animals currently on the raft at that bank, the wildebeest are eaten. What is the minimum number of one-way crossings to get all six across safely?",
    options: ["7", "9", "11", "13"], correctOption: 2,
    hints: [
      "Track the count on both banks after every single crossing, including the moment the raft is unloading.",
      "The danger is never about totals, only about lions outnumbering wildebeest on one side.",
      "Moving animals in matched pairs, or moving lions in twos while keeping the wildebeest grouped, keeps every intermediate state legal."
    ],
    explanation: "Eleven crossings are needed. One valid sequence sends a lion and a wildebeest over, returns the wildebeest, sends two lions over, returns one lion, sends two wildebeest over, returns a lion and a wildebeest together, sends two wildebeest over, returns a lion, sends two lions over, returns a lion, and finally sends the last two lions over. At no point do lions outnumber wildebeest on either bank. Fewer crossings are impossible because every return trip undoes progress, and the safety constraint forces enough returns that the total cannot drop below eleven. This is the classic missionaries-and-cannibals structure, where the binding constraint is not capacity but the requirement that no intermediate state be unsafe.",
    takeaway: "In constrained transport puzzles, the limiting factor is usually the illegal intermediate states rather than the vehicle's capacity.",
    verification: { method: "State-space search over legal bank configurations with the shortest safe path confirmed", reviewed: true, version: 1 } },
  { id: "c2-algo-weights-balance", title: "Weighing One to a Hundred", category: "Algorithms & Optimization", difficulty: 4, time: 7,
    question: "A merchant must weigh out any whole number of pounds from 1 to 121 using a two-pan balance. He may place weights in either pan, including alongside the goods being weighed. What is the smallest number of weights he needs?",
    options: ["Four", "Five", "Seven", "Eleven"], correctOption: 1,
    hints: [
      "Because weights may go in either pan, each weight can effectively count as added, subtracted, or unused.",
      "Three possible roles per weight means n weights can express 3 to the power n distinct combinations.",
      "Try the powers of three: 1, 3, 9, 27, and 81."
    ],
    explanation: "Five weights suffice: 1, 3, 9, 27, and 81 pounds. Because a weight may sit with the goods rather than opposite them, each weight can be added, subtracted, or left out, giving three roles instead of two. With five weights that yields 3 to the power 5, or 243 combinations, which cover every whole value from minus 121 through plus 121, and the positive half is exactly 1 to 121. For example, 5 pounds is weighed as 9 minus 3 minus 1, and 121 is simply 81 + 27 + 9 + 3 + 1. Four weights could reach at most 3 to the power 4, or 81 combinations, covering only up to 40 pounds, so five is genuinely the minimum.",
    takeaway: "Allowing an item to be subtracted as well as added turns a base-two problem into a base-three one, covering far more values with the same count.",
    verification: { method: "Balanced-ternary construction with a counting lower bound ruling out four weights", reviewed: true, version: 1 } },
  { id: "c2-algo-faulty-machine", title: "Finding the Faulty Machine", category: "Algorithms & Optimization", difficulty: 4, time: 7,
    question: "Ten machines each stamp out parts that should weigh exactly 100 grams. One machine has drifted and produces parts that are all 1 gram too heavy. Using an accurate digital scale that reports an exact total weight, how can you identify the faulty machine in a single weighing?",
    options: ["Weigh one part from each machine together", "Weigh one part from machine 1, two from machine 2, and so on up to ten from machine 10, all together", "Weigh five machines' parts against the other five", "It cannot be done in fewer than four weighings"], correctOption: 1,
    hints: [
      "Weighing one part from each machine only tells you that something is wrong, not which machine caused it.",
      "Give each machine a different, identifiable contribution to the total excess weight.",
      "If you take n parts from machine n, the total excess in grams equals the number of the faulty machine."
    ],
    explanation: "Take one part from machine 1, two from machine 2, three from machine 3, and so on up to ten parts from machine 10, then weigh all 55 parts together in one go. If every machine were correct, the total would be 55 × 100 = 5,500 grams. Each faulty part adds exactly 1 gram, and you included exactly n parts from machine n, so the excess above 5,500 grams is precisely the number of the faulty machine. An excess of 7 grams means machine 7 is the culprit. Taking one part from each machine fails because every machine would then contribute the same excess, making them indistinguishable.",
    takeaway: "Give each candidate a distinct weight in a single aggregated measurement, and the measurement's deviation directly encodes which candidate is responsible.",
    verification: { method: "Distinct-coefficient encoding with the excess mapped uniquely to each machine index", reviewed: true, version: 1 } },
  { id: "c2-algo-load-share", title: "Three Porters, Two Crates", category: "Algorithms & Optimization", difficulty: 4, time: 7,
    question: "Two crates must be carried three miles. Three porters are available, but only one person can carry a crate at a time, and the crates must never be set down and abandoned. If the three porters share the work so that each carries a crate for exactly the same distance, how far does each porter carry?",
    options: ["1 mile", "1.5 miles", "2 miles", "3 miles"], correctOption: 2,
    hints: [
      "Work out the total amount of carrying that must happen, measured in crate-miles.",
      "Two crates each travelling three miles means six crate-miles of carrying in total.",
      "Divide those six crate-miles equally among three porters."
    ],
    explanation: "Each porter carries for 2 miles. The total work is fixed: two crates must each travel three miles, which is 2 × 3 = 6 crate-miles of carrying. Shared equally among three porters, each is responsible for 2 crate-miles, meaning each carries a crate for exactly 2 miles and walks the remaining mile empty-handed. In practice they simply swap: at the one-mile and two-mile marks, the porters rotate which two of them are carrying. No porter carries for the full journey, and no crate is ever set down.",
    takeaway: "Convert a sharing problem into total units of work first, then divide, rather than trying to design the swap schedule up front.",
    verification: { method: "Crate-mile total divided equally with an explicit rotation schedule confirming feasibility", reviewed: true, version: 1 } },
  { id: "c2-algo-counterfeit-120", title: "One Fake Among Many", category: "Algorithms & Optimization", difficulty: 5, time: 10,
    question: "You have a pile of identical-looking coins containing exactly one counterfeit, which is either heavier or lighter than the rest, though you do not know which. Using only a two-pan balance and five weighings, and needing to both identify the fake and say whether it is heavy or light, what is the largest pile you can handle?",
    options: ["81 coins", "120 coins", "121 coins", "243 coins"], correctOption: 1,
    hints: [
      "Each weighing has three possible results, so five weighings distinguish at most 3 to the power 5, or 243, outcomes.",
      "Each coin generates two possible answers, heavy or light, so a pile of n coins produces 2n possible answers.",
      "The bound is not quite 243 divided by 2, because you also need every weighing to be balanced and informative, which costs a little."
    ],
    explanation: "The maximum is 120 coins. Each weighing yields one of three outcomes, so five weighings distinguish at most 3 to the power 5 = 243 different situations. Since each coin could be either heavy or light, a pile of n coins presents 2n possible answers, which needs 2n to be at most 243, suggesting 121. However, with no known-genuine reference coin available at the start, the first weighing must place equal numbers on each pan, and this parity requirement costs three of the available outcomes. The true bound is therefore (3 to the power 5, minus 3), divided by 2, which is exactly 120. A carefully designed weighing scheme achieves this bound, making 120 both the theoretical and practical maximum.",
    takeaway: "Count the outcomes your measurements can distinguish and the answers you must separate; the smaller number caps what any strategy can achieve.",
    verification: { method: "Information-theoretic ternary bound adjusted for the no-reference-coin parity constraint", reviewed: true, version: 1 } },
  { id: "c2-algo-chessboard-wheat", title: "Grains on the Chessboard", category: "Algorithms & Optimization", difficulty: 5, time: 9,
    question: "The inventor of chess asks his king for one grain of wheat on the first square of the board, two on the second, four on the third, doubling on every square through all 64. The king thinks this is a modest request. What is the total number of grains?",
    options: ["Roughly four thousand", "Roughly four billion", "Roughly eighteen quintillion", "Roughly one trillion"], correctOption: 2,
    hints: [
      "The grains on the final square alone are 2 to the power 63, which already dwarfs the whole first half of the board.",
      "The total of a doubling series always equals one less than double the final term.",
      "That total is 2 to the power 64, minus 1."
    ],
    explanation: "The total is 2 to the power 64 minus 1, which is 18,446,744,073,709,551,615 grains, or roughly eighteen quintillion. A doubling series has the property that every term is one more than the sum of all terms before it, so the total is always one less than double the final term. The final square alone carries 2 to the power 63 grains, more than the other 63 squares combined. At roughly 9,000 grains to a pint, this is over 320 billion bushels, several times the entire world's annual wheat production, which is why the seemingly modest request could never be honoured.",
    takeaway: "Repeated doubling grows so violently that the final step alone exceeds everything that came before it, which makes exponential requests catastrophically larger than intuition suggests.",
    verification: { method: "Geometric-series summation with the closed form evaluated exactly", reviewed: true, version: 1 } },
  { id: "c2-algo-matchstick-nim", title: "Seventeen Matchsticks", category: "Algorithms & Optimization", difficulty: 5, time: 9,
    question: "Seventeen matchsticks lie on a table. You and an opponent alternate turns, and on each turn a player must remove between one and four matchsticks. Whoever takes the last matchstick wins. You move first. How many should you take to guarantee a win?",
    options: ["One", "Two", "Three", "Four"], correctOption: 1,
    hints: [
      "Work out which pile sizes are losing positions for the player about to move.",
      "If you face exactly five matchsticks, you lose: whatever you take between one and four, your opponent takes the rest.",
      "The same trap applies at 10 and 15, so aim to hand your opponent a multiple of five."
    ],
    explanation: "Take two matchsticks, leaving fifteen. The losing positions for whoever must move are the multiples of five. If you face exactly five, any legal move of one to four leaves between one and four for your opponent, who simply takes them all and wins. The same reasoning applies at 10 and 15. Since 17 leaves a remainder of 2 when divided by 5, taking two matchsticks hands your opponent exactly fifteen. From then on, whatever number k they remove, you remove 5 − k, restoring a multiple of five each round: 15, then 10, then 5, then 0, with you taking the final matchstick and winning.",
    takeaway: "In take-away games, find the losing positions first, then move so your opponent always faces one of them and mirror their moves to keep them there.",
    verification: { method: "Backward induction over losing positions with the modular winning strategy verified", reviewed: true, version: 1 } },
  { id: "c2-spatial-long-tunnel", title: "Through the Tunnel", category: "Spatial Reasoning", difficulty: 2, time: 4,
    question: "A train is one mile long and travels at a steady one mile per minute. It enters a tunnel that is also one mile long. How long does it take from the moment the front of the train enters the tunnel until the very last carriage leaves it?",
    options: ["1 minute", "1.5 minutes", "2 minutes", "3 minutes"], correctOption: 2,
    hints: [
      "The job is not finished when the front of the train exits; the back of the train still has to clear the tunnel.",
      "Follow the front of the train and work out how far it must travel before the rear is out.",
      "The front must cover the tunnel's length plus the train's own length."
    ],
    explanation: "It takes 2 minutes. Track the front of the train. When the front has travelled one mile it has just reached the far end of the tunnel, but the entire train is still inside. The rear of the train only emerges once the front has travelled a further mile, equal to the train's own length. So the front covers two miles in total, and at one mile per minute that takes 2 minutes. The common wrong answer of one minute measures only until the front exits, which is not what the question asks.",
    takeaway: "For an object passing through a gap, the distance travelled is the gap length plus the object's own length, not just the gap.",
    verification: { method: "Front-of-train displacement tracking through entry and full exit", reviewed: true, version: 1 } },
  { id: "c2-spatial-shadow-steeple", title: "The Steeple's Shadow", category: "Spatial Reasoning", difficulty: 2, time: 4,
    question: "A vertical staff 5 feet tall casts a shadow 2 feet long. At the very same hour, a church steeple casts a shadow 120 feet long. How tall is the steeple?",
    options: ["48 feet", "240 feet", "300 feet", "600 feet"], correctOption: 2,
    hints: [
      "The sun's rays arrive at the same angle for both objects at the same moment.",
      "That makes the staff and its shadow similar to the steeple and its shadow, so the ratios match.",
      "The staff's height-to-shadow ratio is 5 to 2, so multiply the steeple's shadow by 5/2."
    ],
    explanation: "The steeple is 300 feet tall. At any given moment the sun's rays strike everything at the same angle, so the triangle formed by the staff and its shadow is similar to the triangle formed by the steeple and its shadow. The staff gives a height-to-shadow ratio of 5 to 2, or 2.5. Applying that same ratio to the steeple's 120-foot shadow gives 120 × 2.5 = 300 feet. A common slip is to multiply by 2 instead of 2.5, giving 240, which ignores that the staff is two and a half times its shadow, not merely twice.",
    takeaway: "Simultaneous shadows create similar triangles, so a single known height-to-shadow ratio measures anything else in view.",
    verification: { method: "Similar-triangle proportion applied from a measured reference object", reviewed: true, version: 1 } },
  { id: "c2-spatial-squirrel-post", title: "The Spiralling Squirrel", category: "Spatial Reasoning", difficulty: 3, time: 5,
    question: "A cylindrical post is 16 feet tall and 3 feet around. A squirrel climbs it in an even spiral, completing exactly one full circuit of the post for every 4 feet it rises. How far does the squirrel actually travel to reach the top?",
    options: ["16 feet", "20 feet", "24 feet", "28 feet"], correctOption: 1,
    hints: [
      "Imagine slitting the cylinder down its side and unrolling it flat into a rectangle.",
      "On the flattened surface, each single circuit becomes a straight diagonal across a rectangle 4 feet tall and 3 feet wide.",
      "Each such diagonal is the hypotenuse of a 3-4-5 right triangle, and there are four circuits in 16 feet."
    ],
    explanation: "The squirrel travels 20 feet. Unroll the cylinder into a flat rectangle: one full circuit becomes a horizontal run of 3 feet, the post's circumference, while the squirrel rises 4 feet. The path for that circuit is the straight diagonal of a 3-by-4 rectangle, which by Pythagoras is 5 feet. Since the post is 16 feet tall and each circuit covers 4 feet of rise, there are exactly four circuits, giving 4 × 5 = 20 feet in total. The trick is recognising that a spiral on a cylinder becomes a straight line once the surface is flattened.",
    takeaway: "Unrolling a curved surface turns a spiral path into a straight line, letting ordinary flat geometry solve a three-dimensional problem.",
    verification: { method: "Cylinder unrolling with per-circuit hypotenuse computation summed over all circuits", reviewed: true, version: 1 } },
  { id: "c2-spatial-squares-grid", title: "Squares Within Squares", category: "Spatial Reasoning", difficulty: 3, time: 5,
    question: "A 4 by 4 grid is drawn, made up of sixteen small unit squares. Counting squares of every possible size, from single units up to the whole grid, how many squares can be found in the figure?",
    options: ["16", "20", "30", "36"], correctOption: 2,
    hints: [
      "Count the squares one size at a time rather than trying to spot them all at once.",
      "There are sixteen 1-by-1 squares and exactly one 4-by-4 square.",
      "For a k-by-k square inside a 4-by-4 grid, there are (5 − k) positions across and (5 − k) down."
    ],
    explanation: "There are 30 squares. Count by size. A 1-by-1 square can sit in any of 4 positions across and 4 down, giving 16. A 2-by-2 square has 3 positions each way, giving 9. A 3-by-3 square has 2 positions each way, giving 4. The 4-by-4 square has only 1 position. Adding these gives 16 + 9 + 4 + 1 = 30. The pattern is the sum of the squares of 1 through 4, which generalises to any n-by-n grid.",
    takeaway: "Count geometric figures by systematically grouping them by size, since each size has a predictable number of valid positions.",
    verification: { method: "Size-by-size positional count summed as the sum of squares from one to four", reviewed: true, version: 1 } },
  { id: "c2-spatial-sawing-cube", title: "Cutting the Cube", category: "Spatial Reasoning", difficulty: 3, time: 6,
    question: "A wooden cube 3 inches on each side is to be cut into 27 one-inch cubes. Six straight saw cuts obviously suffice. If you are allowed to rearrange the pieces however you like between cuts, can you finish in fewer than six cuts?",
    options: ["Yes, four cuts are enough", "Yes, five cuts are enough", "No, six cuts are always needed", "No, rearranging actually makes it worse"], correctOption: 2,
    hints: [
      "Focus on one specific small cube: the one that ends up at the very centre of the original block.",
      "That centre cube starts with none of its six faces exposed, since it is buried inside the block.",
      "Each of its six faces must be created by some cut, and no single straight cut can create two of them at once."
    ],
    explanation: "Six cuts are always needed, and rearranging never helps. Consider the small cube that ends up at the exact centre of the original block. Initially none of its six faces is exposed, since it is entirely buried. Every one of those six faces must eventually be produced by a saw cut. A single straight cut is a flat plane, and it cannot simultaneously create two opposite faces of that centre cube, because those faces lie on two different parallel planes. So each of the six faces requires its own separate cut, giving a minimum of six. Rearranging pieces between cuts genuinely helps in many cutting problems, but here the centre cube's six buried faces make it impossible.",
    takeaway: "Prove a lower bound by finding a single element whose requirements cannot be satisfied by fewer operations, regardless of how the rest is arranged.",
    verification: { method: "Lower-bound argument on the centre cube's six faces against the plane geometry of a single cut", reviewed: true, version: 1 } },
  { id: "c2-spatial-clock-opposite", title: "Hands Exactly Opposite", category: "Spatial Reasoning", difficulty: 3, time: 6,
    question: "On an ordinary analogue clock, at what time between four o'clock and five o'clock do the hour hand and the minute hand point in exactly opposite directions, 180 degrees apart?",
    options: ["4:30 exactly", "4:50 exactly", "4:54 and 6/11 minutes", "4:58 and 2/11 minutes"], correctOption: 2,
    hints: [
      "The minute hand sweeps 6 degrees per minute, while the hour hand creeps along at only 0.5 degrees per minute.",
      "At exactly four o'clock the hour hand sits at 120 degrees and the minute hand at 0 degrees.",
      "Set up the equation where the minute hand has gained exactly 180 degrees on the hour hand, using their difference in speed of 5.5 degrees per minute."
    ],
    explanation: "The hands are opposite at 4:54 and 6/11 minutes. Measuring clockwise from twelve, after m minutes past four the minute hand is at 6m degrees and the hour hand is at 120 + 0.5m degrees. For them to be exactly opposite, the minute hand must be 180 degrees ahead: 6m = 120 + 0.5m + 180. That simplifies to 5.5m = 300, so m = 300 ÷ 5.5 = 600/11, which is 54 and 6/11 minutes. The answer is not a whole number of minutes because the hour hand keeps moving while the minute hand chases it, which is exactly why 4:50 feels right but is wrong.",
    takeaway: "Clock-hand problems are relative-speed problems: the minute hand gains on the hour hand at a steady 5.5 degrees per minute.",
    verification: { method: "Relative angular velocity equation solved exactly in fractional minutes", reviewed: true, version: 1 } },
  { id: "c2-spatial-ink-spot", title: "The Ink Spot on the Table", category: "Spatial Reasoning", difficulty: 4, time: 8,
    question: "A circular table more than a foot across is pushed into a corner so that it touches both walls. A small ink spot on the very edge of the table sits 8 inches from one wall and 9 inches from the other. What is the diameter of the table?",
    options: ["10 inches", "34 inches", "58 inches", "68 inches"], correctOption: 2,
    hints: [
      "Put the corner at the origin of a coordinate grid, with the two walls along the axes.",
      "If the table has radius r and touches both walls, its centre must be at the point (r, r).",
      "The ink spot is at (8, 9) and lies on the circle, so substitute into (x − r) squared plus (y − r) squared equals r squared."
    ],
    explanation: "The diameter is 58 inches. Place the corner at the origin with the walls along the axes. A table of radius r touching both walls has its centre at (r, r), so its edge satisfies (x − r)² + (y − r)² = r². The ink spot at (8, 9) gives (8 − r)² + (9 − r)² = r², which expands to 64 − 16r + r² + 81 − 18r + r² = r², simplifying to r² − 34r + 145 = 0. Factoring gives roots r = 29 and r = 5. The r = 5 solution describes a tiny 10-inch table, which the question rules out by stating the table is more than a foot across. So r = 29 and the diameter is 58 inches.",
    takeaway: "Placing a geometric problem on coordinates turns a physical constraint like 'touching both walls' into a precise statement about the centre's position.",
    verification: { method: "Coordinate-geometry circle equation solved as a quadratic with both roots checked against the stated size constraint", reviewed: true, version: 1 } },
  { id: "c2-spatial-canvas-margins", title: "The Puzzled Artist", category: "Spatial Reasoning", difficulty: 4, time: 7,
    question: "An artist wants a canvas with a 4-inch margin at the top and another at the bottom, plus a 2-inch margin on each side. The picture itself must occupy exactly 72 square inches. What are the dimensions of the smallest possible canvas by total area?",
    options: ["8 inches by 25 inches", "10 inches by 20 inches", "12 inches by 18 inches", "14 inches by 16 inches"], correctOption: 1,
    hints: [
      "If the picture is w wide and h tall, the canvas measures (w + 4) wide and (h + 8) tall.",
      "Use the constraint that w times h equals 72 to write the canvas area in terms of w alone.",
      "The canvas area becomes 104 plus 8w plus 288 divided by w; find the w that minimises it."
    ],
    explanation: "The smallest canvas is 10 inches wide by 20 inches tall, with an area of 200 square inches. If the picture measures w by h with wh = 72, the canvas measures (w + 4) by (h + 8), since the side margins add 2 inches twice and the top and bottom margins add 4 inches twice. Its area is wh + 8w + 4h + 32, which with wh = 72 and h = 72/w becomes 104 + 8w + 288/w. Testing the whole-number widths that divide 72 gives a minimum at w = 6, where the area is 104 + 48 + 48 = 200. That makes the picture 6 by 12 and the canvas 10 by 20. Notice the picture is taller than it is wide, compensating for the larger top and bottom margins.",
    takeaway: "When margins differ between dimensions, the optimal inner shape stretches away from the larger margins rather than staying square.",
    verification: { method: "Constrained area minimisation evaluated over every integer factor pair of 72", reviewed: true, version: 1 } },
  { id: "c2-spatial-wheels-circumference", title: "The Carriage Wheels", category: "Spatial Reasoning", difficulty: 4, time: 7,
    question: "Over a distance of 96 feet, the front wheels of a carriage make exactly 4 more revolutions than the rear wheels. If instead the front wheel's circumference were one and a half times as great and the rear wheel's were four thirds as great, the front would make only 2 more revolutions than the rear over the same 96 feet. What is the front wheel's circumference?",
    options: ["6 feet", "8 feet", "10 feet", "12 feet"], correctOption: 1,
    hints: [
      "The number of revolutions over a fixed distance is that distance divided by the wheel's circumference.",
      "Write the first condition as 96/f minus 96/r equals 4, where f and r are the two circumferences.",
      "Write the second condition as 96 divided by 1.5f, minus 96 divided by (4/3)r, equals 2, then solve the pair."
    ],
    explanation: "The front wheel is 8 feet around, and the rear wheel is 12 feet. Revolutions over a fixed distance equal the distance divided by circumference, so the first condition is 96/f − 96/r = 4. The second scenario scales the circumferences, giving 96/(1.5f) − 96/((4/3)r) = 2, which simplifies to 64/f − 72/r = 2. From the first equation, 96/f = 4 + 96/r, and multiplying by two thirds gives 64/f = 8/3 + 64/r. Substituting into the second equation yields 8/3 + 64/r − 72/r = 2, so 8/r = 2/3 and r = 12. Then 96/f = 4 + 8 = 12, giving f = 8. Checking: over 96 feet the front turns 12 times and the rear 8 times, a difference of 4, exactly as stated.",
    takeaway: "Convert 'revolutions over a distance' into distance divided by circumference immediately, which turns a rotational problem into ordinary algebra.",
    verification: { method: "Simultaneous reciprocal equations solved algebraically and confirmed by exhaustive integer search", reviewed: true, version: 1 } },
  { id: "c2-spatial-cube-nets", title: "Unfolding a Cube", category: "Spatial Reasoning", difficulty: 4, time: 7,
    question: "A cube can be cut along some of its edges and unfolded flat into a connected arrangement of six squares, called a net. Counting two nets as the same when one can be rotated or flipped onto the other, how many genuinely different nets does a cube have?",
    options: ["6", "8", "11", "35"], correctOption: 2,
    hints: [
      "Organise the search by how many squares sit in the longest straight row of the net.",
      "The most familiar family has a row of four squares with one square attached above and one below the row.",
      "There are also families based on a longest row of three squares, and one built from two rows of three."
    ],
    explanation: "A cube has exactly 11 distinct nets. Organising them by the longest straight strip makes the count manageable. Six nets are built on a strip of four squares, with the two remaining squares attached on opposite sides of that strip in six inequivalent relative positions. Three more nets have a longest strip of exactly three squares. One net is the two-by-three arrangement with a square shifted, and one final net forms a staircase shape, giving 6 + 3 + 1 + 1 = 11 in total. Many arrangements of six squares joined edge to edge look plausible but fold with two faces landing on top of each other, which is why the count is far smaller than the number of ways to lay six squares out flat.",
    takeaway: "Enumerate geometric configurations by a structural feature such as the longest row, which turns an unmanageable search into a few small families.",
    verification: { method: "Systematic enumeration of hexomino nets classified by longest strip, with folding validity checked per family", reviewed: true, version: 1 } },
  { id: "c2-spatial-rose-garden", title: "The Largest Rose Garden", category: "Spatial Reasoning", difficulty: 5, time: 9,
    question: "A four-sided garden has sides measuring 20, 16, 12, and 10 rods, in that order around its boundary. The corners can be adjusted freely as long as the side lengths stay fixed. What is the greatest possible area of the garden, in square rods?",
    options: ["160.0", "180.0", "194.4", "240.0"], correctOption: 2,
    hints: [
      "A four-sided figure with fixed side lengths is flexible, so its area changes as the corners hinge.",
      "The area is greatest exactly when all four corners lie on a single circle.",
      "For such a cyclic quadrilateral, compute the semi-perimeter s, then take the square root of (s−a)(s−b)(s−c)(s−d)."
    ],
    explanation: "The maximum area is about 194.4 square rods. Unlike a triangle, a quadrilateral with fixed side lengths can flex, and its area is largest precisely when all four vertices lie on a common circle. For such a cyclic quadrilateral, Brahmagupta's formula gives the area as the square root of (s−a)(s−b)(s−c)(s−d), where s is the semi-perimeter. Here the perimeter is 20 + 16 + 12 + 10 = 58, so s = 29. The four factors are 9, 13, 17, and 19, whose product is 37,791. The square root of 37,791 is approximately 194.4. Notice this is a genuine maximum: hinge the shape into any non-cyclic configuration and the area falls.",
    takeaway: "Among all shapes with the same fixed side lengths, the one whose vertices lie on a circle encloses the greatest area.",
    verification: { method: "Brahmagupta's cyclic-quadrilateral area formula evaluated exactly and confirmed numerically", reviewed: true, version: 1 } },
  { id: "c2-spatial-ant-cube", title: "Across the Surface of a Cube", category: "Spatial Reasoning", difficulty: 5, time: 10,
    question: "An ant sits at one corner of a solid cube with sides of length 1 and wants to reach the diagonally opposite corner. It can only crawl along the cube's surface, never through the inside. What is the shortest distance it must travel?",
    options: ["The square root of 2, about 1.414", "The square root of 3, about 1.732", "The square root of 5, about 2.236", "Exactly 3"], correctOption: 2,
    hints: [
      "The straight-line distance through the inside of the cube is not allowed, so the ant must cross at least two faces.",
      "Unfold the two faces the ant crosses into a single flat rectangle and draw a straight line across it.",
      "Unfolding two adjacent faces gives a rectangle 1 unit by 2 units, so apply Pythagoras to those dimensions."
    ],
    explanation: "The shortest surface path has length equal to the square root of 5, about 2.236. Unfold two adjacent faces of the cube flat onto a plane. Together they form a rectangle measuring 1 by 2, with the ant's start and finish at opposite corners of that rectangle. The shortest path across a flat surface is a straight line, whose length is the square root of 1² + 2², which is the square root of 5. Crawling along the edges instead would take 3 units, and the square root of 3 is the forbidden straight line drilled through the cube's interior. Several different pairs of faces give the same square root of 5, so there are multiple equally short routes.",
    takeaway: "To find the shortest path across a solid's surface, unfold the relevant faces flat, since a straight line on the unfolded shape becomes the shortest surface route.",
    verification: { method: "Surface unfolding into a planar rectangle with the straight-line distance compared against all alternative routes", reviewed: true, version: 1 } },
  { id: "c2-spatial-sphere-hole", title: "The Napkin Ring", category: "Spatial Reasoning", difficulty: 5, time: 10,
    question: "A cylindrical hole is drilled straight through the centre of a solid sphere, leaving a ring-shaped band. The remaining band measures exactly 6 units tall. What is the volume of the remaining material?",
    options: ["36 pi", "It depends on the original sphere's radius", "72 pi", "Not enough information without the drill's diameter"], correctOption: 0,
    hints: [
      "Try the extreme case: imagine the drill is infinitely thin, so the hole has essentially no width.",
      "In that case the band's height of 6 is the sphere's own diameter, and you can compute the volume directly.",
      "The surprising fact is that the answer is the same for every sphere size, so the extreme case gives the general answer."
    ],
    explanation: "The remaining volume is 36 pi, and remarkably it does not depend on the original sphere at all. Test the extreme case where the drill bit is vanishingly thin. Then almost nothing is removed, and the 6-unit band height is simply the sphere's diameter, making its radius 3. The volume of that sphere is four thirds pi times 3 cubed, which is 36 pi. Now consider a much larger sphere: to leave a band only 6 units tall, you must drill a much wider hole, removing far more material, and the two effects cancel exactly. The general result is that the remaining volume is pi times the band height cubed, divided by 6, which for a height of 6 gives 216 pi over 6, or 36 pi.",
    takeaway: "When a result is claimed to be independent of some parameter, test an extreme value of that parameter, since the easy case then delivers the general answer.",
    verification: { method: "Extreme-case evaluation cross-checked against the closed-form napkin-ring volume of pi times height cubed over six", reviewed: true, version: 1 } },
  { id: "c2-pattern-taxi-number", title: "The Mathematical Taxi Driver", category: "Patterns & Numbers", difficulty: 2, time: 4,
    question: "A taxi's number leaves a remainder of exactly 1 when divided by each of 2, 3, 4, 5, and 6, but divides evenly by 11. What is the lowest possible number?",
    options: ["11", "61", "121", "231"], correctOption: 2,
    hints: [
      "A number leaving remainder 1 when divided by all of 2, 3, 4, 5, and 6 must be one more than a common multiple of them.",
      "The least common multiple of 2, 3, 4, 5, and 6 is 60, so the candidates are 61, 121, 181, and so on.",
      "Test each candidate in turn for divisibility by 11."
    ],
    explanation: "The number is 121. Leaving remainder 1 when divided by 2, 3, 4, 5, and 6 means the number minus 1 is a common multiple of all five. Their least common multiple is 60, so the candidates are 61, 121, 181, 241, and so on. Testing for divisibility by 11: 61 is not divisible, but 121 is, since 121 = 11 × 11. Checking 121 against every condition confirms it leaves remainder 1 when divided by 2, 3, 4, 5, and 6, and divides exactly by 11. Since 61 was the only smaller candidate and it failed, 121 is genuinely the lowest.",
    takeaway: "Conditions of the form 'remainder 1 for several divisors' collapse into a single condition on the least common multiple, shrinking the search to a short list.",
    verification: { method: "Least common multiple construction with candidates tested in ascending order", reviewed: true, version: 1 } },
  { id: "c2-pattern-diff-three-squares", title: "Squares Fifty-One Apart", category: "Patterns & Numbers", difficulty: 2, time: 4,
    question: "Two whole numbers differ by 3, and the difference of their squares is 51. What is the larger number?",
    options: ["7", "9", "10", "17"], correctOption: 2,
    hints: [
      "The difference of two squares always factors as (a − b) times (a + b).",
      "You already know a − b is 3, and the whole product must be 51.",
      "So a + b must be 51 divided by 3, which is 17; combine that with a − b equals 3."
    ],
    explanation: "The larger number is 10. The difference of two squares factors as a² − b² = (a − b)(a + b). Since a − b = 3 and the product equals 51, it follows that a + b = 51 ÷ 3 = 17. Now solve the pair a − b = 3 and a + b = 17: adding them gives 2a = 20, so a = 10, and therefore b = 7. Checking: 10² − 7² = 100 − 49 = 51, and 10 − 7 = 3, exactly as stated. Factoring first avoids expanding and solving a messy quadratic.",
    takeaway: "Always factor a difference of squares before expanding, since one of the two factors is usually given to you directly.",
    verification: { method: "Difference-of-squares factorisation solved as a linear pair and verified numerically", reviewed: true, version: 1 } },
  { id: "c2-pattern-puzzling-58", title: "Greater Than Its Own Parts", category: "Patterns & Numbers", difficulty: 3, time: 5,
    question: "A certain number exceeds the sum of its third part, its tenth part, and its twelfth part by exactly 58. What is the number?",
    options: ["90", "120", "150", "180"], correctOption: 1,
    hints: [
      "Write the condition as n minus the sum of n/3, n/10, and n/12 equals 58.",
      "Put the three fractions over a common denominator of 60 and add them together.",
      "The three parts total 31/60 of the number, so the leftover fraction equals 58."
    ],
    explanation: "The number is 120. Writing the condition as n − (n/3 + n/10 + n/12) = 58 and using a common denominator of 60, the three parts become 20/60, 6/60, and 5/60, which total 31/60 of the number. So the number minus 31/60 of itself is 29/60 of it, and that equals 58. Therefore each sixtieth is 2, and the whole number is 120. Checking: a third of 120 is 40, a tenth is 12, and a twelfth is 10, totalling 62; and 120 − 62 = 58, exactly as required.",
    takeaway: "Convert every fractional part to a common denominator first, so the leftover portion becomes a single fraction you can equate to the given amount.",
    verification: { method: "Common-denominator fraction summation with all three parts recomputed as a check", reviewed: true, version: 1 } },
  { id: "c2-pattern-strange-two", title: "A Cube and a Square", category: "Patterns & Numbers", difficulty: 3, time: 6,
    question: "There are two whole numbers such that the difference of their squares is a perfect cube, and the difference of their cubes is a perfect square. What is the smaller of the two smallest such numbers?",
    options: ["4", "6", "8", "9"], correctOption: 1,
    hints: [
      "Search small pairs systematically rather than looking for a clever formula.",
      "For each candidate pair, compute the difference of the squares and check whether it is a perfect cube.",
      "Only then check whether the difference of their cubes is a perfect square; try the pair 10 and 6."
    ],
    explanation: "The numbers are 10 and 6, so the smaller is 6. Checking the first condition, 10² − 6² = 100 − 36 = 64, and 64 is 4 cubed, a perfect cube. Checking the second, 10³ − 6³ = 1000 − 216 = 784, and 784 is 28 squared, a perfect square. Both conditions hold simultaneously. A systematic search over all smaller pairs confirms no smaller pair satisfies both conditions at once, which is what makes this pair the answer. Many pairs satisfy one condition, but requiring both together is far more restrictive.",
    takeaway: "When two independent conditions must hold at once, generate candidates satisfying the cheaper condition first and only then test the second.",
    verification: { method: "Exhaustive pair search with perfect-cube and perfect-square tests applied to each difference", reviewed: true, version: 1 } },
  { id: "c2-pattern-sixteen-fours", title: "Sixteen Fours Make a Thousand", category: "Patterns & Numbers", difficulty: 3, time: 6,
    question: "Using the digit 4 exactly sixteen times, along with addition only, you can make a total of exactly 1,000. Which combination works?",
    options: ["444 + 444 + 44 + 44 + 4 + 4 + 4 + 4 + 4 + 4", "444 + 444 + 44 + 44 + 24", "4444 divided by 4, plus more fours", "444 + 444 + 111 + 1"], correctOption: 0,
    hints: [
      "You may join fours together to build larger numbers like 44 and 444, and each digit used still counts towards the sixteen.",
      "Start with the largest useful building blocks: two 444s already reach 888.",
      "You need 112 more from ten remaining fours, which two 44s and six single 4s supply exactly."
    ],
    explanation: "The combination is 444 + 444 + 44 + 44 + 4 + 4 + 4 + 4 + 4 + 4. Counting the digits used: two numbers of three fours each is 6, two numbers of two fours each is 4, and six single fours is 6, totalling exactly 16 fours. Adding the values: 444 + 444 = 888, plus 44 + 44 = 88 brings the running total to 976, and the six single fours add 24 to reach exactly 1,000. The other options either use digits other than 4, which is not allowed, or fail to use exactly sixteen of them.",
    takeaway: "In digit-construction puzzles, treat concatenated digits as legitimate building blocks and keep a running count of digits used alongside the running total.",
    verification: { method: "Direct arithmetic evaluation with an explicit digit-usage count against the stated limit of sixteen", reviewed: true, version: 1 } },
  { id: "c2-pattern-prime-years", title: "Prime Years of the Century", category: "Patterns & Numbers", difficulty: 4, time: 7,
    question: "Counting the twentieth century as the years 1901 through 2000 inclusive, how many of those years are prime numbers?",
    options: ["7", "11", "13", "17"], correctOption: 2,
    hints: [
      "Every even year and every year ending in 5 can be discarded immediately, halving the work twice over.",
      "For each surviving candidate, you only need to test divisibility by primes up to about 45, since 45 squared exceeds 2000.",
      "Work through the candidates systematically; the answer is larger than most people guess."
    ],
    explanation: "There are 13 prime years: 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, and 1999. To verify, discard all even years and all years ending in 5, then test each remaining candidate for divisibility by the primes up to 43, since any composite number below 2000 must have a prime factor no larger than that. Several widely circulated puzzle books claim there are only seven prime years in the century, listing just the ones from 1951 onward; that count is simply wrong, as the six primes between 1901 and 1949 are easily verified by direct division.",
    takeaway: "To test a number for primality you only need to try prime divisors up to its square root, which makes checking a whole century of candidates quite manageable.",
    verification: { method: "Trial division by all primes up to 43 applied to every candidate year from 1901 to 2000", reviewed: true, version: 1 } },
  { id: "c2-pattern-eleven-largest", title: "The Mystery of Eleven", category: "Patterns & Numbers", difficulty: 4, time: 8,
    question: "Using nine of the ten digits 0 through 9, each at most once, form the largest possible number that is exactly divisible by 11. What is that number?",
    options: ["987654312", "987652413", "987651234", "986543217"], correctOption: 1,
    hints: [
      "A number is divisible by 11 when the alternating sum of its digits, adding the first, subtracting the second, and so on, is itself a multiple of 11.",
      "To make the number as large as possible, keep the leading digits as high as you can and adjust only near the end.",
      "Drop the digit 0 so all nine digits are large, then rearrange the tail until the alternating sum becomes a multiple of 11."
    ],
    explanation: "The largest such number is 987,652,413. A number is divisible by 11 exactly when the alternating sum of its digits is a multiple of 11. For 987652413, the digits in odd positions are 9, 7, 5, 4, and 3, totalling 28, and those in even positions are 8, 6, 2, and 1, totalling 17. The difference is 28 − 17 = 11, which is a multiple of 11, so the number is divisible by 11. Dropping the digit 0 keeps all nine digits as large as possible, and starting from 987654321 the tail must be rearranged only as much as the divisibility rule demands, which is why the number stays identical through its first five digits.",
    takeaway: "Divisibility by 11 depends only on the alternating sum of digits, so you can rearrange the least significant digits to satisfy it while protecting the leading ones.",
    verification: { method: "Alternating-digit-sum divisibility test applied to the candidate with a descending-order search for the maximum", reviewed: true, version: 1 } },
  { id: "c2-pattern-license-plate", title: "The Curious Licence Plate", category: "Patterns & Numbers", difficulty: 4, time: 8,
    question: "A licence plate carries a five-digit number with all five digits different. Fixed upside down by mistake, it still reads as a valid five-digit number, but its value has increased by exactly 78,633. What was the original number?",
    options: ["10968", "16098", "18906", "19608"], correctOption: 0,
    hints: [
      "Only 0, 1, 6, 8, and 9 stay readable when rotated, and 6 becomes 9 while 9 becomes 6.",
      "Since all five digits differ and only five digits are usable, the number must use each of 0, 1, 6, 8, and 9 exactly once.",
      "The rotated version must not start with 0, which rules out several arrangements; test the survivors against the required difference."
    ],
    explanation: "The original number is 10,968. Only the digits 0, 1, 6, 8, and 9 survive a 180-degree rotation, and since all five digits must differ, the plate uses each of them exactly once. Rotating reverses the digit order and swaps every 6 with a 9. Applying this to 10968: reversing gives 86901, then swapping 6 and 9 in each position yields 89601. Checking the difference, 89,601 − 10,968 = 78,633, exactly as required. A search over all valid arrangements confirms this is the only one that both reads correctly upside down without a leading zero and produces the stated increase.",
    takeaway: "Rotation puzzles combine two separate transformations, reversing the order and mapping each digit, so apply them in the right sequence before comparing values.",
    verification: { method: "Exhaustive search over all five-digit numbers with distinct rotatable digits, filtered by the exact stated difference", reviewed: true, version: 1 } },
  { id: "c2-pattern-amicable-pair", title: "The Sympathetic Numbers", category: "Patterns & Numbers", difficulty: 4, time: 7,
    question: "Two numbers are called amicable when each equals the sum of the other's proper divisors, meaning all its divisors except the number itself. The smallest such pair starts with 220. What is its partner?",
    options: ["224", "248", "284", "496"], correctOption: 2,
    hints: [
      "First list every proper divisor of 220 and add them up; that sum is the partner.",
      "The proper divisors of 220 are 1, 2, 4, 5, 10, 11, 20, 22, 44, 55, and 110.",
      "Then verify the relationship works in reverse by summing the proper divisors of your candidate."
    ],
    explanation: "The partner is 284. Summing the proper divisors of 220 gives 1 + 2 + 4 + 5 + 10 + 11 + 20 + 22 + 44 + 55 + 110 = 284. The relationship must also hold in the other direction, so check 284: its proper divisors are 1, 2, 4, 71, and 142, which sum to 220. Both directions hold, making 220 and 284 a genuine amicable pair, the smallest one that exists. Note that some older printings of this fact contain a typographical error giving the partner as 224, but 224's proper divisors sum to 280, not 220, so that pairing is simply wrong.",
    takeaway: "An amicable relationship must be verified in both directions, since a one-way divisor sum proves nothing on its own.",
    verification: { method: "Full proper-divisor enumeration and summation checked in both directions", reviewed: true, version: 1 } },
  { id: "c2-pattern-date-1924", title: "A Date to Reckon With", category: "Patterns & Numbers", difficulty: 5, time: 9,
    question: "A date is called self-multiplying when the day number times the month number equals the last two digits of the year, as with 8 August 1964, since 8 times 8 is 64. Which year of the twentieth century has the greatest number of self-multiplying dates, and how many does it have?",
    options: ["1936, with 9 such dates", "1924, with 7 such dates", "1948, with 6 such dates", "1912, with 6 such dates"], correctOption: 1,
    hints: [
      "For a given two-digit year value, count the ways to write it as a day times a month.",
      "The month must be between 1 and 12 and the day must be valid for that month, so only some factor pairs work.",
      "Highly composite year values such as 24, 36, 48, and 60 give the most factor pairs; count each carefully."
    ],
    explanation: "The year is 1924, with 7 self-multiplying dates. For the year value 24, every way of writing 24 as a month between 1 and 12 times a valid day gives one date: 24 January, 12 February, 8 March, 6 April, 4 June, 3 August, and 2 December. That is 7 dates. Checking every other year value from 1 to 99 by the same method, none produces more: 36 gives 6 dates, 48 gives 6, and 60 gives 6. The number 24 wins because it has many divisors and, crucially, its divisor pairs land on days that are valid in the corresponding months, which is not always true for larger year values.",
    takeaway: "Counting factor pairs is only half the work; you must also check that each pair produces a day number that actually exists in that month.",
    verification: { method: "Exhaustive count of valid day-month factor pairs across every two-digit year value from 1 to 99", reviewed: true, version: 1 } },
  { id: "c2-pattern-stephanie-house", title: "The House Where She Lives", category: "Patterns & Numbers", difficulty: 5, time: 10,
    question: "Houses on one side of a long street are numbered 1, 2, 3 and so on with no gaps. Stephanie notices that all the house numbers below hers add up to exactly the same total as all the house numbers above hers. There are more than 50 but fewer than 500 houses on her side. What is her house number?",
    options: ["144", "169", "204", "288"], correctOption: 2,
    hints: [
      "Write the condition as: the sum from 1 to n−1 equals the sum from n+1 to N, where n is her house and N is the last house.",
      "Using the formula for a sum of consecutive numbers, this simplifies neatly to n squared equals N times (N+1) divided by 2.",
      "So you need a triangular number that is also a perfect square, with N between 51 and 499."
    ],
    explanation: "Stephanie lives at number 204, on a street with 288 houses. The condition says the sum of 1 up to n−1 equals the sum of n+1 up to N. Using the standard formula for consecutive sums, this reduces to n² = N(N+1)/2, meaning n squared must be a triangular number. Searching values of N between 51 and 499 for which N(N+1)/2 is a perfect square gives exactly one solution: N = 288, since 288 × 289 ÷ 2 = 41,616, and 41,616 is 204 squared. Checking, the numbers 1 through 203 sum to 20,706, and the numbers 205 through 288 also sum to 20,706.",
    takeaway: "Reducing a balance condition to a single equation often reveals a rare number-theoretic coincidence, such as a number that is both triangular and square.",
    verification: { method: "Closed-form reduction to a square triangular number with an exhaustive search over the stated range", reviewed: true, version: 1 } },
  { id: "c2-pattern-pandigital-squares", title: "Nine Digits, One Square", category: "Patterns & Numbers", difficulty: 5, time: 10,
    question: "Some nine-digit perfect squares use each of the digits 1 through 9 exactly once, with no zero and no repeats. What is the largest such square?",
    options: ["923187456", "932187456", "987654321", "976543218"], correctOption: 0,
    hints: [
      "A nine-digit number has a square root between 10,000 and 31,623, so the search space is manageable.",
      "Work downwards from the largest candidate roots and test whether the square uses each digit 1 through 9 exactly once.",
      "The answer is 30,384 squared; be careful, because a widely reprinted version of this puzzle transposes two of its digits."
    ],
    explanation: "The largest is 923,187,456, which is 30,384 squared. Any nine-digit square has a root between 10,000 and 31,622, so testing every root in that range and checking whether its square uses each digit 1 through 9 exactly once settles the question completely. The smallest such square is 139,854,276, which is 11,826 squared. Be careful with this puzzle: several published versions give the largest as 932,187,456, but that number is not a perfect square at all, since its square root is not a whole number. The correct value simply has the 3 and 2 the other way around.",
    takeaway: "When a search space is small enough to test exhaustively, do so rather than trusting a published answer, since transposed digits are an easy error to reprint.",
    verification: { method: "Exhaustive search over all integer roots producing nine-digit squares, filtered by pandigital digit usage", reviewed: true, version: 1 } },
  { id: "c2-pattern-collatz-27", title: "The Hailstone Sequence", category: "Patterns & Numbers", difficulty: 5, time: 9,
    question: "Start with a whole number. If it is even, halve it; if it is odd, triple it and add one. Repeat. Every starting number tested so far eventually reaches 1. Starting from 27, roughly how many steps does it take to reach 1?",
    options: ["About 11 steps", "About 41 steps", "About 111 steps", "About 400 steps"], correctOption: 2,
    hints: [
      "Small starting numbers usually reach 1 quickly, but 27 is famously an exception worth tracing carefully.",
      "The sequence from 27 climbs far higher than its starting value before eventually descending.",
      "It peaks at 9,232 along the way, which is why the step count is so much larger than the starting number suggests."
    ],
    explanation: "It takes exactly 111 steps. The sequence from 27 is notorious for how badly it misbehaves: rather than shrinking steadily, it climbs as high as 9,232 before finally descending to 1. By contrast, its neighbours 26 and 28 reach 1 in just 10 and 18 steps respectively, which shows how wildly unpredictable the process is. No one has proved that every starting number reaches 1, and this remains one of the most famous unsolved problems in mathematics despite the rule being simple enough to explain in a sentence.",
    takeaway: "A rule can be trivially simple to state and still produce behaviour nobody can predict, so simulate rather than extrapolating from neighbouring cases.",
    verification: { method: "Direct simulation of the sequence from 27 with the step count and peak value recorded", reviewed: true, version: 1 } },
];
