"use client";

import { useMemo, useState } from "react";
import puzzlesData from "./data/puzzles.json";

type Puzzle = (typeof puzzlesData)[number];
type View = "solve" | "paths" | "leaderboard" | "community";

const categories = [
  { name: "Logic & Knowledge", code: "LK", color: "coral", mastery: 64 },
  { name: "Mathematical Reasoning", code: "MR", color: "blue", mastery: 48 },
  { name: "Probability & Strategy", code: "PS", color: "green", mastery: 57 },
  { name: "Algorithms & Optimization", code: "AO", color: "yellow", mastery: 39 },
  { name: "Spatial Reasoning", code: "SR", color: "pink", mastery: 71 },
  { name: "Patterns & Numbers", code: "PN", color: "cyan", mastery: 53 },
] as const;

const leaders = [
  { rank: 1, name: "Meera S.", score: 4820, streak: 28, accuracy: 94 },
  { rank: 2, name: "Arjun Rao", score: 4610, streak: 19, accuracy: 91 },
  { rank: 3, name: "Kabir M.", score: 4385, streak: 22, accuracy: 89 },
  { rank: 4, name: "Naina J.", score: 4120, streak: 14, accuracy: 92 },
  { rank: 5, name: "You", score: 3680, streak: 7, accuracy: 86 },
];

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
  const [mastery, setMastery] = useState<Record<string, number>>(
    Object.fromEntries(categories.map((category) => [category.name, category.mastery])),
  );
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [posts, setPosts] = useState(seedPosts);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");

  const recommendedPuzzle = useMemo(() => {
    const unsolved = puzzlesData.filter((puzzle) => !solvedIds.includes(puzzle.id));
    return unsolved.sort((a, b) => (mastery[a.category] ?? 50) - (mastery[b.category] ?? 50))[0] ?? puzzlesData[0];
  }, [mastery, solvedIds]);

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
    if (solvedIds.includes(activePuzzle.id)) return;
    setSolvedIds((current) => [...current, activePuzzle.id]);
    const correct = selectedOption === activePuzzle.correctOption;
    const gain = correct ? Math.max(3, 7 - revealedHints) : 2;
    setMastery((current) => ({
      ...current,
      [activePuzzle.category]: Math.min(100, (current[activePuzzle.category] ?? 50) + gain),
    }));
  };

  const navigation: { id: View; label: string; glyph: string }[] = [
    { id: "solve", label: "Solve", glyph: "01" },
    { id: "paths", label: "Paths", glyph: "02" },
    { id: "leaderboard", label: "Leaderboard", glyph: "03" },
    { id: "community", label: "Community", glyph: "04" },
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
          <div className="streak-pill" title="Current solving streak">
            <span className="streak-dot" /><strong>7</strong> day streak
          </div>
          <button className="subscribe-button" onClick={() => setShowSubscribe(true)}>Get full access</button>
          <button className="avatar-button" title="Open profile" aria-label="Open profile">BK</button>
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
                <div className="puzzle-number">Verified challenge {String(puzzlesData.indexOf(activePuzzle) + 1).padStart(2, "0")}</div>
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
                          <button aria-label={`Difficulty ${value} out of 5`} className={rating === value ? "rating active" : "rating"} key={value} onClick={() => setRating(value)}>{value}</button>
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
              <div><span className="eyebrow">Sunday, 26 July</span><h1>Good morning, Bhanu.</h1><p>Your weakest signal is optimization. Today&apos;s set starts there.</p></div>
              <div className="stat-strip" aria-label="Your performance">
                <div><strong>86%</strong><span>Accuracy</span></div>
                <div><strong>42</strong><span>Solved</span></div>
                <div><strong>Top 18%</strong><span>Rank</span></div>
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
              <div className="feature-score"><span>Path fit</span><strong>94</strong></div>
            </div>
            <div className="section-heading">
              <div><span className="eyebrow">Adaptive paths</span><h2>Choose a thinking mode</h2></div>
              <button className="text-action" onClick={() => setView("paths")}>View all paths →</button>
            </div>
            <div className="path-grid">
              {categories.map((category) => {
                const categoryPuzzles = puzzlesData.filter((puzzle) => puzzle.category === category.name);
                const next = categoryPuzzles.find((puzzle) => !solvedIds.includes(puzzle.id)) ?? categoryPuzzles[0];
                return (
                  <button className={`path-card ${category.color}`} key={category.name} onClick={() => startPuzzle(next)}>
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
        ) : view === "paths" ? (
          <section className="standard-view">
            <div className="page-heading"><span className="eyebrow">Your curriculum</span><h1>Adaptive paths</h1><p>Each result reshapes what comes next.</p></div>
            <div className="path-list">
              {categories.map((category, categoryIndex) => {
                const categoryPuzzles = puzzlesData.filter((puzzle) => puzzle.category === category.name);
                return (
                  <section className="path-row" key={category.name}>
                    <div className={`path-code large ${category.color}`}>{category.code}</div>
                    <div className="path-row-title">
                      <span>Path {String(categoryIndex + 1).padStart(2, "0")}</span><h2>{category.name}</h2>
                      <div className="path-progress"><span style={{ width: `${mastery[category.name]}%` }} /></div><small>{mastery[category.name]}% mastery</small>
                    </div>
                    <div className="path-puzzles">
                      {categoryPuzzles.map((puzzle, index) => (
                        <button key={puzzle.id} onClick={() => startPuzzle(puzzle)}>
                          <span className={solvedIds.includes(puzzle.id) ? "puzzle-dot solved" : "puzzle-dot"}>{solvedIds.includes(puzzle.id) ? "✓" : index + 1}</span>
                          <span><strong>{puzzle.title}</strong><small>{difficultyLabel(puzzle.difficulty)} · {puzzle.time} min</small></span><span aria-hidden="true">→</span>
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
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
            <div className="price"><strong>₹99</strong><span>/ month</span></div>
            <div className="membership-lines"><span>All adaptive paths</span><span>Fortnightly puzzle drops</span><span>Community rankings</span></div>
            {checkoutNotice ? <p className="checkout-notice">Secure checkout will open when the payment account is activated.</p> : (
              <button className="checkout-button" onClick={() => setCheckoutNotice(true)}>Continue to payment <span aria-hidden="true">→</span></button>
            )}
            <small>Cancel anytime · No hidden charges</small>
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
    </div>
  );
}
