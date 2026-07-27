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

const byId = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));

function publishedAnswer(id) {
  const puzzle = byId.get(id);
  return puzzle.options[puzzle.correctOption];
}

test("every published puzzle passes the release schema", () => {
  assert.equal(puzzles.length, 12);
  assert.equal(byId.size, puzzles.length, "puzzle ids must be unique");

  for (const puzzle of puzzles) {
    assert.match(puzzle.id, /^[a-z0-9-]+$/);
    assert.ok(puzzle.title.length >= 8);
    assert.ok(puzzle.question.length >= 40);
    assert.equal(puzzle.options.length, 4);
    assert.ok(puzzle.correctOption >= 0 && puzzle.correctOption < 4);
    assert.equal(puzzle.hints.length, 3);
    assert.equal(new Set(puzzle.hints).size, 3, "hint stages must be distinct");
    assert.ok(puzzle.hints.every((hint) => hint.length >= 30));
    assert.ok(puzzle.explanation.length >= 220);
    assert.ok(puzzle.takeaway.length >= 50);
    assert.equal(puzzle.verification.reviewed, true);
    assert.ok(puzzle.verification.method.length >= 12);
    assert.ok(Number.isInteger(puzzle.verification.version));
  }
});

test("launch expansion supplies ten original puzzles for each path", () => {
  const records = [...launchExpansionSource.matchAll(/id: "([a-z0-9-]+)", title: "[^"]+", category: "([^"]+)", difficulty: ([1-5])/g)];
  assert.equal(records.length, 60);
  assert.equal(new Set(records.map((record) => record[1])).size, 60, "launch ids must be unique");

  const counts = new Map();
  for (const [, , category] of records) counts.set(category, (counts.get(category) ?? 0) + 1);
  for (const category of [
    "Logic & Knowledge",
    "Mathematical Reasoning",
    "Probability & Strategy",
    "Algorithms & Optimization",
    "Spatial Reasoning",
    "Patterns & Numbers",
  ]) assert.equal(counts.get(category), 10, `${category} needs ten additional puzzles`);

  assert.ok(records.filter((record) => Number(record[3]) >= 4).length >= 5, "the expansion needs expert checkpoints");
  assert.ok(!launchExpansionSource.includes("reference: \""), "expansion must not publish copied source references");
});

test("hat puzzle is forced by exhaustive knowledge-state filtering", () => {
  const colors = ["Black", "White"];
  const states = [];

  for (const ava of colors) {
    for (const ben of colors) {
      for (const cy of colors) {
        const whites = [ava, ben, cy].filter((color) => color === "White").length;
        if (whites <= 2) states.push({ ava, ben, cy });
      }
    }
  }

  const afterAva = states.filter((actual) => {
    const possibilities = states.filter(
      (state) => state.ben === actual.ben && state.cy === actual.cy,
    );
    return new Set(possibilities.map((state) => state.ava)).size > 1;
  });

  const afterBen = afterAva.filter((actual) => {
    const possibilities = afterAva.filter((state) => state.cy === actual.cy);
    return new Set(possibilities.map((state) => state.ben)).size > 1;
  });

  assert.deepEqual([...new Set(afterBen.map((state) => state.cy))], ["Black"]);
  assert.equal(publishedAnswer("signal-silence-hats"), "Black");
});

test("calendar dialogue leaves exactly July 16", () => {
  const dates = [
    ["May", 15], ["May", 16], ["May", 19], ["June", 17], ["June", 18],
    ["July", 14], ["July", 16], ["August", 14], ["August", 15], ["August", 17],
  ].map(([month, day]) => ({ month, day }));

  const daysFor = (set, day) => set.filter((date) => date.day === day);
  const monthsFor = (set, month) => set.filter((date) => date.month === month);

  const afterArun1 = dates.filter((actual) => {
    const monthDates = monthsFor(dates, actual.month);
    return monthDates.length > 1 &&
      monthDates.every((date) => daysFor(dates, date.day).length > 1);
  });
  const afterBela = afterArun1.filter(
    (actual) => daysFor(afterArun1, actual.day).length === 1,
  );
  const afterArun2 = afterBela.filter(
    (actual) => monthsFor(afterBela, actual.month).length === 1,
  );

  assert.deepEqual(afterArun2, [{ month: "July", day: 16 }]);
  assert.equal(publishedAnswer("cheryls-calendar"), "July 16");
});

test("potato answer conserves one kilogram of solids", () => {
  const initialSolid = 100 * (1 - 0.99);
  const finalWeight = initialSolid / (1 - 0.98);
  assert.ok(Math.abs(finalWeight - 50) < 1e-9);
  assert.equal(publishedAnswer("potato-water"), "50 kg");
});

test("locker simulation leaves ten perfect-square lockers open", () => {
  const open = Array(100).fill(false);
  for (let pass = 1; pass <= 100; pass += 1) {
    for (let locker = pass; locker <= 100; locker += pass) {
      open[locker - 1] = !open[locker - 1];
    }
  }
  assert.equal(open.filter(Boolean).length, 10);
  assert.equal(publishedAnswer("hundred-lockers"), "10");
});

test("switching wins two of the three exact Monty Hall cases", () => {
  const prizes = [0, 1, 2];
  const switchWins = prizes.filter((prize) => prize !== 0).length;
  assert.equal(switchWins / prizes.length, 2 / 3);
  assert.equal(publishedAnswer("monty-switch"), "Switch; the chance is 2/3");
});

test("23 is the first birthday group above a 50 percent collision chance", () => {
  let allDifferent = 1;
  let firstOverHalf = null;
  for (let people = 1; people <= 365; people += 1) {
    if (people > 1) allDifferent *= (366 - people) / 365;
    if (1 - allDifferent > 0.5) {
      firstOverHalf = people;
      break;
    }
  }
  assert.equal(firstOverHalf, 23);
  assert.equal(publishedAnswer("birthday-collision"), "23 people");
});

test("bridge state search proves 17 minutes is optimal", () => {
  const times = [1, 2, 5, 10];
  const goal = 0b1111;
  const distances = new Map([["0-0", 0]]);
  const queue = [{ mask: 0, torch: 0, cost: 0 }];

  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const state = queue.shift();
    const key = `${state.mask}-${state.torch}`;
    if (state.cost !== distances.get(key)) continue;
    if (state.mask === goal && state.torch === 1) break;

    const available = times
      .map((_, index) => index)
      .filter((index) => Boolean(state.mask & (1 << index)) === Boolean(state.torch));
    const moves = available.flatMap((a, index) => [
      [a],
      ...available.slice(index + 1).map((b) => [a, b]),
    ]);

    for (const move of moves) {
      let nextMask = state.mask;
      for (const person of move) nextMask ^= 1 << person;
      const nextTorch = 1 - state.torch;
      const nextCost = state.cost + Math.max(...move.map((person) => times[person]));
      const nextKey = `${nextMask}-${nextTorch}`;
      if (nextCost < (distances.get(nextKey) ?? Infinity)) {
        distances.set(nextKey, nextCost);
        queue.push({ mask: nextMask, torch: nextTorch, cost: nextCost });
      }
    }
  }

  assert.equal(distances.get(`${goal}-1`), 17);
  assert.equal(publishedAnswer("bridge-torch"), "17 minutes");
});

