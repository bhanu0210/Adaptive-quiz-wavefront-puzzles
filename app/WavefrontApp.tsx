"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import puzzlesData from "./data/puzzles.json";
import { launchExpansion } from "./data/launch-expansion";
import { supabase } from "./supabase";

const launchPuzzles = [...puzzlesData, ...launchExpansion];
type Puzzle = (typeof launchPuzzles)[number];
type View = "solve" | "daily" | "paths" | "tips" | "leaderboard" | "community" | "admin";
type AccessPass = "monthly" | "annual";
type DailyBrief = {
  date: string | null;
  lastUpdated: string | null;
  puzzles: Array<{ difficulty: string; label: string; question: string; explanation: string }>;
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
type AdminTip = LearningTip & { publication_status: "draft" | "published" | "archived" };

const accessPasses: Record<AccessPass, { name: string; price: string; duration: string; description: string }> = {
  monthly: { name: "30-Day Pass", price: "₹99", duration: "30 days", description: "Full access for one month" },
  annual: { name: "Annual Pass", price: "₹799", duration: "365 days", description: "Best value for a full year" },
};

const categories = [
  { name: "Logic & Knowledge", code: "LK", color: "coral", mastery: 64 },
  { name: "Mathematical Reasoning", code: "MR", color: "blue", mastery: 48 },
  { name: "Probability & Strategy", code: "PS", color: "green", mastery: 57 },
  { name: "Algorithms & Optimization", code: "AO", color: "yellow", mastery: 39 },
  { name: "Spatial Reasoning", code: "SR", color: "pink", mastery: 71 },
  { name: "Patterns & Numbers", code: "PN", color: "cyan", mastery: 53 },
] as const;

type LearningTip = { id: string; category: string; title: string; body: string; sort_order: number };

const categoryToPath: Record<(typeof categories)[number]["name"], string> = {
  "Logic & Knowledge": "logic-knowledge", "Mathematical Reasoning": "mathematical-reasoning", "Probability & Strategy": "probability-strategy",
  "Algorithms & Optimization": "algorithms-optimization", "Spatial Reasoning": "spatial-reasoning", "Patterns & Numbers": "patterns-numbers",
};

const samplePlayers = [
  ["Ananya P.", 3480, 88], ["Rohan S.", 3310, 86], ["Meera K.", 3180, 91], ["Vikram N.", 3010, 84], ["Sana M.", 2840, 89],
  ["Arjun D.", 2690, 82], ["Kavya R.", 2520, 87], ["Ishaan G.", 2380, 80], ["Priya L.", 2210, 85], ["Dev A.", 2050, 79],
  ["Neha V.", 1880, 83], ["Rahul T.", 1710, 78], ["Zoya F.", 1540, 81], ["Aman B.", 1360, 76], ["Mira C.", 1190, 80],
  ["Kabir J.", 1010, 74], ["Tara H.", 830, 77], ["Nikhil W.", 650, 72], ["Diya E.", 420, 75], ["Om P.", 240, 70],
].map(([name, score, accuracy]) => ({ name: name as string, score: score as number, accuracy: accuracy as number, streak: 0 }));

const seedPosts = [
  { id: 1, initials: "AK", author: "Aarav K.", title: "Can the bridge puzzle be solved in 16 minutes?", category: "Algorithms & Optimization", replies: 18, rating: 4.7, time: "2h" },
  { id: 2, initials: "MS", author: "Meera S.", title: "A clean way to spot invariants in board puzzles", category: "Spatial Reasoning", replies: 31, rating: 4.9, time: "5h" },
  { id: 3, initials: "RV", author: "Rohan V.", title: "My original three-switch logic challenge", category: "Logic & Knowledge", replies: 12, rating: 4.4, time: "1d" },
];

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

function AppMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span /><span /><span />
    </div>
  );
}

