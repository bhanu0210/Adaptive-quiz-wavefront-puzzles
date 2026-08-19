// Tracks the current 90-puzzle roster's rotation window.
// Updated once per rotation as described in docs/PUZZLE-ROTATION.md.
export type CycleMeta = {
  cycleNumber: number;
  startedAt: string; // ISO date (YYYY-MM-DD) the current roster went live
  rotationDays: number;
  puzzleCount: number;
};

export const currentCycle: CycleMeta = {
  cycleNumber: 2,
  startedAt: "2026-08-19",
  rotationDays: 14,
  puzzleCount: 90,
};

export function nextRotationDate(cycle: CycleMeta = currentCycle): Date {
  const started = new Date(`${cycle.startedAt}T00:00:00Z`);
  return new Date(started.getTime() + cycle.rotationDays * 24 * 60 * 60 * 1000);
}

export function daysUntilNextRotation(cycle: CycleMeta = currentCycle, now: Date = new Date()): number {
  const target = nextRotationDate(cycle);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
}

export function rotationProgress(cycle: CycleMeta = currentCycle, now: Date = new Date()): number {
  const started = new Date(`${cycle.startedAt}T00:00:00Z`);
  const elapsedMs = now.getTime() - started.getTime();
  const totalMs = cycle.rotationDays * 24 * 60 * 60 * 1000;
  return Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
}
