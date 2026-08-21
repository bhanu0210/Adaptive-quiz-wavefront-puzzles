import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const puzzles = JSON.parse(
  await readFile(new URL("../app/data/puzzles.json", import.meta.url), "utf8"),
);
const launchExpansionSource = await readFile(
  new URL("../app/data/launch-expansion.ts", import.meta.url),
  "utf8",
);
const { launchExpansion } = await import("../app/data/launch-expansion.ts");

const byId = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));

function publishedAnswer(id) {
  const puzzle = byId.get(id);
  return puzzle.options[puzzle.correctOption];
}

// Shared with both puzzles.json (12) and launch-expansion.ts (78) below, so
// every one of the 90 live puzzles gets the same full-field validation --
// previously the 78 in launch-expansion.ts were only checked by regex for
// id/category/difficulty and a global count, never for hint length, hint
// distinctness, explanation length, or verification shape, so a puzzle that
// broke those rules there would have shipped with no test catching it.
function assertPuzzleSchema(puzzle) {
  assert.match(puzzle.id, /^[a-z0-9-]+$/);
  assert.ok(puzzle.title.length >= 8, `${puzzle.id}: title too short`);
  assert.ok(puzzle.question.length >= 40, `${puzzle.id}: question too short`);
  assert.equal(puzzle.options.length, 4, `${puzzle.id}: needs 4 options`);
  assert.ok(puzzle.correctOption >= 0 && puzzle.correctOption < 4, `${puzzle.id}: correctOption out of range`);
  assert.equal(puzzle.hints.length, 3, `${puzzle.id}: needs 3 hints`);
  assert.equal(new Set(puzzle.hints).size, 3, `${puzzle.id}: hint stages must be distinct`);
  assert.ok(puzzle.hints.every((hint) => hint.length >= 30), `${puzzle.id}: hint too short`);
  assert.ok(puzzle.explanation.length >= 220, `${puzzle.id}: explanation too short`);
  assert.ok(puzzle.takeaway.length >= 50, `${puzzle.id}: takeaway too short`);
  assert.equal(puzzle.verification.reviewed, true, `${puzzle.id}: verification.reviewed must be true`);
  assert.ok(puzzle.verification.method.length >= 12, `${puzzle.id}: verification.method too short`);
  assert.ok(Number.isInteger(puzzle.verification.version), `${puzzle.id}: verification.version must be an integer`);
}

test("every published puzzle passes the release schema", () => {
  assert.equal(puzzles.length, 12);
  assert.equal(byId.size, puzzles.length, "puzzle ids must be unique");
  for (const puzzle of puzzles) assertPuzzleSchema(puzzle);
});