test("horse comparison construction uses seven races", () => {
  const groupRaces = 25 / 5;
  const winnersRace = 1;
  const finalCandidates = ["A2", "A3", "B1", "B2", "C1"];
  const finalRace = Number(finalCandidates.length <= 5);
  assert.equal(groupRaces + winnersRace + finalRace, 7);
  assert.equal(publishedAnswer("twenty-five-horses"), "7 races");
});

test("opposite-corner removal breaks the chessboard color invariant", () => {
  let black = 0;
  let white = 0;
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      if ((row === 0 && column === 0) || (row === 7 && column === 7)) continue;
      if ((row + column) % 2 === 0) black += 1;
      else white += 1;
    }
  }
  assert.deepEqual([black, white].sort((a, b) => a - b), [30, 32]);
  assert.equal(publishedAnswer("mutilated-board"), "No, it is impossible");
});

test("coordinate enumeration finds twelve cubes with two painted faces", () => {
  let exactlyTwo = 0;
  for (let x = 0; x < 3; x += 1) {
    for (let y = 0; y < 3; y += 1) {
      for (let z = 0; z < 3; z += 1) {
        const paintedFaces = [x, y, z].filter((value) => value === 0 || value === 2).length;
        if (paintedFaces === 2) exactlyTwo += 1;
      }
    }
  }
  assert.equal(exactlyTwo, 12);
  assert.equal(publishedAnswer("painted-cube"), "12");
});

test("1089 arithmetic is independently recomputed", () => {
  const difference = 532 - 235;
  const reverse = Number(String(difference).padStart(3, "0").split("").reverse().join(""));
  assert.equal(difference + reverse, 1089);
  assert.equal(publishedAnswer("reverse-1089"), "1089");
});

test("look-and-say transformation produces 312211", () => {
  const input = "111221";
  let output = "";
  for (let index = 0; index < input.length;) {
    let end = index + 1;
    while (end < input.length && input[end] === input[index]) end += 1;
    output += `${end - index}${input[index]}`;
    index = end;
  }
  assert.equal(output, "312211");
  assert.equal(publishedAnswer("look-and-say"), "312211");
});
