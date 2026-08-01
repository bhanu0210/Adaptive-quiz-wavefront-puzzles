"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import puzzlesData from "./data/puzzles.json";
import { launchExpansion } from "./data/launch-expansion";
import { supabase } from "./supabase";
import { currentCycle, daysUntilNextRotation, rotationProgress } from "./data/cycle-meta";
import { archivedCycles } from "./data/archive";
import { learningTips } from "./data/tips";

const launchPuzzles = [...puzzlesData, ...launchExpansion];
type Puzzle = (typeof launchPuzzles)[number];
type View = "solve" | "daily" | "paths" | "tips" | "leaderboard" | "community" | "archive" | "feedback" | "admin";
type AccessPass = "monthly" | "annual";
type DailyBrief = {
  date: string | null;
  lastUpdated: string | null;
  puzzles: Array<{ difficulty: string; label: string; question: string; explanation: string; verified?: boolean }>;
};
type AdminPuzzle = {
  id: string;
  title: string;
  path: string;
  difficulty: number;
  expected_minutes: number;
  access_level: string;
  publication_status: string;
  payload: Record<string, unknown>;
  updated_at: string;
};
type AdminMember = { user_id: string; display_name: string; created_at: string; subscription?: { status: string; current_period_end: string | null } };
type AdminPuzzleForm = { title: string; category: string; difficulty: number; time: number; question: string; options: string[]; correctOption: number; hints: string[]; explanation: string; takeaway: string; publication_status: "draft" | "published" };
type FeedbackKind = "general" | "unclear" | "incorrect" | "difficulty" | "suggestion";
type CommunityPost = {
  id: string; user_id: string; author_name: string; title: string; category: string; replies: number; rating: number | null;
  status: "pending_review" | "published" | "rejected"; created_at: string;
  question: string | null; options: string[] | null; correct_option: number | null; explanation: string | null;
};

type CycleSubmission = {
  id: string; user_id: string; author_name: string; title: string; category: string; question: string;
  options: string[]; correct_option: number; explanation: string | null; status: "submitted" | "approved" | "rejected"; created_at: string;
};
type CommunityComment = { id: string; post_id: string; user_id: string; author_name: string; body: string; created_at: string };
type CycleRewardResult = { user_id: string; rank: number; score: number; was_subscribed: boolean; weekly_days_granted: number; streak_after: number; streak_milestone_days_granted: number };
type RealLeader = { user_id: string; display_name: string; score: number; solved_count: number };
type AdminFeedback = { id: string; user_id: string; puzzle_id: string; issue_type: string; rating: number | null; note: string; created_at: string };

const accessPasses: Record<AccessPass, { name: string; price: string; duration: string; description: string }> = {
  monthly: { name: "30-Day Pass", price: "₹69", duration: "30 days", description: "Full access for one month" },
  annual: { name: "Annual Pass", price: "₹599", duration: "365 days", description: "Best value for a full year" },
};

const FREE_TRIAL_SOLVES_PER_CATEGORY = 2;
const MIN_RATINGS_FOR_REMAP = 3;

const categories = [
  { name: "Logic & Knowledge", code: "LK", color: "coral", mastery: 64 },
  { name: "Mathematical Reasoning", code: "MR", color: "blue", mastery: 48 },
  { name: "Probability & Strategy", code: "PS", color: "green", mastery: 57 },
  { name: "Algorithms & Optimization", code: "AO", color: "yellow", mastery: 39 },
  { name: "Spatial Reasoning", code: "SR", color: "pink", mastery: 71 },
  { name: "Patterns & Numbers", code: "PN", color: "cyan", mastery: 53 },
] as const;

function completePuzzlePayload(id: string, stored: Partial<Puzzle>) {
  const source = launchPuzzles.find((puzzle) => puzzle.id === id);
  if (!source) return stored;
  const storedCorrectOption = stored.correctOption;
  const usableOptions = Array.isArray(stored.options) && stored.options.length === 4 && stored.options.every((option) => typeof option === "string" && option.trim());
  const usableHints = Array.isArray(stored.hints) && stored.hints.length === 3 && stored.hints.every((hint) => typeof hint === "string" && hint.trim());
  return {
    ...source,
    ...stored,
    title: stored.title?.trim() ? stored.title : source.title,
    category: stored.category?.trim() ? stored.category : source.category,
    question: stored.question?.trim() ? stored.question : source.question,
    options: usableOptions ? stored.options : source.options,
    correctOption: typeof storedCorrectOption === "number" && Number.isInteger(storedCorrectOption) && storedCorrectOption >= 0 && storedCorrectOption < 4 ? storedCorrectOption : source.correctOption,
    hints: usableHints ? stored.hints : source.hints,
    explanation: stored.explanation?.trim() ? stored.explanation : source.explanation,
    takeaway: stored.takeaway?.trim() ? stored.takeaway : source.takeaway,
  } as Puzzle;
}

const categoryToPath: Record<(typeof categories)[number]["name"], string> = {
  "Logic & Knowledge": "logic-knowledge", "Mathematical Reasoning": "mathematical-reasoning", "Probability & Strategy": "probability-strategy",
  "Algorithms & Optimization": "algorithms-optimization", "Spatial Reasoning": "spatial-reasoning", "Patterns & Numbers": "patterns-numbers",
};

const pathToCategory = (path: string) => categories.find((category) => categoryToPath[category.name] === path)?.name ?? "Logic & Knowledge";

const samplePlayers = [
  ["Ananya P.", 3480, 88], ["Rohan S.", 3310, 86], ["Meera K.", 3180, 91], ["Vikram N.", 3010, 84], ["Sana M.", 2840, 89],
  ["Arjun D.", 2690, 82], ["Kavya R.", 2520, 87], ["Ishaan G.", 2380, 80], ["Priya L.", 2210, 85], ["Dev A.", 2050, 79],
  ["Neha V.", 1880, 83], ["Rahul T.", 1710, 78], ["Zoya F.", 1540, 81], ["Aman B.", 1360, 76], ["Mira C.", 1190, 80],
  ["Kabir J.", 1010, 74], ["Tara H.", 830, 77], ["Nikhil W.", 650, 72], ["Diya E.", 420, 75], ["Om P.", 240, 70],
].map(([name, score]) => ({ name: name as string, score: score as number, solved: Math.max(1, Math.round((score as number) / 75)), streak: 0 }));

function difficultyLabel(level: number) {
  if (level <= 2) return "Accessible";
  if (level === 3) return "Stretch";
  return "Expert";
}

function indiaDateKey(value: Date | string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

function calculateStreak(solvedAt: string[]) {
  const solvedDays = new Set(solvedAt.map(indiaDateKey));
  let streak = 0;
  const cursor = new Date();
  while (solvedDays.has(indiaDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function relativeTime(isoString: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(isoString).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function buildEmptyWeek(): { label: string; count: number }[] {
  return Array.from({ length: 7 }, (_, index) => ({
    label: new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "narrow" }).format(
      new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000),
    ),
    count: 0,
  }));
}

function AppMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span /><span /><span />
    </div>
  );
}

function SignalField() {
  return <div className="puzzle-illustration" aria-hidden="true" />;
}

