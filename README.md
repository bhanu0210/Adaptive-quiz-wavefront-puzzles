# Wavefront Puzzles

Wavefront Puzzles is an adaptive reasoning website for logic, mathematics,
probability, optimization, spatial thinking, and number patterns.

## Product Surface

- Six adaptive puzzle paths
- Three-stage hint ladder: Nudge, Direction, and Unlock
- Answer explanations written in clear, accessible language
- Mastery, streak, activity, and leaderboard views
- Community discussions and moderated puzzle submissions
- Cross-link to [Wavefront Daily](https://wavefrontdaily.in)
- ₹99 monthly membership checkout surface

The checkout is intentionally inactive until Razorpay credentials and webhook
verification are connected.

## Puzzle Guardrails

Published puzzles live in `app/data/puzzles.json`. Each record requires:

- four answer options and one explicit answer key
- three distinct progressive hints
- a complete explanation and reusable takeaway
- a named independent verification method
- an editorial review flag and content version

`tests/puzzle-accuracy.test.mjs` independently recomputes every launch answer.
It includes exhaustive state filtering, probability calculations, simulations,
graph search, invariants, coordinate enumeration, and arithmetic checks.

## Development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
npm test
```

## Vercel Deployment

The site is a native Next.js application for Vercel. The homepage is statically
generated and `app/api/daily-brief/route.ts` provides the cached daily-puzzle
endpoint.

In Vercel, import the GitHub repository and set these Production and Preview
environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Supabase Edge Functions continue to handle secure Razorpay operations, so no
Razorpay secret belongs in Vercel. Add `puzzles.wavefrontdaily.in` only after
the Vercel preview passes login, daily puzzle, and payment checks.
