#!/usr/bin/env node

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

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
  console.log(`schedule-dream-cycle

Usage:
  node ./scripts/schedule-dream-cycle.mjs --cron "30 3 * * *" [options]
  node ./scripts/schedule-dream-cycle.mjs --every "24h" [options]
  node ./scripts/schedule-dream-cycle.mjs --at "2026-03-24T03:30:00+08:00" [options]

Options:
  --name <job-name>        Cron job name (default: dream-cycle:nightly)
  --focus <scope>          Dream focus hint (default: workspace)
  --cron <expr>            Cron expression
  --every <duration>       Interval duration
  --at <timestamp>         One-shot timestamp
  --print-only             Print the final openclaw cron command without executing it
  --url <gateway-url>      Pass through to openclaw cron add
  --token <gateway-token>  Pass through to openclaw cron add
  --timeout <ms>           Pass through to openclaw cron add

Behavior:
  - Creates an isolated cron job
  - Uses --message to trigger dream-cycle as an agent turn
  - Uses --light-context and --no-deliver by default
`);
}

function resolveScheduleArgs(args) {
  const variants = [
    args.cron ? ["--cron", args.cron] : null,
    args.every ? ["--every", args.every] : null,
    args.at ? ["--at", args.at] : null,
  ].filter(Boolean);
  if (variants.length !== 1) {
    throw new Error("Choose exactly one of --cron, --every, or --at.");
  }
  return variants[0];
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function findOpenClawBin() {
  const envBin = process.env.OPENCLAW_BIN?.trim();
  if (envBin) {
    return envBin;
  }
  const fromPath = spawnSync("bash", ["-lc", "command -v openclaw"], {
    encoding: "utf8",
  });
  if (fromPath.status === 0) {
    const resolved = fromPath.stdout.trim();
    if (resolved) {
      return resolved;
    }
  }
  const repoBin = "/workspace/openclaw-lobster-lab/openclaw/openclaw.mjs";
  const repoDistA = "/workspace/openclaw-lobster-lab/openclaw/dist/entry.mjs";
  const repoDistB = "/workspace/openclaw-lobster-lab/openclaw/dist/entry.js";
  if (existsSync(repoBin) && (existsSync(repoDistA) || existsSync(repoDistB))) {
    return `node ${repoBin}`;
  }
  return null;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

let scheduleArgs;
try {
  scheduleArgs = resolveScheduleArgs(args);
} catch (error) {
  console.error(String(error.message || error));
  printHelp();
  process.exit(2);
}

const name = args.name || "dream-cycle:nightly";
const focus = args.focus || "workspace";
const message =
  `Enter dream-cycle for lobster-workspace. Focus: ${focus}. ` +
  `Collect only high-signal traces, generate candidate insights under memory/dreams, ` +
  `do not modify live rules, do not send external messages, and do not execute external actions.`;

const commandParts = [
  "openclaw",
  "cron",
  "add",
  "--name",
  name,
  ...scheduleArgs,
  "--session",
  "isolated",
  "--message",
  message,
  "--light-context",
  "--no-deliver",
];

if (args.url) {
  commandParts.push("--url", args.url);
}
if (args.token) {
  commandParts.push("--token", args.token);
}
if (args.timeout) {
  commandParts.push("--timeout", args.timeout);
}

const printable = commandParts.map(shellQuote).join(" ");

if (args["print-only"]) {
  console.log(printable);
  process.exit(0);
}

const bin = findOpenClawBin();
if (!bin) {
  console.error("No runnable openclaw binary found. Use --print-only or set OPENCLAW_BIN.");
  console.error(printable);
  process.exit(3);
}

const shellCommand = printable.replace(/^'openclaw'/, bin.includes(" ") ? bin : shellQuote(bin));
const result = spawnSync("bash", ["-lc", shellCommand], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