function TipIcon({ code, color }: { code: string; color: string }) {
  const common = { width: 40, height: 40, viewBox: "0 0 40 40", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (code) {
    case "LK": // truth table: a small true/false grid
      return <svg {...common}><rect x="6" y="6" width="28" height="28" rx="3" /><path d="M6 20h28M20 6v28" /><path d="M11 14l3 3 5-6" /><path d="M24 26l6 6M30 26l-6 6" /></svg>;
    case "MR": // proportion bar split into parts
      return <svg {...common}><rect x="6" y="16" width="28" height="8" rx="2" /><path d="M17 16v8M25 16v8" /><path d="M20 6v6M14 9l6-3 6 3" /></svg>;
    case "PS": // branching probability tree
      return <svg {...common}><circle cx="20" cy="8" r="2.4" fill={color} /><path d="M20 10v6M20 16l-10 8M20 16l10 8" /><circle cx="10" cy="26" r="2.4" fill={color} /><circle cx="30" cy="26" r="2.4" fill={color} /><path d="M10 28v4M30 28v4" /></svg>;
    case "AO": // shortest-path graph
      return <svg {...common}><circle cx="8" cy="30" r="2.6" fill={color} /><circle cx="20" cy="10" r="2.6" fill={color} /><circle cx="32" cy="30" r="2.6" fill={color} /><path d="M8 30L20 10L32 30" /><path d="M8 30L32 30" strokeDasharray="3 3" /></svg>;
    case "SR": // rotating cube
      return <svg {...common}><path d="M20 6l13 7v14l-13 7-13-7V13z" /><path d="M7 13l13 7 13-7M20 20v14" /></svg>;
    case "PN": // number sequence with growing gaps
      return <svg {...common}><circle cx="7" cy="30" r="2.2" fill={color} /><circle cx="16" cy="24" r="2.2" fill={color} /><circle cx="26" cy="15" r="2.2" fill={color} /><circle cx="34" cy="7" r="2.2" fill={color} /><path d="M7 30L16 24L26 15L34 7" strokeDasharray="1 4" /></svg>;
    default:
      return null;
  }
}

export default function WavefrontApp() {
  const [view, setView] = useState<View>("solve");
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [activePuzzleLabel, setActivePuzzleLabel] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [solvePoints, setSolvePoints] = useState<Record<string, number>>({});
  const [progressSyncNotice, setProgressSyncNotice] = useState("");
  const [solvedLoadNotice, setSolvedLoadNotice] = useState("");
  const [trialViewedIds, setTrialViewedIds] = useState<string[]>([]);
  const [attemptedIds, setAttemptedIds] = useState<string[]>([]);
  const [adaptiveLevels, setAdaptiveLevels] = useState<Record<string, number>>(Object.fromEntries(categories.map((category) => [category.name, 1])));
  const [difficultyRatings, setDifficultyRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const [mastery, setMastery] = useState<Record<string, number>>(
    Object.fromEntries(categories.map((category) => [category.name, 0])),
  );
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [selectedPass, setSelectedPass] = useState<AccessPass>("monthly");
  const [checkoutNotice, setCheckoutNotice] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [accessUntil, setAccessUntil] = useState<string | null>(null);
  const [expiryNotice, setExpiryNotice] = useState<1 | 2 | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackKind>("general");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackNotice, setFeedbackNotice] = useState("");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState<(typeof categories)[number]["name"]>(categories[0].name);
  const [postQuestion, setPostQuestion] = useState("");
  const [postOptions, setPostOptions] = useState(["", "", "", ""]);
  const [postCorrectOption, setPostCorrectOption] = useState<number | null>(null);
  const [postExplanation, setPostExplanation] = useState("");
  const [postNotice, setPostNotice] = useState("");
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [threadComments, setThreadComments] = useState<Record<string, CommunityComment[]>>({});
  const [threadLoading, setThreadLoading] = useState<Record<string, boolean>>({});
  const [threadDrafts, setThreadDrafts] = useState<Record<string, string>>({});
  const [threadNotice, setThreadNotice] = useState<Record<string, string>>({});
  const [showCycleSubmitForm, setShowCycleSubmitForm] = useState(false);
  const [cycleSubmitTitle, setCycleSubmitTitle] = useState("");
  const [cycleSubmitCategory, setCycleSubmitCategory] = useState<(typeof categories)[number]["name"]>(categories[0].name);
  const [cycleSubmitQuestion, setCycleSubmitQuestion] = useState("");
  const [cycleSubmitOptions, setCycleSubmitOptions] = useState(["", "", "", ""]);
  const [cycleSubmitCorrectOption, setCycleSubmitCorrectOption] = useState<number | null>(null);
  const [cycleSubmitExplanation, setCycleSubmitExplanation] = useState("");
  const [cycleSubmitNotice, setCycleSubmitNotice] = useState("");
  const [adminCycleSubmissions, setAdminCycleSubmissions] = useState<CycleSubmission[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authSending, setAuthSending] = useState(false);
  const [adminPuzzles, setAdminPuzzles] = useState<AdminPuzzle[]>([]);
  const [adminMembers, setAdminMembers] = useState<AdminMember[]>([]);
  const [adminFeedback, setAdminFeedback] = useState<AdminFeedback[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSelectedId, setAdminSelectedId] = useState<string | null>(null);
  const [adminPuzzleForm, setAdminPuzzleForm] = useState<AdminPuzzleForm | null>(null);
  const [adminNotice, setAdminNotice] = useState("");
  const [cycleRewardResults, setCycleRewardResults] = useState<CycleRewardResult[] | null>(null);
  const [cycleRewardLoading, setCycleRewardLoading] = useState(false);
  const [cycleRewardNotice, setCycleRewardNotice] = useState("");
  const [contentOverrides, setContentOverrides] = useState<Record<string, Partial<Puzzle>>>({});
  const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null);
  const [dailyBriefError, setDailyBriefError] = useState(false);
  const [dailyAnswers, setDailyAnswers] = useState<Record<string, string>>({});
  const [dailyNotices, setDailyNotices] = useState<Record<string, string>>({});
  const [dailySolved, setDailySolved] = useState<Record<string, boolean>>({});
  const [dailyAttempted, setDailyAttempted] = useState<Record<string, boolean>>({});
  const [dailyChecking, setDailyChecking] = useState<string | null>(null);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [dailyPointsVersion, setDailyPointsVersion] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [streakVersion, setStreakVersion] = useState(0);
  const [weeklyActivity, setWeeklyActivity] = useState(buildEmptyWeek);
  const [weeklyChangePct, setWeeklyChangePct] = useState<number | null>(null);
  const [realLeaders, setRealLeaders] = useState<RealLeader[]>([]);
  const [leaderboardVersion, setLeaderboardVersion] = useState(0);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setAuthUser(data.session?.user ?? null);
        setAuthReady(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAuthUser(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !authUser) {
      setAccessUntil(null);
      return;
    }
    void supabase.from("puzzle_subscriptions").select("current_period_end, status").eq("user_id", authUser.id).maybeSingle().then(({ data }) => {
      setAccessUntil(data?.status === "active" ? data.current_period_end : null);
    });
  }, [authUser]);

  useEffect(() => {
    if (!supabase) return;
    void supabase.from("puzzle_catalog").select("id,payload").eq("publication_status", "published").then(({ data }) => {
      if (!data) return;
      setContentOverrides(Object.fromEntries(data.map((record) => [record.id, completePuzzlePayload(record.id, (record.payload ?? {}) as Partial<Puzzle>)])));
    });
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void supabase.rpc("puzzle_difficulty_ratings_summary").then(({ data, error }) => {
      if (error) { console.error("puzzle_difficulty_ratings_summary failed", error); return; }
      const rows = (data ?? []) as { puzzle_id: string; avg_rating: number; rating_count: number }[];
      setDifficultyRatings(Object.fromEntries(rows.map((row) => [row.puzzle_id, { avg: Number(row.avg_rating), count: row.rating_count }])));
    });
  }, [streakVersion]);

  useEffect(() => {
    if (!supabase) return;
    setPostsLoading(true);
    void (async () => {
      try {
        const { data } = await supabase
          .from("puzzle_community_posts")
          .select("id,user_id,author_name,title,category,replies,rating,status,created_at,question,options,correct_option,explanation")
          .order("created_at", { ascending: false })
          .limit(50);
        setPosts((data ?? []) as CommunityPost[]);
      } catch {
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let active = true;
    void fetch("/api/daily-brief")
      .then(async (response) => {
        if (!response.ok) throw new Error("Daily brief unavailable");
        return response.json() as Promise<DailyBrief>;
      })
      .then((brief) => {
        if (active) setDailyBrief(brief);
      })
      .catch(() => {
        if (active) setDailyBriefError(true);
      });
    return () => { active = false; };
  }, []);

  const livePuzzles = useMemo(() => launchPuzzles.map((puzzle) => ({ ...puzzle, ...(contentOverrides[puzzle.id] ?? {}) })), [contentOverrides]);

  const isAdmin = authUser?.email?.toLowerCase() === "cbaforcat2017@gmail.com";
  const hasActivePass = isAdmin || Boolean(accessUntil && new Date(accessUntil).getTime() > Date.now());

  useEffect(() => {
    if (isAdmin || !accessUntil) {
      setExpiryNotice(null);
      return;
    }
    const daysRemaining = (new Date(accessUntil).getTime() - Date.now()) / (24 * 60 * 60 * 1000);
    if (daysRemaining > 0 && daysRemaining <= 1) setExpiryNotice(1);
    else if (daysRemaining > 1 && daysRemaining <= 2) setExpiryNotice(2);
    else setExpiryNotice(null);
  }, [accessUntil, isAdmin]);

  useEffect(() => {
    if (!supabase || !authUser) {
      setStreakDays(0);
      return;
    }
    void supabase.from("puzzle_solve_scores").select("solved_at").eq("user_id", authUser.id).not("solved_at", "is", null)
      .then(({ data }) => setStreakDays(calculateStreak((data ?? []).flatMap((row) => row.solved_at ? [row.solved_at] : []))));
  }, [authUser?.id, streakVersion]);

  useEffect(() => {
    if (!supabase || !authUser) {
      setSolvedIds([]);
      setSolvedLoadNotice("");
      return;
    }
    void supabase.from("puzzle_solve_scores").select("puzzle_id").eq("user_id", authUser.id)
      .then(({ data, error }) => {
        if (error) {
          console.error("puzzle_solve_scores load failed", error);
          setSolvedLoadNotice(`Your solved puzzles could not be loaded (${error.message || error.code || "unknown error"}). Previously solved puzzles may look unsolved until this is fixed.`);
          return;
        }
        setSolvedLoadNotice("");
        // Merge rather than replace, and only load once per sign-in (not on
        // every streakVersion bump): solving already updates solvedIds
        // locally in real time, and re-fetching after every solve let two
        // overlapping requests resolve out of order, letting a slower,
        // stale response wipe out a puzzle solved moments earlier.
        const loaded = (data ?? []).map((row) => row.puzzle_id as string);
        setSolvedIds((current) => Array.from(new Set([...current, ...loaded])));
      });
  }, [authUser?.id]);

  useEffect(() => {
    if (!supabase || !authUser) {
      setTrialViewedIds([]);
      return;
    }
    void supabase.from("puzzle_trial_views").select("puzzle_id").eq("user_id", authUser.id)
      .then(({ data, error }) => {
        if (error) { console.error("puzzle_trial_views load failed", error); return; }
        const loaded = (data ?? []).map((row) => row.puzzle_id as string);
        setTrialViewedIds((current) => Array.from(new Set([...current, ...loaded])));
      });
  }, [authUser?.id]);

  useEffect(() => {
    if (!supabase || !authUser) {
      setWeeklyActivity(buildEmptyWeek());
      setWeeklyChangePct(null);
      return;
    }
    void supabase.from("puzzle_solve_scores").select("solved_at").eq("user_id", authUser.id).not("solved_at", "is", null)
      .then(({ data }) => {
        const solvedKeys = (data ?? []).flatMap((row) => (row.solved_at ? [indiaDateKey(row.solved_at)] : []));
        const dayAt = (daysAgo: number) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const dayKey = (daysAgo: number) => indiaDateKey(dayAt(daysAgo));
        const dayLabel = (daysAgo: number) => new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "narrow" }).format(dayAt(daysAgo));
        const thisWeek = Array.from({ length: 7 }, (_, index) => {
          const daysAgo = 6 - index;
          const key = dayKey(daysAgo);
          return { label: dayLabel(daysAgo), count: solvedKeys.filter((solved) => solved === key).length };
        });
        setWeeklyActivity(thisWeek);
        const priorWeekTotal = Array.from({ length: 7 }, (_, index) => dayKey(13 - index))
          .reduce((total, key) => total + solvedKeys.filter((solved) => solved === key).length, 0);
        const thisWeekTotal = thisWeek.reduce((total, day) => total + day.count, 0);
        setWeeklyChangePct(priorWeekTotal > 0 ? Math.round(((thisWeekTotal - priorWeekTotal) / priorWeekTotal) * 100) : null);
      });
  }, [authUser?.id, streakVersion]);

  useEffect(() => {
    if (!supabase || !authUser) {
      setDailyPoints(0);
      setDailySolved({});
      setDailyAttempted({});
      return;
    }
    void Promise.all([
      supabase.from("puzzle_daily_points").select("puzzle_date,difficulty,points").eq("user_id", authUser.id),
      supabase.from("puzzle_daily_attempts").select("puzzle_date,difficulty").eq("user_id", authUser.id),
    ]).then(([pointsResult, attemptsResult]) => {
      const rows = pointsResult.data ?? [];
      const today = indiaDateKey(new Date());
      setDailyPoints(rows.reduce((total, row) => total + Number(row.points ?? 0), 0));
      setDailySolved(Object.fromEntries(rows.filter((row) => row.puzzle_date === today).map((row) => [row.difficulty, true])));
      setDailyAttempted(Object.fromEntries((attemptsResult.data ?? []).filter((row) => row.puzzle_date === today).map((row) => [row.difficulty, true])));
    });
  }, [authUser?.id, dailyPointsVersion]);

  useEffect(() => {
    if (!supabase) return;
    void supabase.rpc("puzzle_leaderboard").then(({ data }) => setRealLeaders((data ?? []) as RealLeader[]));
  }, [authUser?.id, leaderboardVersion, dailyPointsVersion]);

  const fallbackAdminRecord = (puzzle: Puzzle): AdminPuzzle => ({
    id: puzzle.id, title: puzzle.title, path: categoryToPath[puzzle.category as (typeof categories)[number]["name"]],
    difficulty: puzzle.difficulty, expected_minutes: puzzle.time, access_level: "subscriber",
    publication_status: "published", payload: puzzle, updated_at: "",
  });

  useEffect(() => {
    if (!supabase || !authUser) return;
    void supabase.from("puzzle_adaptive_paths").select("category,current_difficulty").eq("user_id", authUser.id).then(({ data, error }) => {
      if (error) { console.error("puzzle_adaptive_paths load failed", error); return; }
      if (!data?.length) return;
      setAdaptiveLevels((current) => ({ ...current, ...Object.fromEntries(data.map((path) => [path.category, path.current_difficulty])) }));
    });
  }, [authUser?.id]);

  const loadAdminData = async () => {
    if (!supabase || !isAdmin) return;
    setAdminLoading(true);
    const [catalogResult, profilesResult, subscriptionsResult, feedbackResult, cycleSubmissionsResult] = await Promise.all([
      supabase.from("puzzle_catalog").select("id,title,path,difficulty,expected_minutes,access_level,publication_status,payload,updated_at").order("updated_at", { ascending: false }),
      supabase.from("puzzle_profiles").select("user_id,display_name,created_at").order("created_at", { ascending: false }),
      supabase.from("puzzle_subscriptions").select("user_id,status,current_period_end"),
      supabase.from("puzzle_feedback").select("id,user_id,puzzle_id,issue_type,rating,note,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("puzzle_cycle_submissions").select("id,user_id,author_name,title,category,question,options,correct_option,explanation,status,created_at").order("created_at", { ascending: false }),
    ]);
    if (catalogResult.data) {
      const persisted = new Map((catalogResult.data as AdminPuzzle[]).map((puzzle) => [puzzle.id, puzzle]));
      setAdminPuzzles(launchPuzzles.map((puzzle) => persisted.get(puzzle.id) ?? fallbackAdminRecord(puzzle)));
    }
    if (profilesResult.data) {
      const subscriptions = new Map((subscriptionsResult.data ?? []).map((row) => [row.user_id, { status: row.status, current_period_end: row.current_period_end }]));
      setAdminMembers(profilesResult.data.map((profile) => ({ ...profile, subscription: subscriptions.get(profile.user_id) })));
    }
    if (feedbackResult.data) setAdminFeedback(feedbackResult.data as AdminFeedback[]);
    if (cycleSubmissionsResult.data) setAdminCycleSubmissions(cycleSubmissionsResult.data as CycleSubmission[]);
    setAdminLoading(false);
  };

  useEffect(() => { void loadAdminData(); }, [authUser?.id]);

  const deleteFeedback = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm("Delete this feedback message permanently?")) return;
    const { error } = await supabase.from("puzzle_feedback").delete().eq("id", id);
    if (error) { console.error("delete feedback failed", error); return; }
    setAdminFeedback((current) => current.filter((item) => item.id !== id));
  };

  const deleteCycleSubmission = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm("Delete this cycle proposal permanently?")) return;
    const { error } = await supabase.from("puzzle_cycle_submissions").delete().eq("id", id);
    if (error) { console.error("delete cycle submission failed", error); return; }
    setAdminCycleSubmissions((current) => current.filter((item) => item.id !== id));
  };

  const setCycleSubmissionStatus = async (id: string, status: "approved" | "rejected") => {
    if (!supabase) return;
    const { error } = await supabase.from("puzzle_cycle_submissions").update({ status }).eq("id", id);
    if (error) { console.error("update cycle submission status failed", error); return; }
    setAdminCycleSubmissions((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const selectAdminPuzzle = (puzzle: AdminPuzzle) => {
    const payload = completePuzzlePayload(puzzle.id, puzzle.payload as Partial<Puzzle>);
    setAdminSelectedId(puzzle.id);
    setAdminPuzzleForm({
      title: payload.title ?? puzzle.title, category: payload.category ?? pathToCategory(puzzle.path), difficulty: payload.difficulty ?? puzzle.difficulty,
      time: payload.time ?? puzzle.expected_minutes, question: payload.question ?? "", options: [...(payload.options ?? ["", "", "", ""])],
      correctOption: payload.correctOption ?? 0, hints: [...(payload.hints ?? ["", "", ""])], explanation: payload.explanation ?? "", takeaway: payload.takeaway ?? "",
      publication_status: puzzle.publication_status === "draft" ? "draft" : "published",
    });
    setAdminNotice("");
  };

  const saveAdminPayload = async () => {
    if (!supabase || !adminSelectedId || !adminPuzzleForm) return;
    try {
      const puzzle = adminPuzzles.find((item) => item.id === adminSelectedId);
      if (!puzzle) throw new Error("Puzzle not found");
      if (!adminPuzzleForm.title.trim() || !adminPuzzleForm.question.trim() || adminPuzzleForm.options.some((option) => !option.trim()) || adminPuzzleForm.hints.some((hint) => !hint.trim()) || !adminPuzzleForm.explanation.trim()) throw new Error("Missing required fields");
      const payload = { ...(puzzle.payload ?? {}), id: puzzle.id, title: adminPuzzleForm.title.trim(), category: adminPuzzleForm.category, difficulty: adminPuzzleForm.difficulty, time: adminPuzzleForm.time, question: adminPuzzleForm.question.trim(), options: adminPuzzleForm.options.map((option) => option.trim()), correctOption: adminPuzzleForm.correctOption, hints: adminPuzzleForm.hints.map((hint) => hint.trim()), explanation: adminPuzzleForm.explanation.trim(), takeaway: adminPuzzleForm.takeaway.trim() };
      const { error } = await supabase.from("puzzle_catalog").upsert({
        id: puzzle.id, title: adminPuzzleForm.title.trim(), path: categoryToPath[adminPuzzleForm.category as (typeof categories)[number]["name"]],
        difficulty: adminPuzzleForm.difficulty, expected_minutes: adminPuzzleForm.time, access_level: puzzle.access_level,
        publication_status: adminPuzzleForm.publication_status, payload,
        published_at: adminPuzzleForm.publication_status === "published" ? new Date().toISOString() : null,
      }, { onConflict: "id" });
      if (error) throw error;
      setAdminNotice("Puzzle saved.");
      await loadAdminData();
    } catch {
      setAdminNotice("Complete the title, question, four answers, three hints, and explanation before saving.");
    }
  };

  const setAdminPublication = async (puzzle: AdminPuzzle, publication_status: "draft" | "published") => {
    if (!supabase) return;
    const { error } = await supabase.from("puzzle_catalog").upsert({
      id: puzzle.id, title: puzzle.title, path: puzzle.path, difficulty: puzzle.difficulty,
      expected_minutes: puzzle.expected_minutes, access_level: puzzle.access_level, payload: puzzle.payload,
      publication_status, published_at: publication_status === "published" ? new Date().toISOString() : null,
    }, { onConflict: "id" });
    setAdminNotice(error ? "The publication status could not be updated." : `${puzzle.title} is now ${publication_status}.`);
    if (!error) await loadAdminData();
  };

  const syncLaunchCatalog = async () => {
    if (!supabase) return;
    setAdminLoading(true);
    const rows = launchPuzzles.map((puzzle) => ({
      id: puzzle.id, title: puzzle.title, path: categoryToPath[puzzle.category as (typeof categories)[number]["name"]],
      difficulty: puzzle.difficulty, expected_minutes: puzzle.time, access_level: "subscriber", publication_status: "published", payload: puzzle,
      published_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("puzzle_catalog").upsert(rows, { onConflict: "id" });
    setAdminNotice(error ? "The catalog sync could not be completed." : `All ${launchPuzzles.length} launch puzzles are now stored in the editable catalog.`);
    await loadAdminData();
  };

  const registerCurrentCycle = async () => {
    if (!supabase) return;
    setCycleRewardLoading(true);
    setCycleRewardNotice("");
    const { error } = await supabase.rpc("admin_register_cycle", {
      p_cycle_number: currentCycle.cycleNumber,
      p_started_at: currentCycle.startedAt,
      p_puzzle_ids: launchPuzzles.map((puzzle) => puzzle.id),
    });
    setCycleRewardLoading(false);
    setCycleRewardNotice(error ? `Could not register the cycle: ${error.message}` : `Cycle ${currentCycle.cycleNumber} registered with ${launchPuzzles.length} puzzles.`);
  };

  const resetCycleLeaderboard = async () => {
    if (!supabase) return;
    const confirmed = window.confirm(
      `This closes out the previous cycle, grants rewards to eligible top-10 subscribers, and registers Cycle ${currentCycle.cycleNumber} (${launchPuzzles.length} puzzles) as current. Only do this AFTER the new roster is already merged and deployed live. Continue?`,
    );
    if (!confirmed) return;
    setCycleRewardLoading(true);
    setCycleRewardNotice("");
    const { data, error } = await supabase.rpc("admin_reset_cycle_leaderboard", {
      p_new_cycle_number: currentCycle.cycleNumber,
      p_new_cycle_started_at: currentCycle.startedAt,
      p_new_cycle_puzzle_ids: launchPuzzles.map((puzzle) => puzzle.id),
    });
    setCycleRewardLoading(false);
    if (error) {
      setCycleRewardNotice(`The reset could not be completed: ${error.message}`);
      return;
    }
    const results = (data ?? []) as CycleRewardResult[];
    setCycleRewardResults(results);
    setCycleRewardNotice(`Cycle closed. ${results.filter((row) => row.weekly_days_granted > 0).length} solver(s) rewarded.`);
  };


  // How hard a puzzle actually plays, per real subscriber feedback -- used
  // ONLY to steer the adaptive picker. A puzzle's publicly shown difficulty
  // label always stays exactly as authored; this never touches it. Falls
  // back to the authored difficulty until enough ratings exist to trust.
  const effectiveDifficultyById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const puzzle of livePuzzles) {
      const summary = difficultyRatings[puzzle.id];
      map[puzzle.id] = summary && summary.count >= MIN_RATINGS_FOR_REMAP
        ? Math.min(5, Math.max(1, Math.round(summary.avg)))
        : puzzle.difficulty;
    }
    return map;
  }, [livePuzzles, difficultyRatings]);

  // The loop advances one tier at a time across ALL 6 paths together,
  // rather than mastering one path before starting the next: whichever
  // path is furthest behind (lowest current level) is always served next,
  // so everyone works through "easy" everywhere before "tough" anywhere.
  const nextAdaptiveCategory = useMemo(() => {
    return [...categories].sort((a, b) => (adaptiveLevels[a.name] ?? 1) - (adaptiveLevels[b.name] ?? 1))[0].name;
  }, [adaptiveLevels]);

  const recommendedPuzzle = useMemo(() => {
    const unsolved = livePuzzles.filter((puzzle) => !solvedIds.includes(puzzle.id));
    const inCurrentPath = unsolved.filter((puzzle) => puzzle.category === nextAdaptiveCategory);
    const fresh = inCurrentPath.filter((puzzle) => !attemptedIds.includes(puzzle.id));
    const choices = fresh.length ? fresh : (inCurrentPath.length ? inCurrentPath : unsolved);
    const target = adaptiveLevels[nextAdaptiveCategory] ?? 1;
    return choices.sort((a, b) => Math.abs(effectiveDifficultyById[a.id] - target) - Math.abs(effectiveDifficultyById[b.id] - target))[0] ?? livePuzzles[0];
  }, [livePuzzles, solvedIds, attemptedIds, nextAdaptiveCategory, adaptiveLevels, effectiveDifficultyById]);

  const freeTrialUsedByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const puzzle of livePuzzles) {
      if (solvedIds.includes(puzzle.id) || trialViewedIds.includes(puzzle.id)) {
        counts[puzzle.category] = (counts[puzzle.category] ?? 0) + 1;
      }
    }
    return counts;
  }, [livePuzzles, solvedIds, trialViewedIds]);

  const canOpenWithoutPass = (puzzle: Puzzle) =>
    solvedIds.includes(puzzle.id) || trialViewedIds.includes(puzzle.id) ||
    (freeTrialUsedByCategory[puzzle.category] ?? 0) < FREE_TRIAL_SOLVES_PER_CATEGORY;

  const leaderboard = useMemo(() => {
    const real = realLeaders.map((player) => ({ name: player.display_name, score: Number(player.score), solved: Number(player.solved_count), streak: 0, isCurrent: player.user_id === authUser?.id }));
    return [...samplePlayers, ...real].sort((a, b) => b.score - a.score || b.solved - a.solved).map((player, index) => ({ ...player, rank: index + 1 }));
  }, [authUser?.id, realLeaders]);
  const leaders = leaderboard;

  const startPuzzle = (puzzle: Puzzle, label?: string) => {
    if (!authUser) {
      setAuthMessage(`Sign in to try ${FREE_TRIAL_SOLVES_PER_CATEGORY} free questions in every path.`);
      setShowAuth(true);
      return;
    }
    if (!hasActivePass && !canOpenWithoutPass(puzzle)) {
      setShowSubscribe(true);
      return;
    }
    if (!hasActivePass && !solvedIds.includes(puzzle.id) && !trialViewedIds.includes(puzzle.id) && supabase) {
      setTrialViewedIds((current) => [...current, puzzle.id]);
      void supabase.from("puzzle_trial_views").upsert({ user_id: authUser.id, puzzle_id: puzzle.id }, { onConflict: "user_id,puzzle_id" })
        .then(({ error }) => { if (error) console.error("puzzle_trial_views upsert failed", error); });
    }
    const alreadySolved = solvedIds.includes(puzzle.id);
    setActivePuzzle(puzzle);
    setActivePuzzleLabel(label ?? `Verified challenge ${String(livePuzzles.indexOf(puzzle) + 1).padStart(2, "0")}`);
    setSelectedOption(alreadySolved ? puzzle.correctOption : null);
    setSubmitted(alreadySolved);
    setRevealedHints(0);
    setRating(null);
    setFeedbackType("general");
    setFeedbackNote("");
    setFeedbackNotice("");
    setProgressSyncNotice("");
    setView("solve");
  };

  const submitAnswer = () => {
    if (selectedOption === null || !activePuzzle) return;
    setSubmitted(true);
    const correct = selectedOption === activePuzzle.correctOption;
    const category = activePuzzle.category as (typeof categories)[number]["name"];
    const solvedDifficulty = effectiveDifficultyById[activePuzzle.id] ?? activePuzzle.difficulty;
    const nextDifficulty = correct && revealedHints === 0 ? Math.min(5, solvedDifficulty + 1) : Math.max(1, solvedDifficulty - 1);
    setAdaptiveLevels((current) => ({ ...current, [category]: nextDifficulty }));
    setAttemptedIds((current) => current.includes(activePuzzle.id) ? current : [...current, activePuzzle.id]);
    if (supabase && authUser) {
      void supabase.from("puzzle_adaptive_paths").upsert({ user_id: authUser.id, category, current_difficulty: nextDifficulty }, { onConflict: "user_id,category" })
        .then(({ error }) => { if (error) console.error("puzzle_adaptive_paths upsert failed", error); });
    }
    if (!correct || solvedIds.includes(activePuzzle.id)) return;
    const points = Math.max(40, 100 - revealedHints * 15);
    setSolvedIds((current) => [...current, activePuzzle.id]);
    setSolvePoints((current) => ({ ...current, [activePuzzle.id]: points }));
    setMastery((current) => ({ ...current, [activePuzzle.category]: Math.min(100, (current[activePuzzle.category] ?? 0) + points) }));
    if (supabase && authUser) {
      // Restored: an earlier change stopped writing to puzzle_progress on
      // the assumption nothing read it anymore, based only on grepping this
      // repo's frontend code. That assumption was wrong -- the live
      // puzzle_leaderboard Supabase function (defined outside this repo,
      // never visible from here) most likely reads from puzzle_progress,
      // and removing the write broke real users' leaderboard scores/ranks
      // even though locking (which reads puzzle_solve_scores) kept working.
      // Write to both again until puzzle_leaderboard's actual source can be
      // confirmed.
      const asResult = (promise: PromiseLike<{ error: { message?: string; code?: string } | null }>) =>
        Promise.resolve(promise).catch((thrown): { error: { message?: string; code?: string } } => ({
          error: { message: thrown instanceof Error ? thrown.message : String(thrown) },
        }));
      void Promise.all([
        asResult(supabase.from("puzzle_progress").upsert({ user_id: authUser.id, puzzle_id: activePuzzle.id, attempts: 1, hints_used: revealedHints, solved_at: new Date().toISOString() }, { onConflict: "user_id,puzzle_id" })),
        asResult(supabase.from("puzzle_solve_scores").upsert({ user_id: authUser.id, puzzle_id: activePuzzle.id, points, solved_at: new Date().toISOString() }, { onConflict: "user_id,puzzle_id" })),
      ]).then(([progressResult, scoreResult]) => {
          if (progressResult.error) {
            console.error("puzzle_progress upsert failed", progressResult.error);
          }
          if (scoreResult.error) {
            console.error("puzzle_solve_scores upsert failed", scoreResult.error);
            setSolvedIds((current) => current.filter((id) => id !== activePuzzle.id));
            setProgressSyncNotice(`Your solve could not be saved (${scoreResult.error.message || scoreResult.error.code || "unknown error"}). Please try again.`);
          }
          setStreakVersion((version) => version + 1);
          setLeaderboardVersion((version) => version + 1);
        });
    }
  };

  const navigation: { id: View; label: string; glyph: string }[] = [
    { id: "solve", label: "Solve", glyph: "01" },
    { id: "daily", label: "Daily", glyph: "02" },
    { id: "feedback", label: "Feedback", glyph: "03" },
    { id: "paths", label: "Paths", glyph: "04" },
    { id: "tips", label: "Tips", glyph: "05" },
    { id: "leaderboard", label: "Leaderboard", glyph: "06" },
    { id: "community", label: "Community", glyph: "07" },
    { id: "archive", label: "Archive", glyph: "08" },
    ...(isAdmin ? [{ id: "admin" as View, label: "Admin", glyph: "09" }] : []),
  ];

  const changeView = (next: View) => {
    setActivePuzzle(null);
    setView(next);
  };

  const addPost = async () => {
    const cleanTitle = postTitle.trim();
    if (!cleanTitle) return;
    if (!authUser || !supabase) {
      setShowPostForm(false);
      setAuthMessage("Sign in to submit a puzzle to the community.");
      setShowAuth(true);
      return;
    }
    const cleanOptions = postOptions.map((option) => option.trim());
    const hasFullPuzzle = postQuestion.trim() && cleanOptions.every((option) => option) && postCorrectOption !== null;
    if (postQuestion.trim() && !hasFullPuzzle) {
      setPostNotice("Fill in the question, all four options, and mark the correct one -- or clear them to post without a puzzle attached.");
      return;
    }
    const { data, error } = await supabase
      .from("puzzle_community_posts")
      .insert({
        user_id: authUser.id,
        author_name: authUser.email?.split("@")[0] ?? "Solver",
        title: cleanTitle,
        category: postCategory,
        status: "pending_review",
        question: hasFullPuzzle ? postQuestion.trim() : null,
        options: hasFullPuzzle ? cleanOptions : null,
        correct_option: hasFullPuzzle ? postCorrectOption : null,
        explanation: hasFullPuzzle && postExplanation.trim() ? postExplanation.trim() : null,
      })
      .select("id,user_id,author_name,title,category,replies,rating,status,created_at,question,options,correct_option,explanation")
      .single();
    if (error || !data) {
      console.error("community post submit failed", error);
      setPostNotice(error?.message ? `Your puzzle could not be submitted: ${error.message}` : "Your puzzle could not be submitted. Please try again.");
      return;
    }
    setPosts((current) => [data as CommunityPost, ...current]);
    setPostTitle("");
    setPostQuestion("");
    setPostOptions(["", "", "", ""]);
    setPostCorrectOption(null);
    setPostExplanation("");
    setPostNotice("");
    setShowPostForm(false);
  };

  const deleteCommunityPost = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm("Delete this community post permanently?")) return;
    const { error } = await supabase.from("puzzle_community_posts").delete().eq("id", id);
    if (error) { console.error("delete community post failed", error); return; }
    setPosts((current) => current.filter((post) => post.id !== id));
  };

  const toggleThread = (postId: string) => {
    const opening = openThreadId !== postId;
    setOpenThreadId(opening ? postId : null);
    if (opening && !threadComments[postId]) {
      setThreadLoading((current) => ({ ...current, [postId]: true }));
      void supabase
        ?.from("puzzle_community_comments")
        .select("id,post_id,user_id,author_name,body,created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true })
        .then(({ data, error }) => {
          if (error) console.error("load comments failed", error);
          setThreadComments((current) => ({ ...current, [postId]: (data ?? []) as CommunityComment[] }));
          setThreadLoading((current) => ({ ...current, [postId]: false }));
        });
    }
  };

  const addComment = async (postId: string) => {
    const body = (threadDrafts[postId] ?? "").trim();
    if (!body) return;
    if (!authUser || !supabase) {
      setAuthMessage("Sign in to reply to a community puzzle.");
      setShowAuth(true);
      return;
    }
    const { data, error } = await supabase
      .from("puzzle_community_comments")
      .insert({ post_id: postId, user_id: authUser.id, author_name: authUser.email?.split("@")[0] ?? "Solver", body })
      .select("id,post_id,user_id,author_name,body,created_at")
      .single();
    if (error || !data) {
      setThreadNotice((current) => ({ ...current, [postId]: "Your reply could not be posted. Please try again." }));
      return;
    }
    const comment = data as CommunityComment;
    setThreadComments((current) => ({ ...current, [postId]: [...(current[postId] ?? []), comment] }));
    setPosts((current) => current.map((post) => (post.id === postId ? { ...post, replies: post.replies + 1 } : post)));
    setThreadDrafts((current) => ({ ...current, [postId]: "" }));
    setThreadNotice((current) => ({ ...current, [postId]: "" }));
  };

  const deleteComment = async (postId: string, commentId: string) => {
    if (!supabase) return;
    if (!window.confirm("Delete this reply permanently?")) return;
    const { error } = await supabase.from("puzzle_community_comments").delete().eq("id", commentId);
    if (error) { console.error("delete comment failed", error); return; }
    setThreadComments((current) => ({ ...current, [postId]: (current[postId] ?? []).filter((comment) => comment.id !== commentId) }));
    setPosts((current) => current.map((post) => (post.id === postId ? { ...post, replies: Math.max(0, post.replies - 1) } : post)));
  };

  const submitCyclePuzzle = async () => {
    const cleanTitle = cycleSubmitTitle.trim();
    const cleanOptions = cycleSubmitOptions.map((option) => option.trim());
    if (!authUser || !supabase) {
      setShowCycleSubmitForm(false);
      setAuthMessage("Sign in to propose a puzzle for the next cycle.");
      setShowAuth(true);
      return;
    }
    if (!cleanTitle || !cycleSubmitQuestion.trim() || !cleanOptions.every((option) => option) || cycleSubmitCorrectOption === null) {
      setCycleSubmitNotice("A cycle proposal needs a title, the question, all four options, and the correct one marked.");
      return;
    }
    const { error } = await supabase.from("puzzle_cycle_submissions").insert({
      user_id: authUser.id,
      author_name: authUser.email?.split("@")[0] ?? "Solver",
      title: cleanTitle,
      category: cycleSubmitCategory,
      question: cycleSubmitQuestion.trim(),
      options: cleanOptions,
      correct_option: cycleSubmitCorrectOption,
      explanation: cycleSubmitExplanation.trim() || null,
    });
    if (error) {
      console.error("cycle proposal submit failed", error);
      setCycleSubmitNotice(error.message ? `Your proposal could not be submitted: ${error.message}` : "Your proposal could not be submitted. Please try again.");
      return;
    }
    setCycleSubmitTitle("");
    setCycleSubmitQuestion("");
    setCycleSubmitOptions(["", "", "", ""]);
    setCycleSubmitCorrectOption(null);
    setCycleSubmitExplanation("");
    setCycleSubmitNotice("Sent to the admin for consideration in a future cycle. Thank you!");
  };

  const sendSignInCode = async () => {
    const email = authEmail.trim();
    if (!email) {
      setAuthMessage("Enter your email address first.");
      return;
    }
    if (!supabase) {
      setAuthMessage("Sign-in is being activated. Please try again shortly.");
      return;
    }

    setAuthSending(true);
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { display_name: email.split("@")[0] },
      },
    });
    setAuthSending(false);
    if (error) {
      setAuthMessage(error.message);
      return;
    }
    setAuthCodeSent(true);
    setAuthMessage("An eight-digit code has been sent. Enter it below to sign in.");
  };

  const verifySignInCode = async () => {
    const email = authEmail.trim();
    const code = authCode.trim();
    if (!/^[0-9]{8}$/.test(code)) {
      setAuthMessage("Enter the eight-digit code from your email.");
      return;
    }
    if (!supabase) {
      setAuthMessage("Sign-in is being activated. Please try again shortly.");
      return;
    }

    setAuthSending(true);
    setAuthMessage("");
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setAuthSending(false);
    if (error) {
      setAuthMessage(error.message);
      return;
    }
    setAuthMessage("Signed in. Your puzzle progress will now be saved.");
    setShowAuth(false);
  };

  const loadRazorpayCheckout = () => new Promise<boolean>((resolve) => {
    if ((window as Window & { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  const beginCheckout = async () => {
    if (!authUser) {
      setShowSubscribe(false);
      setAuthMessage("Sign in first so we can attach your pass to your account.");
      setShowAuth(true);
      return;
    }
    if (!supabase) {
      setCheckoutNotice("Payments are being activated. Please try again shortly.");
      return;
    }
    const client = supabase;

    setCheckoutLoading(true);
    setCheckoutNotice("");
    const { data, error } = await client.functions.invoke("create-puzzle-order", { body: { pass: selectedPass } });
    if (error || !data) {
      setCheckoutLoading(false);
      setCheckoutNotice(error?.message ?? "We could not start checkout. Please try again.");
      return;
    }

    const ready = await loadRazorpayCheckout();
    if (!ready) {
      setCheckoutLoading(false);
      setCheckoutNotice("Razorpay checkout could not load. Check your connection and try again.");
      return;
    }

    type RazorpayCheckout = new (options: Record<string, unknown>) => { open: () => void };
    const Razorpay = (window as unknown as Window & { Razorpay: RazorpayCheckout }).Razorpay;
    const checkout = new Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Wavefront Puzzles",
      description: data.description,
      order_id: data.orderId,
      theme: { color: "#165dff" },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const { data: verificationData, error: verificationError } = await client.functions.invoke("verify-puzzle-payment", {
          body: { ...response, pass: selectedPass },
        });
        setCheckoutLoading(false);
        if (verificationError) {
          let detail: { error?: string } | undefined;
          try {
            detail = await (verificationError as { context?: { json?: () => Promise<{ error?: string }> } }).context?.json?.();
          } catch {
            detail = undefined;
          }
          setCheckoutNotice(detail?.error ?? verificationError.message);
          return;
        }
        setAccessUntil(verificationData?.currentPeriodEnd ?? null);
        setCheckoutNotice(`${accessPasses[selectedPass].name} activated. Enjoy the puzzles.`);
      },
      modal: { ondismiss: () => setCheckoutLoading(false) },
    });
    checkout.open();
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthUser(null);
    setAccessUntil(null);
  };

  const saveDifficultyRating = async (value: number) => {
    setRating(value);
    if (!activePuzzle) return;
    if (!authUser) {
      setAuthMessage("Sign in to save your difficulty rating.");
      setShowAuth(true);
      return;
    }
    if (!supabase) return;

    const { error } = await supabase.from("puzzle_difficulty_ratings").upsert(
      { user_id: authUser.id, puzzle_id: activePuzzle.id, rating: value },
      { onConflict: "user_id,puzzle_id" },
    );
    if (error) setAuthMessage("Your rating could not be saved yet. Please try again.");
  };

  const submitFeedback = async (puzzleId = activePuzzle?.id ?? "site-feedback") => {
    if (!authUser || !supabase) {
      setFeedbackNotice("Sign in to send feedback.");
      setShowAuth(true);
      return;
    }
    const note = feedbackNote.trim();
    if (note.length < 3) {
      setFeedbackNotice("Please add a short note so we know what to improve.");
      return;
    }
    const { error } = await supabase.from("puzzle_feedback").insert({
      user_id: authUser.id, puzzle_id: puzzleId, issue_type: feedbackType, rating, note,
    });
    if (error) {
      setFeedbackNotice("Feedback could not be sent yet. Please try again.");
      return;
    }
    setFeedbackNote("");
    setFeedbackNotice("Thank you. Your feedback is now in the editor queue.");
  };

  const submitDailyAnswer = async (difficulty: string) => {
    if (!authUser) {
      setAuthMessage("Sign in to solve today’s prompts.");
      setShowAuth(true);
      return;
    }
    if (!hasActivePass) {
      setShowSubscribe(true);
      return;
    }
    if (!supabase) return;
    const answer = dailyAnswers[difficulty]?.trim();
    if (!answer) {
      setDailyNotices((current) => ({ ...current, [difficulty]: "Enter an answer first." }));
      return;
    }
    setDailyChecking(difficulty);
    const { data, error } = await supabase.functions.invoke("solve-daily-puzzle", { body: { difficulty, answer } });
    setDailyChecking(null);
    if (error) {
      let message = "That answer could not be checked. Please try once more.";
      try {
        const detail = await (error as { context?: { json?: () => Promise<{ error?: string }> } }).context?.json?.();
        if (detail?.error) message = detail.error;
      } catch {
        // The generic message remains useful when the function response is unavailable.
      }
      setDailyNotices((current) => ({ ...current, [difficulty]: message }));
      return;
    }
    setDailyNotices((current) => ({ ...current, [difficulty]: data?.message ?? "Answer checked." }));
    if (data?.attempted || data?.alreadyAttempted) {
      setDailyAttempted((current) => ({ ...current, [difficulty]: true }));
    }
    if (data?.correct) {
      setDailySolved((current) => ({ ...current, [difficulty]: true }));
      setDailyPointsVersion((version) => version + 1);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={() => changeView("solve")}>
          <AppMark />
          <span className="brand-copy"><strong>Wavefront</strong><small>Puzzles</small></span>
        </button>
        <div className="topbar-actions">
          <a className="daily-link" href="https://wavefrontdaily.in" target="_blank" rel="noreferrer">
            Read Wavefront Daily <span aria-hidden="true">↗</span>
          </a>
          <div className={streakDays >= 7 ? "streak-pill streak-goal" : "streak-pill"} title="Consecutive days with at least one correct solve">
            <span className="streak-dot" /><strong>{streakDays}</strong> day streak
          </div>
          <button
            className="subscribe-button"
            onClick={() => setShowSubscribe(true)}
            title={accessUntil && new Date(accessUntil).getTime() > Date.now() ? `Full access until ${new Date(accessUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : undefined}
          >
            {isAdmin
              ? "Admin access"
              : accessUntil && new Date(accessUntil).getTime() > Date.now()
                ? `Active till ${new Date(accessUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                : "Get full access"}
          </button>
          {authUser ? (
            <button className="account-button" onClick={signOut} title="Sign out">
              <span>{authUser.email?.slice(0, 2).toUpperCase() ?? "ME"}</span>
              <small>Sign out</small>
            </button>
          ) : (
            <button className="avatar-button" onClick={() => setShowAuth(true)} title="Sign in" aria-label="Sign in">
              {authReady ? "IN" : "..."}
            </button>
          )}
        </div>
      </header>

      <aside className="sidebar">
        <nav aria-label="Primary">
          {navigation.map((item) => (
            <button className={view === item.id && !activePuzzle ? "nav-item active" : "nav-item"} key={item.id} onClick={() => changeView(item.id)}>
              <span className="nav-glyph">{item.glyph}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-release">
          <span className="release-kicker">Cycle {currentCycle.cycleNumber}</span>
          <strong>Fresh puzzles</strong>
          <span>{daysUntilNextRotation() <= 0 ? "New roster due now" : `Next wave in ${daysUntilNextRotation()} day${daysUntilNextRotation() === 1 ? "" : "s"}`}</span>
          <div className="mini-progress"><span style={{ width: `${rotationProgress()}%` }} /></div>
        </div>
      </aside>

      <main className="main-content">
        {activePuzzle ? (
          <section className="solver-view" aria-live="polite">
            <button className="back-button" onClick={() => setActivePuzzle(null)}><span aria-hidden="true">←</span> Back to your set</button>
            <div className="solver-grid">
              <article className="puzzle-stage">
                <div className="puzzle-meta">
                  <span>{activePuzzle.category}</span><i /><span>{difficultyLabel(activePuzzle.difficulty)}</span><i /><span>{activePuzzle.time} min</span>
                </div>
                <div className="puzzle-number">{activePuzzleLabel}</div>
                <h1>{activePuzzle.title}</h1>
                <p className="question-copy">{activePuzzle.question}</p>
                <div className="answer-list">
                  {activePuzzle.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrect = submitted && index === activePuzzle.correctOption;
                    const isWrong = submitted && isSelected && index !== activePuzzle.correctOption;
                    return (
                      <button
                        className={`answer-option${isSelected ? " selected" : ""}${isCorrect ? " correct" : ""}${isWrong ? " wrong" : ""}`}
                        key={option}
                        onClick={() => !submitted && setSelectedOption(index)}
                        disabled={submitted}
                      >
                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                        <span>{option}</span>
                        {isCorrect && <strong className="answer-status">Correct</strong>}
                        {isWrong && <strong className="answer-status">Your answer</strong>}
                      </button>
                    );
                  })}
                </div>
                {!submitted ? (
                  <button className="primary-action" onClick={submitAnswer} disabled={selectedOption === null}>
                    Check answer <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <div className={`result-panel ${selectedOption === activePuzzle.correctOption ? "success" : "retry"}`}>
                    <span className="result-label">{selectedOption === activePuzzle.correctOption ? "Strong solve" : "Useful miss"}</span>
                    <h2>{selectedOption === activePuzzle.correctOption ? "You found the right path." : `The answer is ${activePuzzle.options[activePuzzle.correctOption]}.`}</h2>
                    <p>{activePuzzle.explanation}</p>
                    {progressSyncNotice && <small className="daily-notice">{progressSyncNotice}</small>}
                    <div className="takeaway"><strong>Pattern to keep</strong><span>{activePuzzle.takeaway}</span></div>
                    <div className="rating-row">
                      <span>Rate the assigned difficulty</span>
                      <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button aria-label={`Difficulty ${value} out of 5`} className={rating === value ? "rating active" : "rating"} key={value} onClick={() => void saveDifficultyRating(value)}>{value}</button>
                        ))}
                      </div>
                    </div>
                    <div className="feedback-box">
                      <strong>Help improve this puzzle</strong>
                      <div className="feedback-fields">
                        <select aria-label="Feedback type" value={feedbackType} onChange={(event) => setFeedbackType(event.target.value as FeedbackKind)}>
                          <option value="general">General feedback</option><option value="unclear">Something was unclear</option><option value="incorrect">Possible solution issue</option><option value="difficulty">Difficulty felt off</option><option value="suggestion">Suggestion</option>
                        </select>
                        <textarea value={feedbackNote} onChange={(event) => setFeedbackNote(event.target.value)} placeholder="What should we improve?" maxLength={3000} />
                      </div>
                      <button className="feedback-send" onClick={() => void submitFeedback()}>Send feedback</button>
                      {feedbackNotice && <small className="feedback-notice">{feedbackNotice}</small>}
                    </div>
                    <button className="next-action" onClick={() => startPuzzle(recommendedPuzzle)}>Next adaptive puzzle <span aria-hidden="true">→</span></button>
                  </div>
                )}
              </article>

              <aside className="hint-rail">
                <div className="verification-stamp">
                  <span className="verification-check">✓</span>
                  <div><strong>Solution verified</strong><small>{activePuzzle.verification.method}</small></div>
                </div>
                <div className="hint-heading"><span>Hint ladder</span><strong>{revealedHints}/3</strong></div>
                {activePuzzle.hints.map((hint, index) => {
                  const revealed = index < revealedHints;
                  const labels = ["Nudge", "Direction", "Unlock"];
                  return (
                    <div className={revealed ? "hint-step revealed" : "hint-step"} key={labels[index]}>
                      <div className="hint-index">{index + 1}</div>
                      <div>
                        <strong>{labels[index]}</strong>
                        {revealed ? <p>{hint}</p> : index === revealedHints && !submitted ? (
                          <button onClick={() => setRevealedHints((count) => Math.min(3, count + 1))}>Reveal hint</button>
                        ) : <span className="locked-hint">Available next</span>}
                      </div>
                    </div>
                  );
                })}
                <div className="hint-cost"><span>Hint-adjusted score</span><strong>{Math.max(40, 100 - revealedHints * 15)} pts</strong></div>
              </aside>
            </div>
          </section>
        ) : view === "solve" ? (
          <section className="dashboard-view">
            <div className="welcome-row">
              <div><span className="eyebrow">A fresh, verified roster every two weeks</span><h1>Keep your mind in motion.</h1><p>Choose one challenge at a time in Solve. Your score grows only from correct solves.</p></div>
              <div className="stat-strip" aria-label="Your performance">
                <div title="Correct solves divided by attempts, this session"><strong>{attemptedIds.length ? `${Math.round((solvedIds.length / attemptedIds.length) * 100)}%` : "-"}</strong><span>Accuracy</span></div>
                <div><strong>{solvedIds.length}</strong><span>Solved</span></div>
                <div><strong>{authUser ? `#${leaderboard.find((player) => "isCurrent" in player)?.rank ?? "-"}` : "-"}</strong><span>Rank</span></div>
              </div>
            </div>
            <div className="adaptive-feature">
              <div className="feature-copy">
                <span className="feature-kicker">Your next challenge</span>
                <h2>{recommendedPuzzle.title}</h2>
                <p>{recommendedPuzzle.category} · {difficultyLabel(recommendedPuzzle.difficulty)} · {recommendedPuzzle.time} min</p>
                <button onClick={() => startPuzzle(recommendedPuzzle)}>Start solving <span aria-hidden="true">→</span></button>
              </div>
              <SignalField />
              <div className="feature-score"><span>Next level</span><strong>{adaptiveLevels[recommendedPuzzle.category] ?? 1}/5</strong></div>
            </div>
            <div className="lower-grid">
              <section className="activity-panel">
                <div className="section-heading compact"><div><span className="eyebrow">This week</span><h2>Reasoning rhythm</h2></div>{weeklyChangePct !== null && <strong>{weeklyChangePct >= 0 ? "+" : ""}{weeklyChangePct}%</strong>}</div>
                {authUser ? (
                  <div className="rhythm-chart" aria-label="Seven-day puzzle activity">
                    {weeklyActivity.map((day, index) => {
                      const maxCount = Math.max(1, ...weeklyActivity.map((entry) => entry.count));
                      return <div key={index}><span style={{ height: `${Math.round((day.count / maxCount) * 100)}%` }} /><small title={`${day.count} solved`}>{day.label}</small></div>;
                    })}
                  </div>
                ) : (
                  <p className="tips-error">Sign in to see your own solving rhythm.</p>
                )}
              </section>
              <section className="community-preview">
                <div className="section-heading compact"><div><span className="eyebrow">Community signal</span><h2>Latest from the community</h2></div><button className="text-action" onClick={() => setView("community")}>Open forum →</button></div>
                {posts.slice(0, 2).map((post) => (
                  <button className="discussion-row" key={post.id} onClick={() => setView("community")}>
                    <span className="discussion-avatar">{post.author_name.slice(0, 2).toUpperCase()}</span>
                    <span className="discussion-copy"><strong>{post.title}</strong><small>{post.replies} replies · {post.rating ?? "New"} rating</small></span>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </section>
            </div>
          </section>
        ) : view === "daily" ? (
          <section className="standard-view daily-view">
            <div className="page-heading split">
              <div><span className="eyebrow">Live from Wavefront Daily</span><h1>Today&apos;s thinking break</h1><p>Three fresh prompts from today&apos;s edition. Solve here to earn points, then explore the brief for context.</p></div>
              <a className="daily-open-link" href="https://wavefrontdaily.in" target="_blank" rel="noreferrer">Open today&apos;s brief <span aria-hidden="true">→</span></a>
            </div>
            {dailyBrief?.date && <p className="daily-date">Edition for {new Date(`${dailyBrief.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>}
            {dailyBrief?.puzzles.length ? <div className="daily-puzzle-grid">{dailyBrief.puzzles.map((puzzle, index) => {
              const reward = puzzle.difficulty === "easy" ? 20 : puzzle.difficulty === "moderate" ? 50 : 100;
              const solved = dailySolved[puzzle.difficulty];
              const attempted = dailyAttempted[puzzle.difficulty];
              const canSolve = puzzle.verified !== false;
              return <article className={`daily-puzzle-card daily-${puzzle.difficulty.toLowerCase()}`} key={`${puzzle.label}-${index}`}><span>{puzzle.label}</span><strong>{String(index + 1).padStart(2, "0")} · {reward} pts</strong><p>{puzzle.question}</p>{!canSolve ? <div className="daily-review"><strong>Verification in progress</strong><small>This prompt is visible, but scoring is paused until its solution passes the quality check.</small></div> : hasActivePass ? <div className="daily-answer"><input aria-label={`Answer for ${puzzle.label}`} value={dailyAnswers[puzzle.difficulty] ?? ""} onChange={(event) => setDailyAnswers((current) => ({ ...current, [puzzle.difficulty]: event.target.value }))} disabled={attempted} placeholder={attempted ? "Answer checked" : "Your answer"} /><button disabled={attempted || dailyChecking === puzzle.difficulty} onClick={() => void submitDailyAnswer(puzzle.difficulty)}>{solved ? "Points earned" : attempted ? "Solution revealed" : dailyChecking === puzzle.difficulty ? "Checking..." : `Check for ${reward} pts`}</button>{dailyNotices[puzzle.difficulty] && <small className={solved ? "daily-notice success" : "daily-notice"}>{dailyNotices[puzzle.difficulty]}</small>}{attempted && <p className="daily-explanation"><strong>Solution</strong>{puzzle.explanation}</p>}</div> : <button className="daily-unlock" onClick={() => setShowSubscribe(true)}>Unlock daily solve · {reward} pts</button>}<a href="https://wavefrontdaily.in" target="_blank" rel="noreferrer">Read today&apos;s brief <span aria-hidden="true">→</span></a></article>;
            })}</div> : <div className="daily-empty"><strong>{dailyBriefError ? "Today's feed is taking a short break." : "Loading today's puzzles..."}</strong><p>Wavefront Daily will have the newest prompts ready shortly.</p><a href="https://wavefrontdaily.in" target="_blank" rel="noreferrer">Visit Wavefront Daily <span aria-hidden="true">→</span></a></div>}
            <section className="daily-note"><span className="eyebrow">Daily score</span><h2>Your Daily points count on this leaderboard.</h2><p>Easy, moderate, and tough prompts award 20, 50, and 100 points. Each can be earned once per day, and only after a correct subscriber solve.</p></section>
          </section>
        ) : view === "paths" ? (
          <section className="standard-view">
            <div className="page-heading"><span className="eyebrow">Choose your own starting point</span><h1>Explore the paths</h1><p>{hasActivePass ? "Pick any challenge from any section. Each solved block guides your next recommended challenge, but you are always free to explore." : `Try ${FREE_TRIAL_SOLVES_PER_CATEGORY} questions free in every path, picked for you the same way a subscriber's next challenge is. Solve those and subscribe to keep going.`}</p></div>
            {solvedLoadNotice && <p className="tips-error">{solvedLoadNotice}</p>}
            <div className="path-list">
              {categories.map((category, categoryIndex) => {
                const categoryPuzzles = livePuzzles.filter((puzzle) => puzzle.category === category.name);
                return (
                  <section className="path-row" key={category.name}>
                    <div className={`path-code large ${category.color}`}>{category.code}</div>
                    <div className="path-row-title">
                      <span>Path {String(categoryIndex + 1).padStart(2, "0")}</span><h2>{category.name}</h2>
                      <div className="path-progress"><span style={{ width: `${mastery[category.name]}%` }} /></div><small>{mastery[category.name]}% mastery</small>
                    </div>
                    <div className="path-puzzles">
                      {categoryPuzzles.map((puzzle, index) => {
                        const solved = solvedIds.includes(puzzle.id);
                        const locked = !hasActivePass && !canOpenWithoutPass(puzzle);
                        return (
                          <button type="button" className={locked ? "locked" : ""} key={puzzle.id} onClick={() => startPuzzle(puzzle)}>
                            <span className={solved ? "puzzle-dot solved" : locked ? "puzzle-dot locked" : "puzzle-dot"}>{solved ? "✓" : locked ? "🔒" : index + 1}</span>
                            <span><strong>{puzzle.title}</strong><small>{locked ? "Subscribe to unlock" : `${difficultyLabel(puzzle.difficulty)} · ${puzzle.time} min`}</small></span><span aria-hidden="true">→</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        ) : view === "tips" ? (
          <section className="standard-view tips-view">
            <div className="page-heading split"><div><span className="eyebrow">Members learning library</span><h1>Methods that travel</h1><p>Short, reusable techniques drawn from the puzzle paths. Updated as new releases arrive.</p></div>{!hasActivePass && <button className="subscribe-button" onClick={() => setShowSubscribe(true)}>Unlock learning library</button>}</div>
            {hasActivePass ? <div className="tips-library">{categories.map((category) => { const pathTips = learningTips.filter((tip) => tip.category === category.name); return <section className="tips-chapter" key={category.name}><div><span className={`path-code ${category.color}`}>{category.code}</span><TipIcon code={category.code} color={`var(--${category.color})`} /><h2>{category.name}</h2><p>{pathTips.length} reusable methods</p></div><div className="tips-grid">{pathTips.map((tip) => <article className="tip-card" key={tip.id}><h3>{tip.title}</h3><p>{tip.body}</p></article>)}</div></section>; })}</div> : <section className="tips-locked"><span className="eyebrow">Subscriber access</span><h2>Build a toolkit, not just a score.</h2><p>Members can use the complete, growing tips library across logic, maths, strategy, algorithms, spatial reasoning, and patterns.</p><button className="checkout-button" onClick={() => setShowSubscribe(true)}>Get full access <span aria-hidden="true">→</span></button></section>}
            {hasActivePass && <section className="tips-workshop"><div className="page-heading"><span className="eyebrow">Worked examples</span><h2>See each method used once.</h2><p>Use these tiny examples as a warm-up, then carry the same move into the full puzzles.</p></div><div className="tips-workshop-grid"><article><span>Logic</span><h3>Use the reverse check</h3><p><b>If A then B.</b> If B is false, A cannot be true. This is the fastest way to remove an impossible option.</p><code>A → B · not B → not A</code></article><article><span>Logic</span><h3>Fill forced slots first</h3><p>If A cannot be seat 1 and B must be seat 1, A must take one of the remaining seats. Write forced facts before guessing.</p><code>B = 1 · A ≠ 1</code></article><article><span>Logic</span><h3>Split into every case</h3><p>If a source might answer truthfully, falsely, or randomly, check what your conclusion means in each of those cases, not just the likely one.</p><code>case 1 · case 2 → same answer</code></article><article><span>Maths</span><h3>Make percentages small</h3><p>Thirty percent of 80 is three groups of eight. Turn a percentage into a friendlier multiplication.</p><code>30% of 80 = 3 × 8 = 24</code></article><article><span>Maths</span><h3>Undo the change</h3><p>After a 20% discount, 80 is only 80% of the original price. Divide by 0.8 to travel backwards.</p><code>80 ÷ 0.8 = 100</code></article><article><span>Maths</span><h3>Turn work into a rate</h3><p>A pipe that fills a tank in 6 hours does 1/6 of the tank every hour. Add hourly rates together, then invert the total to find combined time.</p><code>1/6 + 1/3 = 1/2 → 2 h</code></article><article><span>Strategy</span><h3>Count equal cases</h3><p>With three equally likely doors, one hides the prize and two do not. Count the outcomes before trusting intuition.</p><code>1 win / 3 cases</code></article><article><span>Strategy</span><h3>Use new information</h3><p>When one losing door opens, do not forget the host gave information. Recalculate instead of treating the choice as fresh.</p><code>switch = 2 winning cases</code></article><article><span>Strategy</span><h3>Weight the branches</h3><p>When an outcome depends on how likely each scenario really is, multiply every payoff by its own probability before comparing totals.</p><code>0.99 × big ≫ 0.01 × small</code></article><article><span>Algorithms</span><h3>Look at the gaps</h3><p>The sequence 1, 3, 6, 10 has gaps of 2, 3, and 4. The next gap is 5, so the next term is 15.</p><code>+2 · +3 · +4 · +5</code></article><article><span>Algorithms</span><h3>Keep the invariant</h3><p>On a chequerboard, every domino covers one light and one dark square. If unequal colours remain, tiling is impossible.</p><code>light = dark is required</code></article><article><span>Algorithms</span><h3>Split into three, not two</h3><p>A balance scale gives three answers: left, right, or even. Split candidates into three even groups so every answer removes useful ground.</p><code>3 groups → 2 weighings find 1 of 8</code></article><article><span>Spatial</span><h3>Anchor one corner</h3><p>Before rotating a shape, mark its top-left corner in your mind. Track that anchor rather than trying to rotate everything at once.</p><code>anchor → rotate → compare</code></article><article><span>Spatial</span><h3>Count by position</h3><p>For a painted cube, corner cubes, edge cubes, and face cubes have different numbers of painted sides. Count each group separately.</p><code>corners · edges · faces</code></article><article><span>Spatial</span><h3>Unroll the curve</h3><p>A shortest path across a curved surface, like a cylinder, becomes an ordinary straight line once you unroll that surface flat.</p><code>unroll → straight line → Pythagoras</code></article><article><span>Patterns</span><h3>Make a difference table</h3><p>For 2, 6, 12, 20, the gaps are 4, 6, 8. The next gap is 10, so the next number is 30.</p><code>2 → 6 → 12 → 20 → 30</code></article><article><span>Patterns</span><h3>Test tiny inputs</h3><p>When a rule uses n, try n = 1, 2, and 3. Small examples reveal whether the rule really holds.</p><code>test → compare → generalise</code></article><article><span>Patterns</span><h3>Check the step sizes</h3><p>If a sequence is not a simple sum or product, list what is added at each step. Those step sizes can form their own easy pattern.</p><code>+2 +3 +4 +5 +6 → next +7</code></article></div></section>}
          </section>
        ) : view === "leaderboard" ? (
          <section className="standard-view">
            <div className="page-heading split">
              <div><span className="eyebrow">Cycle {currentCycle.cycleNumber}</span><h1>Leaderboard</h1><p>Verified solves, accuracy, and hint efficiency.</p></div>
              <div className="rank-callout"><span>{authUser ? "Your position in this board" : "Current board"}</span><strong>{authUser ? `#${leaderboard.find((player) => "isCurrent" in player)?.rank ?? "-"}` : samplePlayers.length}</strong><small>{authUser ? `among ${leaderboard.length} listed solvers` : "20 seeded solvers"}</small></div>
            </div>
            <div className="podium">
              {[leaders[1], leaders[0], leaders[2]].map((leader, index) => (
                <div className={`podium-place place-${index}`} key={leader.name}>
                  <span className="podium-medal" aria-hidden="true">{["🥈", "🥇", "🥉"][index]}</span>
                  <span className="podium-avatar">{leader.name.split(" ").map((part) => part[0]).join("")}</span>
                  <strong>{leader.name}</strong><span>{leader.score.toLocaleString()} pts</span><div>{leader.rank}</div>
                </div>
              ))}
            </div>
            <div className="leader-table">
              <div className="leader-head"><span>Rank</span><span>Solver</span><span>Solved</span><span>Streak</span><span>Score</span></div>
              {leaders.map((leader) => (
                <div className={leader.name === "You" ? "leader-row you" : "leader-row"} key={leader.name}>
                  <strong>#{leader.rank}</strong>
                  <span className="leader-person"><span>{leader.name.slice(0, 2).toUpperCase()}</span><strong>{leader.name}</strong></span>
                  <span>{leader.solved}</span><span>{leader.streak} days</span><strong>{leader.score.toLocaleString()}</strong>
                </div>
              ))}
            </div>
            <details className="rules-disclosure">
              <summary>How scoring &amp; rewards work</summary>
              <div className="rules-disclosure-body">
                <div>
                  <span>Scoring</span>
                  <p>Your score for Cycle {currentCycle.cycleNumber} is Daily puzzle points plus every correct solve from this cycle&apos;s current 90-puzzle roster. Daily easy, moderate, and tough prompts award 20, 50, and 100 points, once each per day. Puzzles from a retired, archived cycle never add to a live cycle&apos;s score.</p>
                </div>
                <div>
                  <span>Weekly reward</span>
                  <p>When a cycle closes, the top 10 solvers who hold an active pass at that moment each get +7 days of access, stacked on top of whatever access they already have. Ranking well without an active pass earns a spot on the board, not the reward.</p>
                </div>
                <div>
                  <span>Long-streak bonus</span>
                  <p>Land in the top 10 for 6 cycles in a row (while subscribed each time) and you get +1 year of access on top of the weekly rewards already earned. Miss the top 10, or let your pass lapse for a cycle, and the streak resets — the next bonus after that then needs 12 cycles in a row, then 18, and so on.</p>
                </div>
              </div>
              <p className="rules-disclosure-foot">Rewards apply only to subscribers with an active pass when a cycle closes. A fresh 90-puzzle roster rotates in every two weeks.</p>
            </details>
          </section>
        ) : view === "feedback" ? (
          <section className="standard-view feedback-view">
            <div className="page-heading"><span className="eyebrow">Direct line to the editor</span><h1>Help improve Wavefront</h1><p>Flag an unclear question, a solution concern, a difficulty mismatch, or a site idea. Puzzle-specific feedback is also available after every solved challenge.</p></div>
            <div className="feedback-box feedback-page-box">
              <strong>What would you like to share?</strong>
              <div className="feedback-fields"><select aria-label="Feedback type" value={feedbackType} onChange={(event) => setFeedbackType(event.target.value as FeedbackKind)}><option value="general">General feedback</option><option value="unclear">Something was unclear</option><option value="incorrect">Possible solution issue</option><option value="difficulty">Difficulty felt off</option><option value="suggestion">Suggestion</option></select><textarea value={feedbackNote} onChange={(event) => setFeedbackNote(event.target.value)} placeholder="Tell us what you noticed or what would make the experience better." maxLength={3000} /></div>
              <button className="primary-action small" onClick={() => void submitFeedback("site-feedback")}>Send feedback</button>
              {feedbackNotice && <small className="feedback-notice">{feedbackNotice}</small>}
            </div>
          </section>
        ) : view === "admin" ? (
          <section className="admin-view">
            <div className="page-heading split">
              <div><span className="eyebrow">Owner console</span><h1>Publishing control</h1><p>Review puzzle content, release status, and member access from one place.</p></div>
              <div className="admin-toolbar"><button className="text-action" onClick={() => void syncLaunchCatalog()} disabled={adminLoading}>Store all {launchPuzzles.length} puzzles</button><button className="text-action" onClick={() => void loadAdminData()} disabled={adminLoading}>{adminLoading ? "Refreshing..." : "Refresh data"}</button></div>
            </div>
            <div className="admin-stats">
              <div><strong>{adminPuzzles.length}</strong><span>catalog puzzles</span></div>
              <div><strong>{adminPuzzles.filter((puzzle) => puzzle.publication_status === "published").length}</strong><span>published</span></div>
              <div><strong>{adminMembers.filter((member) => member.subscription?.status === "active").length}</strong><span>active passes</span></div>
            </div>
            <div className="admin-grid">
              <section className="admin-panel">
                <div className="admin-panel-heading"><div><span className="eyebrow">Puzzle catalog</span><h2>Edit and publish</h2></div><span>{adminPuzzles.length} of {launchPuzzles.length} editable</span></div>
                <div className="admin-list">
                  {adminPuzzles.map((puzzle) => (
                    <button className={adminSelectedId === puzzle.id ? "admin-row selected" : "admin-row"} key={puzzle.id} onClick={() => selectAdminPuzzle(puzzle)}>
                      <span><strong>{puzzle.title}</strong><small>{puzzle.path.replaceAll("-", " ")} · difficulty {puzzle.difficulty}</small></span>
                      <em className={puzzle.publication_status === "published" ? "status-live" : "status-draft"}>{puzzle.publication_status}</em>
                    </button>
                  ))}
                </div>
              </section>
              <section className="admin-panel editor-panel">
                <div className="admin-panel-heading"><div><span className="eyebrow">Content editor</span><h2>{adminSelectedId ? adminPuzzles.find((puzzle) => puzzle.id === adminSelectedId)?.title : "Select a puzzle"}</h2></div></div>
                {adminSelectedId && adminPuzzleForm ? <div className="content-form">
                  <label>Title<input value={adminPuzzleForm.title} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, title: event.target.value })} /></label>
                  <div className="content-form-row"><label>Path<select value={adminPuzzleForm.category} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, category: event.target.value })}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label><label>Difficulty<select value={adminPuzzleForm.difficulty} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, difficulty: Number(event.target.value) })}>{[1, 2, 3, 4, 5].map((level) => <option value={level} key={level}>Level {level}</option>)}</select></label><label>Minutes<input type="number" min="1" max="180" value={adminPuzzleForm.time} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, time: Number(event.target.value) })} /></label></div>
                  <label>Question<textarea value={adminPuzzleForm.question} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, question: event.target.value })} /></label>
                  <fieldset><legend>Answer options</legend>{adminPuzzleForm.options.map((option, index) => <label className="option-edit" key={index}><input type="radio" name="correct-answer" checked={adminPuzzleForm.correctOption === index} onChange={() => setAdminPuzzleForm({ ...adminPuzzleForm, correctOption: index })} /><input value={option} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, options: adminPuzzleForm.options.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} placeholder={`Option ${index + 1}`} /></label>)}</fieldset>
                  <fieldset><legend>Hints in order</legend>{adminPuzzleForm.hints.map((hint, index) => <label key={index}>Hint {index + 1}<textarea value={hint} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, hints: adminPuzzleForm.hints.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} /></label>)}</fieldset>
                  <label>Explanation<textarea value={adminPuzzleForm.explanation} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, explanation: event.target.value })} /></label><label>Pattern tip / takeaway<textarea value={adminPuzzleForm.takeaway} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, takeaway: event.target.value })} /></label>
                  <div className="content-form-row"><label>Publication<select value={adminPuzzleForm.publication_status} onChange={(event) => setAdminPuzzleForm({ ...adminPuzzleForm, publication_status: event.target.value as "draft" | "published" })}><option value="draft">Draft</option><option value="published">Published</option></select></label><button className="primary-action small" onClick={() => void saveAdminPayload()}>Save puzzle</button></div>
                </div> : <p className="admin-empty">Choose a catalog record to edit its content.</p>}
                {adminNotice && <p className="admin-notice">{adminNotice}</p>}
              </section>
            </div>
            <section className="admin-panel member-panel">
              <div className="admin-panel-heading"><div><span className="eyebrow">Learning library</span><h2>Tips now live in the codebase</h2></div><span>{learningTips.length} tips across {categories.length} paths</span></div>
              <p className="admin-empty">Tips moved from Supabase to <code>app/data/tips.ts</code> so the Tips page can never fail to load. To add or edit a tip, describe the change and it ships through a PR, same as puzzle rotation.</p>
              <div className="admin-list">{learningTips.map((tip) => <article className="admin-feedback" key={tip.id}><strong>{tip.title} <small>· {tip.category}</small></strong><p>{tip.body}</p></article>)}</div>
            </section>
            <section className="admin-panel member-panel">
              <div className="admin-panel-heading"><div><span className="eyebrow">Subscribers</span><h2>Access overview</h2></div><span>{adminMembers.length} signed-in members</span></div>
              <div className="member-table"><div className="member-head"><span>Member</span><span>Joined</span><span>Access</span><span>Pass ends</span></div>{adminMembers.map((member) => <div className="member-row" key={member.user_id}><span><strong>{member.display_name}</strong><small>{member.user_id.slice(0, 8)}</small></span><span>{new Date(member.created_at).toLocaleDateString("en-IN")}</span><span>{member.subscription?.status ?? "inactive"}</span><span>{member.subscription?.current_period_end ? new Date(member.subscription.current_period_end).toLocaleDateString("en-IN") : "-"}</span></div>)}</div>
            </section>
            <section className="admin-panel member-panel">
              <div className="admin-panel-heading"><div><span className="eyebrow">Feedback inbox</span><h2>What solvers are telling you</h2></div><span>{adminFeedback.length} recent messages</span></div>
              <div className="admin-list">{adminFeedback.length ? adminFeedback.map((item) => <article className="admin-feedback" key={item.id}><strong>{item.issue_type} {item.rating ? `· ${item.rating}/5` : ""}</strong><p>{item.note}</p><small>{item.puzzle_id === "site-feedback" ? "Site feedback" : item.puzzle_id} · {new Date(item.created_at).toLocaleDateString("en-IN")}</small><button className="forum-delete" aria-label="Delete feedback" onClick={() => void deleteFeedback(item.id)}>🗑</button></article>) : <p className="admin-empty">No feedback has arrived yet.</p>}</div>
            </section>
            <section className="admin-panel member-panel">
              <div className="admin-panel-heading"><div><span className="eyebrow">Cycle proposals</span><h2>Puzzles submitted for a future roster</h2></div><span>{adminCycleSubmissions.length} proposals · admin-only</span></div>
              <div className="admin-list">
                {adminCycleSubmissions.length ? adminCycleSubmissions.map((item) => (
                  <article className="admin-feedback" key={item.id}>
                    <strong>{item.title} <small>· {item.category} · {item.status}</small></strong>
                    <p>{item.question}</p>
                    <ul className="cycle-proposal-options">
                      {item.options.map((option, index) => <li key={index} className={index === item.correct_option ? "correct" : ""}>{option}</li>)}
                    </ul>
                    {item.explanation && <p>{item.explanation}</p>}
                    <small>{item.author_name} · {new Date(item.created_at).toLocaleDateString("en-IN")}</small>
                    <div className="admin-toolbar">
                      <button className="text-action" onClick={() => void setCycleSubmissionStatus(item.id, "approved")} disabled={item.status === "approved"}>Mark approved</button>
                      <button className="text-action" onClick={() => void setCycleSubmissionStatus(item.id, "rejected")} disabled={item.status === "rejected"}>Mark rejected</button>
                      <button className="forum-delete" aria-label="Delete proposal" onClick={() => void deleteCycleSubmission(item.id)}>🗑</button>
                    </div>
                  </article>
                )) : <p className="admin-empty">No puzzles have been proposed for a future cycle yet.</p>}
              </div>
            </section>
            <section className="admin-panel member-panel">
              <div className="admin-panel-heading"><div><span className="eyebrow">Cycle rewards</span><h2>Leaderboard reset &amp; top-10 grants</h2></div><span>Cycle {currentCycle.cycleNumber}</span></div>
              <p className="admin-empty">The very first time, click &quot;Register current cycle&quot; to bootstrap Cycle {currentCycle.cycleNumber} in the rewards system. From the next rotation onward, only after a new roster has been merged and deployed live, click &quot;Close cycle &amp; apply rewards&quot; to score the outgoing cycle, grant +7 days to eligible top-10 subscribers (stacking on their existing access), update consecutive-streak counters (6 cycles in a row earns +1 year, escalating by 6 for each further bonus), and register the new cycle.</p>
              <div className="admin-toolbar">
                <button className="text-action" onClick={() => void registerCurrentCycle()} disabled={cycleRewardLoading}>Register current cycle</button>
                <button className="primary-action small" onClick={() => void resetCycleLeaderboard()} disabled={cycleRewardLoading}>{cycleRewardLoading ? "Working..." : "Close cycle & apply rewards"}</button>
              </div>
              {cycleRewardNotice && <p className="admin-notice">{cycleRewardNotice}</p>}
              {cycleRewardResults && (
                <div className="member-table">
                  <div className="member-head"><span>Rank</span><span>Score</span><span>Weekly reward</span><span>Streak / bonus</span></div>
                  {cycleRewardResults.map((row) => (
                    <div className="member-row" key={row.user_id}>
                      <span>#{row.rank}</span>
                      <span>{row.score}</span>
                      <span>{row.weekly_days_granted ? `+${row.weekly_days_granted} days` : "-"}</span>
                      <span>{row.streak_after || "-"}{row.streak_milestone_days_granted ? ` · +${row.streak_milestone_days_granted}d bonus!` : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>
        ) : view === "archive" ? (
          <section className="standard-view">
            <div className="page-heading"><span className="eyebrow">Past rosters</span><h1>Archive</h1><p>Every retired puzzle roster stays here, fully solvable, once a fresh set of 90 takes its place every two weeks.</p></div>
            {archivedCycles.length === 0 ? (
              <div className="daily-empty">
                <strong>No past cycles yet.</strong>
                <p>The current roster is Cycle {currentCycle.cycleNumber}. Retired rosters will appear here automatically the next time a fresh set of puzzles is published.</p>
              </div>
            ) : (
              <div className="path-list">
                {archivedCycles.map((cycle) => (
                  <section className="path-row" key={cycle.cycleNumber}>
                    <div className="path-code large">{String(cycle.cycleNumber).padStart(2, "0")}</div>
                    <div className="path-row-title">
                      <span>Cycle {String(cycle.cycleNumber).padStart(2, "0")}</span>
                      <h2>{new Date(cycle.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} – {new Date(cycle.endedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</h2>
                      <small>{cycle.puzzles.length} puzzles</small>
                    </div>
                    <div className="path-puzzles">
                      {cycle.puzzles.map((puzzle, index) => (
                        <button type="button" key={puzzle.id} onClick={() => startPuzzle(puzzle as unknown as Puzzle, `Archived · Cycle ${cycle.cycleNumber} · Challenge ${String(index + 1).padStart(2, "0")}`)}>
                          <span className="puzzle-dot">{index + 1}</span>
                          <span><strong>{puzzle.title}</strong><small>{puzzle.category} · {difficultyLabel(puzzle.difficulty)} · {puzzle.time} min</small></span><span aria-hidden="true">→</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        ) : !hasActivePass ? (
          <section className="standard-view">
            <div className="page-heading"><span className="eyebrow">Solver forum</span><h1>Community</h1><p>Debate methods, rate challenges, and submit original puzzles.</p></div>
            <div className="tips-locked">
              <h2>Community is for subscribers.</h2>
              <p>Get a pass to read discussions, submit puzzles, and propose puzzles for the next cycle.</p>
              <button className="checkout-button" onClick={() => setShowSubscribe(true)}>Get full access <span aria-hidden="true">→</span></button>
            </div>
          </section>
        ) : (
          <section className="standard-view">
            <div className="page-heading"><span className="eyebrow">Solver forum</span><h1>Community</h1><p>Debate methods, rate challenges, and submit original puzzles.</p></div>
            <div className="submit-choice-row">
              <button className="submit-choice-card" onClick={() => setShowPostForm(true)}>
                <span className="submit-choice-icon" aria-hidden="true">💬</span>
                <span className="submit-choice-copy"><strong>Submit a puzzle</strong><small>Goes to the public forum below. Everyone can read it, rate it, and reply — attach a full question, or just start a discussion.</small></span>
                <span className="submit-choice-arrow" aria-hidden="true">→</span>
              </button>
              <button className="submit-choice-card alt" onClick={() => setShowCycleSubmitForm(true)}>
                <span className="submit-choice-icon" aria-hidden="true">🎯</span>
                <span className="submit-choice-copy"><strong>Propose for next cycle</strong><small>Private, admin-only review. Never shown in the feed — if it's good, it could join a future 90-puzzle roster.</small></span>
                <span className="submit-choice-arrow" aria-hidden="true">→</span>
              </button>
            </div>
            <div className="forum-layout">
              <div className="forum-feed">
                <div className="forum-tabs"><button className="active">Newest</button></div>
                {postsLoading ? <p>Loading community posts...</p> : posts.length === 0 ? (
                  <p className="admin-empty">No community puzzles yet. Be the first to submit one.</p>
                ) : posts.map((post) => (
                  <article className="forum-post" key={post.id}>
                    <div className="forum-avatar">{post.author_name.slice(0, 2).toUpperCase()}</div>
                    <div className="forum-copy">
                      <span>{post.author_name} · {relativeTime(post.created_at)}{post.status !== "published" && " · Awaiting review"}</span>
                      <h2>{post.title}</h2><small>{post.category}</small>
                      {post.question && <p className="forum-question">{post.question}</p>}
                      <button className="forum-reply-toggle" onClick={() => toggleThread(post.id)}>
                        <span aria-hidden="true">💬</span> {post.replies} {post.replies === 1 ? "reply" : "replies"}
                        <span className={`thread-caret ${openThreadId === post.id ? "open" : ""}`} aria-hidden="true">⌄</span>
                      </button>
                      {openThreadId === post.id && (
                        <div className="forum-thread">
                          {threadLoading[post.id] ? (
                            <p className="thread-empty">Loading replies...</p>
                          ) : (threadComments[post.id]?.length ?? 0) === 0 ? (
                            <p className="thread-empty">No replies yet. Start the discussion.</p>
                          ) : (
                            threadComments[post.id]!.map((comment) => (
                              <div className="thread-comment" key={comment.id}>
                                <span className="thread-avatar">{comment.author_name.slice(0, 2).toUpperCase()}</span>
                                <div className="thread-comment-copy">
                                  <span>{comment.author_name} · {relativeTime(comment.created_at)}</span>
                                  <p>{comment.body}</p>
                                </div>
                                {(isAdmin || comment.user_id === authUser?.id) && (
                                  <button className="forum-delete small" aria-label="Delete reply" onClick={() => void deleteComment(post.id, comment.id)}>🗑</button>
                                )}
                              </div>
                            ))
                          )}
                          <div className="thread-composer">
                            <input
                              value={threadDrafts[post.id] ?? ""}
                              onChange={(event) => setThreadDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                              onKeyDown={(event) => { if (event.key === "Enter") void addComment(post.id); }}
                              placeholder={authUser ? "Add a reply..." : "Sign in to reply"}
                            />
                            <button className="text-action" onClick={() => void addComment(post.id)} disabled={!(threadDrafts[post.id] ?? "").trim()}>Reply</button>
                          </div>
                          {threadNotice[post.id] && <small className="feedback-notice">{threadNotice[post.id]}</small>}
                        </div>
                      )}
                    </div>
                    <div className="forum-metrics"><strong>{post.rating ?? "—"}</strong><span>rating</span><strong>{post.replies}</strong><span>replies</span></div>
                    {isAdmin && <button className="forum-delete" aria-label="Delete post" onClick={() => void deleteCommunityPost(post.id)}>🗑</button>}
                  </article>
                ))}
              </div>
              <aside className="forum-aside">
                <span className="eyebrow">Quality gate</span><h2>Community review</h2>
                <div className="review-step"><strong>01</strong><span>Answer and full reasoning required</span></div>
                <div className="review-step"><strong>02</strong><span>Independent solver agreement</span></div>
                <div className="review-step"><strong>03</strong><span>Editor verification before ranking</span></div>
                <div className="review-count"><strong>{posts.filter((post) => post.status === "pending_review").length}</strong><span>awaiting review</span></div>
              </aside>
            </div>
          </section>
        )}
      </main>

      <nav className="mobile-nav" aria-label="Mobile primary">
        {navigation.map((item) => (
          <button className={view === item.id && !activePuzzle ? "active" : ""} key={item.id} onClick={() => changeView(item.id)}>
            <span>{item.glyph}</span>{item.label}
          </button>
        ))}
      </nav>

      {expiryNotice && !showSubscribe && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setExpiryNotice(null)}>
          <section className="subscribe-modal expiry-modal" role="dialog" aria-modal="true" aria-labelledby="expiry-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close" onClick={() => setExpiryNotice(null)}>×</button>
            <AppMark /><span className="expiry-badge">Pass expiring</span>
            <h2 id="expiry-title">{expiryNotice === 1 ? "Your pass expires tomorrow." : "Your pass expires in 2 days."}</h2>
            <p>Renew now to keep uninterrupted access to every adaptive path, the fortnightly puzzle drops, and community rankings.</p>
            <button className="checkout-button" onClick={() => { setExpiryNotice(null); setShowSubscribe(true); }}>Renew access <span aria-hidden="true">→</span></button>
          </section>
        </div>
      )}

      {showSubscribe && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowSubscribe(false)}>
          <section className="subscribe-modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close" onClick={() => setShowSubscribe(false)}>×</button>
            <AppMark /><span className="eyebrow">Wavefront Pass</span><h2 id="subscribe-title">Keep your mind in motion.</h2>
            {accessUntil && new Date(accessUntil).getTime() > Date.now() ? <><div className="access-active"><strong>Your pass is active.</strong><span>Full access until {new Date(accessUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div><div className="membership-lines"><span>All adaptive paths</span><span>Fortnightly puzzle drops</span><span>Community rankings</span></div><small>One-time payment · No automatic renewal</small></> : <><div className="pass-options">{(Object.keys(accessPasses) as AccessPass[]).map((pass) => <button key={pass} className={`pass-option ${selectedPass === pass ? "selected" : ""}`} onClick={() => { setSelectedPass(pass); setCheckoutNotice(""); }}><strong>{accessPasses[pass].name}</strong><b>{accessPasses[pass].price}</b><span>{accessPasses[pass].description}</span></button>)}</div><div className="membership-lines"><span>All adaptive paths</span><span>Fortnightly puzzle drops</span><span>Community rankings</span></div><button className="checkout-button" onClick={() => void beginCheckout()} disabled={checkoutLoading}>{checkoutLoading ? "Opening secure checkout..." : `Get ${accessPasses[selectedPass].duration} access`} <span aria-hidden="true">→</span></button>{checkoutNotice && <p className="checkout-notice">{checkoutNotice}</p>}<small>One-time payment · No automatic renewal</small></>}
          </section>
        </div>
      )}

      {showPostForm && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowPostForm(false)}>
          <section className="post-modal wide" role="dialog" aria-modal="true" aria-labelledby="post-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close" onClick={() => setShowPostForm(false)}>×</button>
            <span className="visibility-badge public">🌐 Public · everyone in Community can see this</span>
            <span className="eyebrow">Community submission</span><h2 id="post-title">Start with a clear challenge.</h2>
            <div className="form-section">
              <span className="form-section-label">The basics</span>
              <label>Puzzle title<input value={postTitle} onChange={(event) => setPostTitle(event.target.value)} placeholder="Give your puzzle a memorable name" /></label>
              <label>Section<select value={postCategory} onChange={(event) => setPostCategory(event.target.value as (typeof categories)[number]["name"])}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label>
            </div>
            <div className="form-section">
              <span className="form-section-label">Attach a real puzzle (optional)</span>
              <label>Question<textarea value={postQuestion} onChange={(event) => setPostQuestion(event.target.value)} placeholder="Leave this blank to just start a discussion instead" /></label>
              {postQuestion.trim() && <>
                <fieldset><legend>Answer options -- mark the correct one</legend>{postOptions.map((option, index) => (
                  <label className="option-edit" key={index}>
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <input type="radio" name="post-correct-answer" checked={postCorrectOption === index} onChange={() => setPostCorrectOption(index)} aria-label={`Mark option ${String.fromCharCode(65 + index)} correct`} />
                    <input value={option} onChange={(event) => setPostOptions(postOptions.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder={`Option ${String.fromCharCode(65 + index)}`} />
                  </label>
                ))}</fieldset>
                <label>Explanation (optional)<textarea value={postExplanation} onChange={(event) => setPostExplanation(event.target.value)} placeholder="Why is this the right answer?" /></label>
              </>}
            </div>
            <button
              className="checkout-button"
              onClick={() => void addPost()}
              disabled={!postTitle.trim() || Boolean(postQuestion.trim()) && (!postOptions.every((option) => option.trim()) || postCorrectOption === null)}
            >
              Send for review <span aria-hidden="true">→</span>
            </button>
            {postQuestion.trim() && (postCorrectOption === null || !postOptions.every((option) => option.trim())) && (
              <p className="form-alert">Fill in all four options and mark the correct one, or clear the question to post without a puzzle attached.</p>
            )}
            {postNotice && <p className="form-alert">{postNotice}</p>}
          </section>
        </div>
      )}

      {showCycleSubmitForm && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowCycleSubmitForm(false)}>
          <section className="post-modal wide" role="dialog" aria-modal="true" aria-labelledby="cycle-submit-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close" onClick={() => setShowCycleSubmitForm(false)}>×</button>
            <span className="visibility-badge private">🔒 Private · only the admin reviews this</span>
            <span className="eyebrow">Propose for the next cycle</span><h2 id="cycle-submit-title">Submit a complete puzzle.</h2>
            <p>This goes straight to the admin for review -- it is never shown in the public community feed.</p>
            <div className="form-section">
              <span className="form-section-label">The basics</span>
              <label>Puzzle title<input value={cycleSubmitTitle} onChange={(event) => setCycleSubmitTitle(event.target.value)} placeholder="Give your puzzle a memorable name" /></label>
              <label>Section<select value={cycleSubmitCategory} onChange={(event) => setCycleSubmitCategory(event.target.value as (typeof categories)[number]["name"])}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label>
            </div>
            <div className="form-section">
              <span className="form-section-label">The full puzzle</span>
              <label>Question<textarea value={cycleSubmitQuestion} onChange={(event) => setCycleSubmitQuestion(event.target.value)} placeholder="Write out the question exactly as a solver would see it" /></label>
              <fieldset><legend>Answer options -- mark the correct one</legend>{cycleSubmitOptions.map((option, index) => (
                <label className="option-edit" key={index}>
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <input type="radio" name="cycle-correct-answer" checked={cycleSubmitCorrectOption === index} onChange={() => setCycleSubmitCorrectOption(index)} aria-label={`Mark option ${String.fromCharCode(65 + index)} correct`} />
                  <input value={option} onChange={(event) => setCycleSubmitOptions(cycleSubmitOptions.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder={`Option ${String.fromCharCode(65 + index)}`} />
                </label>
              ))}</fieldset>
              <label>Explanation (optional)<textarea value={cycleSubmitExplanation} onChange={(event) => setCycleSubmitExplanation(event.target.value)} placeholder="Why is this the right answer?" /></label>
            </div>
            <button
              className="checkout-button"
              onClick={() => void submitCyclePuzzle()}
              disabled={!cycleSubmitTitle.trim() || !cycleSubmitQuestion.trim() || !cycleSubmitOptions.every((option) => option.trim()) || cycleSubmitCorrectOption === null}
            >
              Send to admin <span aria-hidden="true">→</span>
            </button>
            {cycleSubmitTitle.trim() && (!cycleSubmitQuestion.trim() || !cycleSubmitOptions.every((option) => option.trim()) || cycleSubmitCorrectOption === null) && (
              <p className="form-alert">A cycle proposal needs the question, all four options filled in, and the radio button next to the correct one selected before it can be sent.</p>
            )}
            {cycleSubmitNotice && <p className={cycleSubmitNotice.startsWith("Sent") ? "form-alert success" : "form-alert"}>{cycleSubmitNotice}</p>}
          </section>
        </div>
      )}

      {showAuth && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowAuth(false)}>
          <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close" onClick={() => setShowAuth(false)}>×</button>
            <AppMark />
            <span className="eyebrow">Your Wavefront account</span>
            <h2 id="auth-title">Keep your progress moving.</h2>
            <p>Use your email to save your puzzle path, ratings, and membership.</p>
            <label>Email address<input type="email" value={authEmail} onChange={(event) => { setAuthEmail(event.target.value); setAuthCodeSent(false); setAuthCode(""); }} placeholder="you@example.com" autoComplete="email" /></label>
            {authCodeSent && <label>Eight-digit code<input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={8} value={authCode} onChange={(event) => setAuthCode(event.target.value.replace(/\D/g, ""))} placeholder="12345678" autoComplete="one-time-code" /></label>}
            <button className="checkout-button" onClick={() => void (authCodeSent ? verifySignInCode() : sendSignInCode())} disabled={authSending}>{authSending ? "Please wait..." : authCodeSent ? "Verify and sign in" : "Email me an eight-digit code"}</button>
            {authCodeSent && <button className="auth-secondary-action" onClick={() => void sendSignInCode()} disabled={authSending}>Send a new code</button>}
            {authMessage && <div className="auth-notice" role="status">{authMessage}</div>}
            <small>No password to remember. Your account is created securely on first sign-in.</small>
          </section>
        </div>
      )}
    </div>
  );
}
