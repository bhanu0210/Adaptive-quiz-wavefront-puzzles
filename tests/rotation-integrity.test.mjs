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
const cycleMetaSource = await readFile(
  new URL("../app/data/cycle-meta.ts", import.meta.url),
  "utf8",
);
const archiveSource = await readFile(
  new URL("../app/data/archive/index.ts", import.meta.url),
  "utf8",
);

test("cycle metadata declares a sane fourteen-day rotation", () => {
  assert.match(cycleMetaSource, /rotationDays:\s*14/);
  assert.match(cycleMetaSource, /cycleNumber:\s*\d+/);
  const startedAtMatch = cycleMetaSource.match(/startedAt:\s*"(\d{4}-\d{2}-\d{2})"/);
  assert.ok(startedAtMatch, "startedAt must be an ISO date string");
  assert.ok(!Number.isNaN(Date.parse(startedAtMatch[1])), "startedAt must parse as a valid date");
});

test("archived puzzle ids never collide with each other or with the current roster", () => {
  const currentIds = new Set([
    ...puzzles.map((puzzle) => puzzle.id),
    ...[...launchExpansionSource.matchAll(/id: "([a-z0-9-]+)"/g)].map((match) => match[1]),
  ]);

  const archivedIds = [...archiveSource.matchAll(/id: "([a-z0-9-]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(archivedIds).size, archivedIds.length, "archived puzzle ids must be unique among themselves");
  for (const id of archivedIds) {
    assert.ok(!currentIds.has(id), `archived id "${id}" must not collide with a currently published puzzle id`);
  }
});

test("archive module exports the expected shape", () => {
  assert.match(archiveSource, /export const archivedCycles: readonly ArchivedCycle\[\] = /);
});
