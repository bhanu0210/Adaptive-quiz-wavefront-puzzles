import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // As of Next.js 16.3, `next dev` auto-generates AGENTS.md/CLAUDE.md at
  // the repo root on every run. Opting out here so a routine dev-server
  // start doesn't keep dropping untracked files into the working tree.
  agentRules: false,
};

export default nextConfig;
