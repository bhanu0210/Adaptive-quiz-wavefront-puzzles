// Archived puzzle rosters from previous rotation cycles. See docs/PUZZLE-ROTATION.md.
//
// Retention: only the 2 most recently retired cycles are kept here. When a
// 3rd would be added, remove the oldest cycle's entry from this array AND
// delete its puzzle file under app/data/archive/ -- see the "Archive the
// outgoing roster" step in docs/PUZZLE-ROTATION.md for the exact procedure,
// including cleaning up that cycle's now-unreachable solve history in
// Supabase. IDs across every cycle (including already-purged ones) must
// stay globally unique forever -- never reuse an id even after its cycle
// is removed from here.

// Explicit .ts extension: tsconfig's "bundler" moduleResolution allows it,
// and it's required for tests/puzzle-accuracy.test.mjs's Node-native
// dynamic import() of this file to resolve the nested import at all --
// Node's loader (unlike webpack/Turbopack) doesn't do extensionless
// resolution.
import { cycle1Puzzles } from "./cycle-1.ts";

export type ArchivedPuzzle = {
  id: string;
  title: string;
  category: string;
  difficulty: number;
  time: number;
  question: string;
  options: string[];
  correctOption: number;
  hints: string[];
  explanation: string;
  takeaway: string;
  verification: { method: string; reviewed: boolean; version: number };
};

export type ArchivedCycle = {
  cycleNumber: number;
  startedAt: string; // ISO date
  endedAt: string; // ISO date
  puzzles: readonly ArchivedPuzzle[];
};

export const archivedCycles: readonly ArchivedCycle[] = [
  { cycleNumber: 1, startedAt: "2026-07-28", endedAt: "2026-08-19", puzzles: cycle1Puzzles },
];
