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
  console.log(`propose-skill-writeback

Usage:
  node ./scripts/propose-skill-writeback.mjs \\
    --skill research \\
    --issue "Repeated weak evidence synthesis" \\
    --evidence "Two recent tasks required manual correction" \\
    --proposal "Force evidence table before conclusions" \\
    --why "Pattern repeated and worth promoting"

Notes:
  - Writes a candidate markdown file under lobster-workspace/memory/skill-writebacks/
  - Does not modify the actual skill automatically
`);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "writeback";
}

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.skill || !args.issue || !args.evidence || !args.proposal || !args.why) {
  printHelp();
  process.exit(args.help ? 0 : 2);
}

const date = new Date().toISOString().slice(0, 10);
const fileName = `${date}-${slugify(args.skill)}-${slugify(args.issue)}.md`;
const outDir = "/workspace/openclaw-lobster-lab/openclaw/lobster-workspace/memory/skill-writebacks";
mkdirSync(outDir, { recursive: true });

const body = `# Skill Writeback Candidate

- date: ${date}
- skill: ${args.skill}

## Issue

${args.issue}

## Evidence

${args.evidence}

## Proposed Writeback

${args.proposal}

## Why Now

${args.why}
`;

const outPath = path.join(outDir, fileName);
writeFileSync(outPath, body, "utf8");
console.log(JSON.stringify({ ok: true, path: outPath }, null, 2));
