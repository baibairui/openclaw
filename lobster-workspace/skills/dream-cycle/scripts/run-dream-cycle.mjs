#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function printHelp() {
  console.log(`run-dream-cycle

Usage:
  node ./scripts/run-dream-cycle.mjs \\
    --focus project \\
    --signals "Repeated research corrections" \\
    --insight "Need a stronger evidence workflow" \\
    --candidates "skill-writeback:research;evidence-checklist"

Notes:
  - Writes a dream candidate under lobster-workspace/memory/dreams/
  - Does not modify any live memory or skill automatically
`);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "dream";
}

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.focus || !args.signals || !args.insight) {
  printHelp();
  process.exit(args.help ? 0 : 2);
}

const date = new Date().toISOString().slice(0, 10);
const outDir = "/workspace/openclaw-lobster-lab/openclaw/lobster-workspace/memory/dreams";
mkdirSync(outDir, { recursive: true });

const fileName = `${date}-${slugify(args.focus)}-${slugify(args.insight)}.md`;
const outPath = path.join(outDir, fileName);

const body = `# Dream Candidate

- date: ${date}
- focus: ${args.focus}

## Signals

${args.signals}

## Insight

${args.insight}

## Candidate Follow-ups

${args.candidates || "None"}
`;

writeFileSync(outPath, body, "utf8");
console.log(JSON.stringify({ ok: true, path: outPath }, null, 2));
