// Archived puzzle rosters from previous rotation cycles. See docs/PUZZLE-ROTATION.md.
// Each past cycle's full 90-puzzle roster is appended here (never deleted, never mutated)
// as the current roster gets replaced. IDs across every cycle must stay globally unique.

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

export const archivedCycles: readonly ArchivedCycle[] = [];