function SignalField() {
  return (
    <div className="signal-field" aria-hidden="true">
      <span className="signal-line line-a" />
      <span className="signal-line line-b" />
      <span className="signal-line line-c" />
      <span className="signal-line line-d" />
      {[0, 1, 2, 3, 4, 5, 6].map((node) => (
        <span className={`signal-node node-${node}`} key={node}>{node === 3 ? "WF" : ""}</span>
      ))}
    </div>
  );
}

export default function WavefrontApp() {
  const [view, setView] = useState<View>("solve");
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [solvePoints, setSolvePoints] = useState<Record<string, number>>({});
  const [attemptedIds, setAttemptedIds] = useState<string[]>([]);
  const [adaptiveCategory, setAdaptiveCategory] = useState<(typeof categories)[number]["name"]>("Logic & Knowledge");
  const [adaptiveLevels, setAdaptiveLevels] = useState<Record<string, number>>(Object.fromEntries(categories.map((category) => [category.name, 3])));
  const [mastery, setMastery] = useState<Record<string, number>>(
    Object.fromEntries(categories.map((category) => [category.name, 0])),
  );
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [selectedPass, setSelectedPass] = useState<AccessPass>("monthly");
  const [checkoutNotice, setCheckoutNotice] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [accessUntil, setAccessUntil] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [posts, setPosts] = useState(seedPosts);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
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
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSelectedId, setAdminSelectedId] = useState<string | null>(null);
  const [adminPayloadText, setAdminPayloadText] = useState("");
  const [adminNotice, setAdminNotice] = useState("");
  const [adminTips, setAdminTips] = useState<AdminTip[]>([]);
  const [adminSelectedTipId, setAdminSelectedTipId] = useState<string | null>(null);
  const [adminTipText, setAdminTipText] = useState("");
  const [contentOverrides, setContentOverrides] = useState<Record<string, Partial<Puzzle>>>({});
  const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null);
  const [dailyBriefError, setDailyBriefError] = useState(false);
  const [learningTips, setLearningTips] = useState<LearningTip[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState("");
  const [streakDays, setStreakDays] = useState(0);
  const [streakVersion, setStreakVersion] = useState(0);

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
      setContentOverrides(Object.fromEntries(data.map((record) => [record.id, (record.payload ?? {}) as Partial<Puzzle>])));
    });
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
    if (!supabase || !hasActivePass) {
      setLearningTips([]);
      setTipsError("");
      return;
    }
    setTipsLoading(true);
    void supabase.from("puzzle_learning_tips").select("id,category,title,body,sort_order").eq("publication_status", "published").order("category").order("sort_order")
      .then(({ data, error }) => {
        if (error) {
          setTipsError("The learning library could not be loaded. Please refresh once.");
          return;
        }
        setLearningTips((data ?? []) as LearningTip[]);
      })
      .finally(() => setTipsLoading(false));
  }, [authUser?.id, hasActivePass]);

  useEffect(() => {
    if (!supabase || !authUser) {
      setStreakDays(0);
      return;
    }
    void supabase.from("puzzle_progress").select("solved_at").eq("user_id", authUser.id).not("solved_at", "is", null)
      .then(({ data }) => setStreakDays(calculateStreak((data ?? []).flatMap((row) => row.solved_at ? [row.solved_at] : []))));
  }, [authUser?.id, streakVersion]);

  const fallbackAdminRecord = (puzzle: Puzzle): AdminPuzzle => ({
    id: puzzle.id, title: puzzle.title, path: categoryToPath[puzzle.category as (typeof categories)[number]["name"]],
    difficulty: puzzle.difficulty, expected_minutes: puzzle.time, access_level: "subscriber",
    publication_status: "published", payload: puzzle, updated_at: "",
  });

  useEffect(() => {
    if (!supabase || !authUser) return;
    void supabase.from("puzzle_adaptive_paths").select("category,current_difficulty").eq("user_id", authUser.id).then(({ data }) => {
      if (!data?.length) return;
      setAdaptiveLevels((current) => ({ ...current, ...Object.fromEntries(data.map((path) => [path.category, path.current_difficulty])) }));
    });
  }, [authUser?.id]);

  const loadAdminData = async () => {
    if (!supabase || !isAdmin) return;
    setAdminLoading(true);
    const [catalogResult, profilesResult, subscriptionsResult, tipsResult] = await Promise.all([
      supabase.from("puzzle_catalog").select("id,title,path,difficulty,expected_minutes,access_level,publication_status,payload,updated_at").order("updated_at", { ascending: false }),
      supabase.from("puzzle_profiles").select("user_id,display_name,created_at").order("created_at", { ascending: false }),
      supabase.from("puzzle_subscriptions").select("user_id,status,current_period_end"),
      supabase.from("puzzle_learning_tips").select("id,category,title,body,sort_order,publication_status").order("category").order("sort_order"),
    ]);
    if (catalogResult.data) {
      const persisted = new Map((catalogResult.data as AdminPuzzle[]).map((puzzle) => [puzzle.id, puzzle]));
      setAdminPuzzles(launchPuzzles.map((puzzle) => persisted.get(puzzle.id) ?? fallbackAdminRecord(puzzle)));
    }
    if (profilesResult.data) {
      const subscriptions = new Map((subscriptionsResult.data ?? []).map((row) => [row.user_id, { status: row.status, current_period_end: row.current_period_end }]));
      setAdminMembers(profilesResult.data.map((profile) => ({ ...profile, subscription: subscriptions.get(profile.user_id) })));
    }
    if (tipsResult.data) setAdminTips(tipsResult.data as AdminTip[]);
    setAdminLoading(false);
  };

  useEffect(() => { void loadAdminData(); }, [authUser?.id]);

  const selectAdminPuzzle = (puzzle: AdminPuzzle) => {
    setAdminSelectedId(puzzle.id);
    setAdminPayloadText(JSON.stringify(puzzle.payload ?? {}, null, 2));
    setAdminNotice("");
  };

  const saveAdminPayload = async () => {
    if (!supabase || !adminSelectedId) return;
    try {
      const payload = JSON.parse(adminPayloadText) as Record<string, unknown>;
      const puzzle = adminPuzzles.find((item) => item.id === adminSelectedId);
      if (!puzzle) throw new Error("Puzzle not found");
      const { error } = await supabase.from("puzzle_catalog").upsert({
        id: puzzle.id, title: typeof payload.title === "string" ? payload.title : puzzle.title, path: puzzle.path,
        difficulty: puzzle.difficulty, expected_minutes: puzzle.expected_minutes, access_level: puzzle.access_level,
        publication_status: puzzle.publication_status, payload,
        published_at: puzzle.publication_status === "published" ? new Date().toISOString() : null,
      }, { onConflict: "id" });
      if (error) throw error;
      setAdminNotice("Puzzle content saved to the catalog.");
      await loadAdminData();
    } catch {
      setAdminNotice("Use valid JSON before saving this content draft.");
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
    setAdminNotice(error ? "The catalog sync could not be completed." : "All 72 launch puzzles are now stored in the editable catalog.");
    await loadAdminData();
  };

  const selectAdminTip = (tip: AdminTip) => {
    setAdminSelectedTipId(tip.id);
    setAdminTipText(JSON.stringify(tip, null, 2));
    setAdminNotice("");
  };

  const createAdminTip = () => {
    setAdminSelectedTipId("new");
    setAdminTipText(JSON.stringify({ category: "Logic & Knowledge", title: "New learning tip", body: "Write a clear, reusable method that helps a solver tackle similar puzzles.", sort_order: 99, publication_status: "draft" }, null, 2));
    setAdminNotice("");
  };

  const saveAdminTip = async () => {
    if (!supabase || !adminSelectedTipId) return;
    try {
      const tip = JSON.parse(adminTipText) as AdminTip;
      const row = { category: tip.category, title: tip.title, body: tip.body, sort_order: tip.sort_order, publication_status: tip.publication_status };
      const { error } = adminSelectedTipId === "new"
        ? await supabase.from("puzzle_learning_tips").insert(row)
        : await supabase.from("puzzle_learning_tips").update(row).eq("id", adminSelectedTipId);
      if (error) throw error;
      setAdminNotice("Learning tip saved.");
      await loadAdminData();
    } catch {
      setAdminNotice("Use valid JSON with category, title, body, sort_order, and publication_status.");
    }
  };

  const recommendedPuzzle = useMemo(() => {
    const unsolved = livePuzzles.filter((puzzle) => !solvedIds.includes(puzzle.id));
    const inCurrentPath = unsolved.filter((puzzle) => puzzle.category === adaptiveCategory);
    const fresh = inCurrentPath.filter((puzzle) => !attemptedIds.includes(puzzle.id));
    const choices = fresh.length ? fresh : (inCurrentPath.length ? inCurrentPath : unsolved);
    const target = adaptiveLevels[adaptiveCategory] ?? 3;
    return choices.sort((a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target))[0] ?? livePuzzles[0];
  }, [livePuzzles, solvedIds, attemptedIds, adaptiveCategory, adaptiveLevels]);

  const playerScore = Object.values(solvePoints).reduce((total, points) => total + points, 0);
  const leaderboard = useMemo(() => {
    const you = authUser ? [{ name: authUser.email === "cbaforcat2017@gmail.com" ? "Bhanu" : "You", score: playerScore, accuracy: solvedIds.length ? 100 : 0, streak: 0, isCurrent: true }] : [];
    return [...samplePlayers, ...you].sort((a, b) => b.score - a.score || b.accuracy - a.accuracy).map((player, index) => ({ ...player, rank: index + 1 }));
  }, [authUser, playerScore, solvedIds.length]);
  const leaders = leaderboard;

  const startPuzzle = (puzzle: Puzzle) => {
    setActivePuzzle(puzzle);
    setSelectedOption(null);
    setSubmitted(false);
    setRevealedHints(0);
    setRating(null);
    setView("solve");
  };

  const submitAnswer = () => {
    if (selectedOption === null || !activePuzzle) return;
    setSubmitted(true);
    const correct = selectedOption === activePuzzle.correctOption;
    const category = activePuzzle.category as (typeof categories)[number]["name"];
    const nextDifficulty = correct && revealedHints === 0 ? Math.min(5, activePuzzle.difficulty + 1) : Math.max(1, activePuzzle.difficulty - 1);
    setAdaptiveCategory(category);
    setAdaptiveLevels((current) => ({ ...current, [category]: nextDifficulty }));
    setAttemptedIds((current) => current.includes(activePuzzle.id) ? current : [...current, activePuzzle.id]);
    if (supabase && authUser) {
      void supabase.from("puzzle_adaptive_paths").upsert({ user_id: authUser.id, category, current_difficulty: nextDifficulty }, { onConflict: "user_id,category" });
    }
    if (!correct || solvedIds.includes(activePuzzle.id)) return;
    const points = Math.max(40, 100 - revealedHints * 15);
    setSolvedIds((current) => [...current, activePuzzle.id]);
    setSolvePoints((current) => ({ ...current, [activePuzzle.id]: points }));
    setMastery((current) => ({ ...current, [activePuzzle.category]: Math.min(100, (current[activePuzzle.category] ?? 0) + points) }));
    if (supabase && authUser) {
      void supabase.from("puzzle_progress").upsert({ user_id: authUser.id, puzzle_id: activePuzzle.id, attempts: 1, hints_used: revealedHints, solved_at: new Date().toISOString() }, { onConflict: "user_id,puzzle_id" }).then(() => setStreakVersion((version) => version + 1));
    }
  };

  const navigation: { id: View; label: string; glyph: string }[] = [
    { id: "solve", label: "Solve", glyph: "01" },
    { id: "daily", label: "Daily", glyph: "02" },
    { id: "paths", label: "Paths", glyph: "03" },
    { id: "tips", label: "Tips", glyph: "04" },
    { id: "leaderboard", label: "Leaderboard", glyph: "05" },
    { id: "community", label: "Community", glyph: "06" },
    ...(isAdmin ? [{ id: "admin" as View, label: "Admin", glyph: "07" }] : []),
  ];

  const changeView = (next: View) => {
    setActivePuzzle(null);
    setView(next);
  };

  const addPost = () => {
    const cleanTitle = postTitle.trim();
    if (!cleanTitle) return;
    setPosts((current) => [{
      id: Date.now(),
      initials: "YO",
      author: "You",
      title: cleanTitle,
      category: "Community Challenge",
      replies: 0,
      rating: 0,
      time: "now",
    }, ...current]);
    setPostTitle("");
    setShowPostForm(false);
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

    setCheckoutLoading(true);
    setCheckoutNotice("");
    const { data, error } = await supabase.functions.invoke("create-puzzle-order", { body: { pass: selectedPass } });
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
    const Razorpay = (window as Window & { Razorpay: RazorpayCheckout }).Razorpay;
    const checkout = new Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Wavefront Puzzles",
      description: data.description,
      order_id: data.orderId,
      theme: { color: "#165dff" },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const { data: verificationData, error: verificationError } = await supabase.functions.invoke("verify-puzzle-payment", {
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
          <button className="subscribe-button" onClick={() => setShowSubscribe(true)}>{accessUntil && new Date(accessUntil).getTime() > Date.now() ? "Pass active" : "Get full access"}</button>
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
          <span className="release-kicker">Drop 08</span>
          <strong>Fresh puzzles</strong>
          <span>Next wave in 9 days</span>
          <div className="mini-progress"><span style={{ width: "58%" }} /></div>
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
                <div className="puzzle-number">Verified challenge {String(livePuzzles.indexOf(activePuzzle) + 1).padStart(2, "0")}</div>
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
                    <div className="takeaway"><strong>Pattern to keep</strong><span>{activePuzzle.takeaway}</span></div>
                    <div className="rating-row">
                      <span>Rate the assigned difficulty</span>
                      <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button aria-label={`Difficulty ${value} out of 5`} className={rating === value ? "rating active" : "rating"} key={value} onClick={() => void saveDifficultyRating(value)}>{value}</button>
                        ))}
                      </div>
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
              <div><span className="eyebrow">New verified puzzles every week</span><h1>Keep your mind in motion.</h1><p>Choose one challenge at a time in Solve. Your score grows only from correct solves.</p></div>
              <div className="stat-strip" aria-label="Your performance">
                <div><strong>{solvedIds.length ? "100%" : "-"}</strong><span>Accuracy</span></div>
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
              <div className="feature-score"><span>Next level</span><strong>{adaptiveLevels[recommendedPuzzle.category] ?? 3}/5</strong></div>
            </div>
            <div className="section-heading">
              <div><span className="eyebrow">Adaptive paths</span><h2>Choose a thinking mode</h2></div>
              <button className="text-action" onClick={() => setView("paths")}>View all paths →</button>
            </div>
            <div className="path-grid">
              {categories.map((category) => {
                const categoryPuzzles = livePuzzles.filter((puzzle) => puzzle.category === category.name);
                const next = categoryPuzzles.find((puzzle) => !solvedIds.includes(puzzle.id)) ?? categoryPuzzles[0];
                return (
                  <button className={`path-card ${category.color}`} key={category.name} onClick={() => setView("paths")}>
                    <div className="path-topline"><span className="path-code">{category.code}</span><span>{categoryPuzzles.length} verified</span></div>
                    <h3>{category.name}</h3>
                    <div className="path-progress"><span style={{ width: `${mastery[category.name]}%` }} /></div>
                    <div className="path-footer"><span>{mastery[category.name]}% mastery</span><span aria-hidden="true">→</span></div>
                  </button>
                );
              })}
            </div>
            <div className="lower-grid">
              <section className="activity-panel">
                <div className="section-heading compact"><div><span className="eyebrow">This week</span><h2>Reasoning rhythm</h2></div><strong>+12%</strong></div>
                <div className="rhythm-chart" aria-label="Seven-day puzzle activity">
                  {[42, 68, 36, 78, 54, 91, 64].map((height, index) => (
                    <div key={index}><span style={{ height: `${height}%` }} /><small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small></div>
                  ))}
                </div>
              </section>
              <section className="community-preview">
                <div className="section-heading compact"><div><span className="eyebrow">Community signal</span><h2>Most discussed</h2></div><button className="text-action" onClick={() => setView("community")}>Open forum →</button></div>
                {posts.slice(0, 2).map((post) => (
                  <button className="discussion-row" key={post.id} onClick={() => setView("community")}>
                    <span className="discussion-avatar">{post.initials}</span>
                    <span className="discussion-copy"><strong>{post.title}</strong><small>{post.replies} replies · {post.rating || "New"} rating</small></span>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </section>
            </div>
          </section>
        ) : view === "daily" ? (
          <section className="standard-view daily-view">
            <div className="page-heading split">
              <div><span className="eyebrow">Live from Wavefront Daily</span><h1>Today&apos;s thinking break</h1><p>Three fresh prompts from today&apos;s edition. Read the brief and solve them on Wavefront Daily.</p></div>
              <a className="daily-open-link" href="https://wavefrontdaily.in" target="_blank" rel="noreferrer">Open today&apos;s brief <span aria-hidden="true">→</span></a>
            </div>
            {dailyBrief?.date && <p className="daily-date">Edition for {new Date(`${dailyBrief.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>}
            {dailyBrief?.puzzles.length ? <div className="daily-puzzle-grid">{dailyBrief.puzzles.map((puzzle, index) => <article className={`daily-puzzle-card daily-${puzzle.difficulty.toLowerCase()}`} key={`${puzzle.label}-${index}`}><span>{puzzle.label}</span><strong>{String(index + 1).padStart(2, "0")}</strong><p>{puzzle.question}</p><a href="https://wavefrontdaily.in" target="_blank" rel="noreferrer">Solve with today&apos;s news <span aria-hidden="true">→</span></a></article>)}</div> : <div className="daily-empty"><strong>{dailyBriefError ? "Today&apos;s feed is taking a short break." : "Loading today&apos;s puzzles..."}</strong><p>Wavefront Daily will have the newest prompts ready shortly.</p><a href="https://wavefrontdaily.in" target="_blank" rel="noreferrer">Visit Wavefront Daily <span aria-hidden="true">→</span></a></div>}
            <section className="daily-note"><span className="eyebrow">One source of truth</span><h2>Daily puzzles stay fresh without mixing memberships.</h2><p>Wavefront Daily owns the live news context, solutions, and article links. Wavefront Puzzles keeps your adaptive paths and weekly score separate.</p></section>
          </section>
        ) : view === "paths" ? (
          <section className="standard-view">
            <div className="page-heading"><span className="eyebrow">Weekly curriculum preview</span><h1>Adaptive paths</h1><p>Explore each track here. Solve challenges only from the Solve section.</p></div>
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
                      {categoryPuzzles.map((puzzle, index) => (
                        <div key={puzzle.id}>
                          <span className={solvedIds.includes(puzzle.id) ? "puzzle-dot solved" : "puzzle-dot"}>{solvedIds.includes(puzzle.id) ? "✓" : index + 1}</span>
                          <span><strong>{puzzle.title}</strong><small>{difficultyLabel(puzzle.difficulty)} · {puzzle.time} min</small></span><span aria-hidden="true">→</span>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        ) : view === "tips" ? (
          <section className="standard-view tips-view">
            <div className="page-heading split"><div><span className="eyebrow">Members learning library</span><h1>Methods that travel</h1><p>Short, reusable techniques drawn from the puzzle paths. Updated as new releases arrive.</p></div>{!hasActivePass && <button className="subscribe-button" onClick={() => setShowSubscribe(true)}>Unlock learning library</button>}</div>
            {hasActivePass ? <div className="tips-library">{tipsLoading ? <p>Loading your learning library...</p> : tipsError ? <p className="tips-error">{tipsError}</p> : categories.map((category) => { const pathTips = learningTips.filter((tip) => tip.category === category.name); return <section className="tips-chapter" key={category.name}><div><span className={`path-code ${category.color}`}>{category.code}</span><h2>{category.name}</h2><p>{pathTips.length} reusable methods</p></div><div className="tips-grid">{pathTips.map((tip) => <article className="tip-card" key={tip.id}><h3>{tip.title}</h3><p>{tip.body}</p></article>)}</div></section>; })}</div> : <section className="tips-locked"><span className="eyebrow">Subscriber access</span><h2>Build a toolkit, not just a score.</h2><p>Members can use the complete, growing tips library across logic, maths, strategy, algorithms, spatial reasoning, and patterns.</p><button className="checkout-button" onClick={() => setShowSubscribe(true)}>Get full access <span aria-hidden="true">→</span></button></section>}
          </section>
        ) : view === "leaderboard" ? (
          <section className="standard-view">
            <div className="page-heading split">
              <div><span className="eyebrow">Season 08 · Week 2</span><h1>Leaderboard</h1><p>Verified solves, accuracy, and hint efficiency.</p></div>
              <div className="rank-callout"><span>Your global position</span><strong>#184</strong><small>Top 18%</small></div>
            </div>
            <div className="podium">
              {[leaders[1], leaders[0], leaders[2]].map((leader, index) => (
                <div className={`podium-place place-${index}`} key={leader.name}>
                  <span className="podium-avatar">{leader.name.split(" ").map((part) => part[0]).join("")}</span>
                  <strong>{leader.name}</strong><span>{leader.score.toLocaleString()} pts</span><div>{leader.rank}</div>
                </div>
              ))}
            </div>
            <div className="leader-table">
              <div className="leader-head"><span>Rank</span><span>Solver</span><span>Accuracy</span><span>Streak</span><span>Score</span></div>
              {leaders.map((leader) => (
                <div className={leader.name === "You" ? "leader-row you" : "leader-row"} key={leader.name}>
                  <strong>#{leader.rank}</strong>
                  <span className="leader-person"><span>{leader.name.slice(0, 2).toUpperCase()}</span><strong>{leader.name}</strong></span>
                  <span>{leader.accuracy}%</span><span>{leader.streak} days</span><strong>{leader.score.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </section>
        ) : view === "admin" ? (
          <section className="admin-view">
            <div className="page-heading split">
              <div><span className="eyebrow">Owner console</span><h1>Publishing control</h1><p>Review puzzle content, release status, and member access from one place.</p></div>
              <div className="admin-toolbar"><button className="text-action" onClick={() => void syncLaunchCatalog()} disabled={adminLoading}>Store all 72 puzzles</button><button className="text-action" onClick={() => void loadAdminData()} disabled={adminLoading}>{adminLoading ? "Refreshing..." : "Refresh data"}</button></div>
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
                {adminSelectedId ? <>
                  <label className="admin-editor-label">Structured content payload<textarea value={adminPayloadText} onChange={(event) => setAdminPayloadText(event.target.value)} spellCheck={false} /></label>
                  <div className="admin-actions"><button className="primary-action small" onClick={() => void saveAdminPayload()}>Save draft</button>{(() => { const puzzle = adminPuzzles.find((item) => item.id === adminSelectedId); return puzzle ? <button className="text-action" onClick={() => void setAdminPublication(puzzle, puzzle.publication_status === "published" ? "draft" : "published")}>{puzzle.publication_status === "published" ? "Move to draft" : "Publish"}</button> : null; })()}</div>
                </> : <p className="admin-empty">Choose a catalog record to review its structured content and publication state.</p>}
                {adminNotice && <p className="admin-notice">{adminNotice}</p>}
              </section>
            </div>
            <div className="admin-grid">
              <section className="admin-panel">
                <div className="admin-panel-heading"><div><span className="eyebrow">Learning library</span><h2>Edit subscriber tips</h2></div><button className="text-action" onClick={createAdminTip}>New tip</button></div>
                <div className="admin-list">{adminTips.map((tip) => <button className={adminSelectedTipId === tip.id ? "admin-row selected" : "admin-row"} key={tip.id} onClick={() => selectAdminTip(tip)}><span><strong>{tip.title}</strong><small>{tip.category}</small></span><em className={tip.publication_status === "published" ? "status-live" : "status-draft"}>{tip.publication_status}</em></button>)}</div>
              </section>
              <section className="admin-panel editor-panel">
                <div className="admin-panel-heading"><div><span className="eyebrow">Tip editor</span><h2>{adminSelectedTipId ? adminTips.find((tip) => tip.id === adminSelectedTipId)?.title : "Select a learning tip"}</h2></div></div>
                {adminSelectedTipId ? <><label className="admin-editor-label">Structured learning tip<textarea value={adminTipText} onChange={(event) => setAdminTipText(event.target.value)} spellCheck={false} /></label><div className="admin-actions"><button className="primary-action small" onClick={() => void saveAdminTip()}>Save tip</button></div></> : <p className="admin-empty">Choose a learning tip to update its text or publication state.</p>}
              </section>
            </div>
            <section className="admin-panel member-panel">
              <div className="admin-panel-heading"><div><span className="eyebrow">Subscribers</span><h2>Access overview</h2></div><span>{adminMembers.length} signed-in members</span></div>
              <div className="member-table"><div className="member-head"><span>Member</span><span>Joined</span><span>Access</span><span>Pass ends</span></div>{adminMembers.map((member) => <div className="member-row" key={member.user_id}><span><strong>{member.display_name}</strong><small>{member.user_id.slice(0, 8)}</small></span><span>{new Date(member.created_at).toLocaleDateString("en-IN")}</span><span>{member.subscription?.status ?? "inactive"}</span><span>{member.subscription?.current_period_end ? new Date(member.subscription.current_period_end).toLocaleDateString("en-IN") : "-"}</span></div>)}</div>
            </section>
          </section>
        ) : (
          <section className="standard-view">
            <div className="page-heading split">
              <div><span className="eyebrow">Solver forum</span><h1>Community</h1><p>Debate methods, rate challenges, and submit original puzzles.</p></div>
              <button className="primary-action small" onClick={() => setShowPostForm(true)}>Submit a puzzle <span aria-hidden="true">＋</span></button>
            </div>
            <div className="forum-layout">
              <div className="forum-feed">
                <div className="forum-tabs"><button className="active">Trending</button><button>Newest</button><button>Unsolved</button></div>
                {posts.map((post) => (
                  <article className="forum-post" key={post.id}>
                    <div className="forum-avatar">{post.initials}</div>
                    <div className="forum-copy"><span>{post.author} · {post.time}</span><h2>{post.title}</h2><small>{post.category}</small></div>
                    <div className="forum-metrics"><strong>{post.rating || "—"}</strong><span>rating</span><strong>{post.replies}</strong><span>replies</span></div>
                  </article>
                ))}
              </div>
              <aside className="forum-aside">
                <span className="eyebrow">Quality gate</span><h2>Community review</h2>
                <div className="review-step"><strong>01</strong><span>Answer and full reasoning required</span></div>
                <div className="review-step"><strong>02</strong><span>Independent solver agreement</span></div>
                <div className="review-step"><strong>03</strong><span>Editor verification before ranking</span></div>
                <div className="review-count"><strong>28</strong><span>awaiting review</span></div>
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
          <section className="post-modal" role="dialog" aria-modal="true" aria-labelledby="post-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close" onClick={() => setShowPostForm(false)}>×</button>
            <span className="eyebrow">Community submission</span><h2 id="post-title">Start with a clear challenge.</h2>
            <label>Puzzle title<input value={postTitle} onChange={(event) => setPostTitle(event.target.value)} placeholder="Give your puzzle a memorable name" /></label>
            <label>Section<select defaultValue="Logic & Knowledge">{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label>
            <button className="checkout-button" onClick={addPost} disabled={!postTitle.trim()}>Send for review <span aria-hidden="true">→</span></button>
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
