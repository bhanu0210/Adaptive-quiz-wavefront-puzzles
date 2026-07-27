/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/daily-brief") {
      try {
        const source = await fetch("https://wavefrontdaily.in/api/news", {
          headers: { accept: "application/json" },
          cf: { cacheTtl: 900, cacheEverything: true },
        });
        if (!source.ok) throw new Error(`Daily feed returned ${source.status}`);

        const data = await source.json() as {
          date?: string;
          lastUpdated?: string;
          puzzles?: Array<{ difficulty?: string; label?: string; question?: string; answer?: string; explanation?: string }>;
        };
        const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
        const puzzles = (data.puzzles ?? []).slice(0, 3).map((puzzle) => ({
          difficulty: puzzle.difficulty ?? "daily",
          label: puzzle.label ?? "Daily",
          question: puzzle.question ?? "",
          explanation: puzzle.explanation ?? "",
          // A Daily answer must be supported by its own explanation before it can award points.
          verified: Boolean(puzzle.answer && puzzle.explanation && normalize(puzzle.explanation).includes(normalize(puzzle.answer))),
        })).filter((puzzle) => puzzle.question);

        return Response.json({ date: data.date ?? null, lastUpdated: data.lastUpdated ?? null, puzzles }, {
          headers: { "Cache-Control": "public, max-age=900, s-maxage=900" },
        });
      } catch {
        return Response.json({ date: null, lastUpdated: null, puzzles: [] }, {
          status: 503,
          headers: { "Cache-Control": "no-store" },
        });
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
