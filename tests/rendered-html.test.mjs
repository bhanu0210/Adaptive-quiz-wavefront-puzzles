import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("contains the native Next.js product and daily API route", async () => {
  const [page, app, route] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/WavefrontApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/daily-brief/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<WavefrontApp \/>/);
  assert.match(app, /Keep your mind in motion/);
  assert.match(app, /Read Wavefront Daily/);
  assert.match(route, /export async function GET/);
  assert.match(route, /wavefrontdaily\.in\/api\/news/);
  assert.doesNotMatch(route, /\bcf:/);
});

test("starter preview assets and metadata are removed", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<WavefrontApp \/>/);
  assert.match(layout, /puzzles\.wavefrontdaily\.in/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