test("launch expansion supplies thirteen original puzzles for each path, and all pass the release schema", () => {
  const records = [...launchExpansionSource.matchAll(/id: "([a-z0-9-]+)", title: "[^"]+", category: "([^"]+)", difficulty: ([1-5])/g)];
  assert.equal(records.length, 78);
  assert.equal(new Set(records.map((record) => record[1])).size, 78, "launch ids must be unique");

  const counts = new Map();
  for (const [, , category] of records) counts.set(category, (counts.get(category) ?? 0) + 1);
  for (const category of [
    "Logic & Knowledge",
    "Mathematical Reasoning",
    "Probability & Strategy",
    "Algorithms & Optimization",
    "Spatial Reasoning",
    "Patterns & Numbers",
  ]) assert.equal(counts.get(category), 13, `${category} needs thirteen additional puzzles`);

  assert.ok(records.filter((record) => Number(record[3]) >= 4).length >= 5, "the expansion needs expert checkpoints");
  assert.ok(!launchExpansionSource.includes("reference: \""), "expansion must not publish copied source references");

  assert.equal(launchExpansion.length, 78, "the parsed export must match the regex-counted source");
  for (const puzzle of launchExpansion) assertPuzzleSchema(puzzle);
});

test("no puzzle id is reused between puzzles.json and launch-expansion.ts", () => {
  const expansionIds = new Set(launchExpansion.map((puzzle) => puzzle.id));
  for (const id of byId.keys()) assert.ok(!expansionIds.has(id), `id "${id}" appears in both files`);
});

test("cotton outweighs gold under avoirdupois versus troy grains", () => {
  const avoirdupoisPoundInGrains = 7000;
  const troyPoundInGrains = 5760;
  assert.ok(avoirdupoisPoundInGrains > troyPoundInGrains);
  assert.equal(publishedAnswer("c2-logic-cotton-gold"), "The pound of cotton");
});

test("only the narrator was travelling toward the market", () => {
  // Everyone else in the riddle was *met* on the road, i.e. travelling the
  // opposite direction from the narrator, so they don't count toward
  // "going to market" no matter how the wives/bags/dogs/puppies multiply out.
  const metOnTheRoad = 4 * 4 * 4 * 4;
  assert.ok(metOnTheRoad > 1, "the large total is a distraction, not the answer");
  assert.equal(publishedAnswer("c2-logic-market-wives"), "One");
});

test("27 is the unique two-digit number equal to three times its digit sum", () => {
  const matches = [];
  for (let n = 1; n < 1000; n += 1) {
    const digitSum = String(n).split("").reduce((sum, digit) => sum + Number(digit), 0);
    if (n === 3 * digitSum) matches.push(n);
  }
  assert.deepEqual(matches, [27]);
  assert.equal(publishedAnswer("c2-math-peculiar-number"), "27");
});

test("30 is the unique number whose double exceeds its half by 45", () => {
  const x = 45 / 1.5;
  assert.equal(x, 30);
  assert.equal(2 * x - x / 2, 45);
  assert.equal(publishedAnswer("c2-math-special-number"), "30");
});

test("a standard deck has twelve face cards, reducing to 3/13", () => {
  const faceCards = 4 * 3; // Jack, Queen, King per suit
  const deck = 52;
  assert.equal(faceCards / deck, 3 / 13);
  assert.equal(publishedAnswer("c2-prob-face-card"), "3/13");
});

test("pigeonhole forces a matching pair on the fourth marble draw", () => {
  const colors = 3;
  const guaranteedDraws = colors + 1;
  assert.equal(guaranteedDraws, 4);
  // Confirm three draws is genuinely insufficient: an all-different case exists.
  const worstCase = ["green", "yellow", "blue"];
  assert.equal(new Set(worstCase).size, worstCase.length);
  assert.equal(publishedAnswer("c2-prob-marbles-two-same"), "4");
});

test("gong intervals give 10.5 seconds to strike ten", () => {
  const secondsPerGap = 7 / 6; // seven gongs = six gaps, taking 7 seconds total
  const tenGongGaps = 9;
  assert.equal(tenGongGaps * secondsPerGap, 10.5);
  assert.equal(publishedAnswer("c2-algo-gong-strikes"), "10.5 seconds");
});

test("twelve pieces require eleven cuts, not twelve", () => {
  const pieces = 12;
  const cutsNeeded = pieces - 1;
  assert.equal(cutsNeeded, 11);
  assert.equal(publishedAnswer("c2-algo-saw-twelve"), "11 minutes");
});

test("Pythagoras confirms the 9-40-41 ladder triangle", () => {
  const ladder = Math.sqrt(40 ** 2 + 9 ** 2);
  assert.equal(ladder, 41);
  assert.equal(publishedAnswer("c2-spatial-ladder-window"), "41 feet");
});

test("coordinate enumeration finds eight cubes with three painted faces", () => {
  let exactlyThree = 0;
  for (let x = 0; x < 3; x += 1) {
    for (let y = 0; y < 3; y += 1) {
      for (let z = 0; z < 3; z += 1) {
        const paintedFaces = [x, y, z].filter((value) => value === 0 || value === 2).length;
        if (paintedFaces === 3) exactlyThree += 1;
      }
    }
  }
  assert.equal(exactlyThree, 8, "a cube has exactly eight corners");
  assert.equal(publishedAnswer("c2-spatial-cube-three-faces"), "8");
});

test("Celsius and Fahrenheit scales agree only at minus 40", () => {
  const toFahrenheit = (celsius) => (9 / 5) * celsius + 32;
  const matches = [];
  for (let c = -100; c <= 100; c += 1) {
    if (toFahrenheit(c) === c) matches.push(c);
  }
  assert.deepEqual(matches, [-40]);
  assert.equal(publishedAnswer("c2-pattern-blow-hot-cold"), "Minus 40 degrees");
});

test("196 is the only rotatable three-digit square under 500 that stays square", () => {
  const rotatable = new Set(["0", "1", "6", "8", "9"]);
  const flip = { 0: "0", 1: "1", 6: "9", 8: "8", 9: "6" };
  const isSquare = (n) => Number.isInteger(Math.sqrt(n));

  const matches = [];
  for (let n = 100; n < 500; n += 1) {
    if (!isSquare(n)) continue;
    const digits = String(n).split("");
    if (!digits.every((d) => rotatable.has(d))) continue;
    const rotated = digits.map((d) => flip[d]).reverse().join("");
    if (rotated[0] === "0") continue; // not a genuine three-digit number upside down
    if (isSquare(Number(rotated))) matches.push(n);
  }
  assert.deepEqual(matches, [196]);
  assert.equal(publishedAnswer("c2-pattern-bus-number"), "196");
});

test("tuesday-boy inclusion-exclusion over 196 gender-day pairs gives 13/27", () => {
  let event = 0;
  let both = 0;
  for (let g1 = 0; g1 < 2; g1 += 1) {
    for (let d1 = 0; d1 < 7; d1 += 1) {
      for (let g2 = 0; g2 < 2; g2 += 1) {
        for (let d2 = 0; d2 < 7; d2 += 1) {
          const child1IsTuesdayBoy = g1 === 0 && d1 === 0;
          const child2IsTuesdayBoy = g2 === 0 && d2 === 0;
          if (child1IsTuesdayBoy || child2IsTuesdayBoy) {
            event += 1;
            if (g1 === 0 && g2 === 0) both += 1;
          }
        }
      }
    }
  }
  assert.equal(event, 27);
  assert.equal(both, 13);
  assert.equal(both / event, 13 / 27);
});

test("144 product and 17 sum uniquely select twin ages 4, 4, and 9", () => {
  const candidates = [];
  for (let twin = 1; twin <= 12; twin += 1) {
    if (144 % (twin * twin) !== 0) continue;
    const mother = 144 / (twin * twin);
    if (mother > twin) candidates.push([twin, twin, mother]);
  }
  const withSumSeventeen = candidates.filter(([twin, , mother]) => twin + twin + mother === 17);
  assert.deepEqual(withSumSeventeen, [[4, 4, 9]]);
});

test("unfolding the cylinder gives a 10 cm shortest ant path", () => {
  const circumference = 16;
  const height = 6;
  const halfway = circumference / 2;
  const distance = Math.sqrt(halfway ** 2 + height ** 2);
  assert.equal(distance, 10);
});

test("eight-coin ternary weighing strategy finds the fake in two weighings", () => {
  const weigh = (groupA, groupB, fakeCoin) => {
    if (groupA.includes(fakeCoin)) return "left-lighter";
    if (groupB.includes(fakeCoin)) return "right-lighter";
    return "balanced";
  };

  for (let fakeCoin = 0; fakeCoin < 8; fakeCoin += 1) {
    const first = weigh([0, 1, 2], [3, 4, 5], fakeCoin);
    const candidates = first === "left-lighter" ? [0, 1, 2] : first === "right-lighter" ? [3, 4, 5] : [6, 7];
    const second = weigh([candidates[0]], [candidates[1] ?? candidates[0]], fakeCoin);
    const found = second === "left-lighter" ? candidates[0] : second === "right-lighter" ? candidates[1] : candidates[2];
    assert.equal(found, fakeCoin, `strategy must find fake coin ${fakeCoin}`);
  }

  let minimumWeighings = 0;
  while (3 ** minimumWeighings < 8) minimumWeighings += 1;
  assert.equal(minimumWeighings, 2);
});

test("shortest-job-first minimizes total completion time for 2, 3, and 5 minute tasks", () => {
  const permute = (values) => {
    if (values.length <= 1) return [values];
    return values.flatMap((value, index) => {
      const rest = [...values.slice(0, index), ...values.slice(index + 1)];
      return permute(rest).map((tail) => [value, ...tail]);
    });
  };

  const totals = permute([2, 3, 5]).map((order) => {
    let elapsed = 0;
    let total = 0;
    for (const task of order) {
      elapsed += task;
      total += elapsed;
    }
    return { order, total };
  });

  const best = totals.reduce((min, entry) => (entry.total < min.total ? entry : min));
  assert.equal(best.total, 17);
  assert.deepEqual(best.order, [2, 3, 5]);
});

test("wolf, goat, and cabbage river crossing needs exactly seven trips", () => {
  const start = { farmer: 0, wolf: 0, goat: 0, cabbage: 0 };
  const goal = { farmer: 1, wolf: 1, goat: 1, cabbage: 1 };
  const key = (state) => `${state.farmer}${state.wolf}${state.goat}${state.cabbage}`;
  const isUnsafe = (state) =>
    (state.wolf === state.goat && state.farmer !== state.wolf) ||
    (state.goat === state.cabbage && state.farmer !== state.goat);

  const visited = new Set([key(start)]);
  let frontier = [start];
  let steps = 0;

  while (!frontier.some((state) => key(state) === key(goal))) {
    const next = [];
    for (const state of frontier) {
      const movable = ["wolf", "goat", "cabbage"].filter((item) => state[item] === state.farmer);
      for (const item of [null, ...movable]) {
        const nextState = { ...state, farmer: 1 - state.farmer };
        if (item) nextState[item] = 1 - nextState[item];
        if (isUnsafe(nextState)) continue;
        const nextKey = key(nextState);
        if (!visited.has(nextKey)) {
          visited.add(nextKey);
          next.push(nextState);
        }
      }
    }
    frontier = next;
    steps += 1;
    assert.ok(steps <= 20, "search should not run away");
  }

  assert.equal(steps, 7);
});

test("plane x+y+z=3 slices a cube into a regular hexagon", () => {
  const points = [
    [2, 1, 0], [1, 2, 0], [0, 2, 1], [0, 1, 2], [1, 0, 2], [2, 0, 1],
  ];
  for (const point of points) assert.equal(point[0] + point[1] + point[2], 3);

  const distance = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
  const sides = points.map((point, index) => distance(point, points[(index + 1) % points.length]));
  for (const side of sides) assert.ok(Math.abs(side - Math.sqrt(2)) < 1e-9);
});
