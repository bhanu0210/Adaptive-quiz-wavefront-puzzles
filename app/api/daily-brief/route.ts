import { NextResponse } from "next/server";

export const revalidate = 900;

type DailySourcePuzzle = {
  difficulty?: string;
  label?: string;
  question?: string;
  answer?: string;
  explanation?: string;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET() {
  try {
    const source = await fetch("https://wavefrontdaily.in/api/news", {
      headers: { accept: "application/json" },
      next: { revalidate: 900 },
    });
    if (!source.ok) throw new Error(`Daily feed returned ${source.status}`);

    const data = await source.json() as {
      date?: string;
      lastUpdated?: string;
      puzzles?: DailySourcePuzzle[];
    };
    const puzzles = (data.puzzles ?? []).slice(0, 3).map((puzzle) => ({
      difficulty: puzzle.difficulty ?? "daily",
      label: puzzle.label ?? "Daily",
      question: puzzle.question ?? "",
      explanation: puzzle.explanation ?? "",
      verified: Boolean(
        puzzle.answer && puzzle.explanation && normalize(puzzle.explanation).includes(normalize(puzzle.answer)),
      ),
    })).filter((puzzle) => puzzle.question);

    return NextResponse.json(
      { date: data.date ?? null, lastUpdated: data.lastUpdated ?? null, puzzles },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=900" } },
    );
  } catch {
    return NextResponse.json(
      { date: null, lastUpdated: null, puzzles: [] },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
