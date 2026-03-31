#!/usr/bin/env node

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";

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

function run(cmd, argv) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(cmd, argv, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${cmd} exited with code ${code ?? 1}`));
    });
    child.on("error", rejectRun);
  });
}

function detectRunner(repoRoot) {
  const repoCli = resolve(repoRoot, "openclaw.mjs");
  const repoDistJs = resolve(repoRoot, "dist/entry.js");
  const repoDistMjs = resolve(repoRoot, "dist/entry.mjs");

  if (process.env.OPENCLAW_BIN) {
    return { cmd: process.env.OPENCLAW_BIN, argvPrefix: [] };
  }

  const which = spawnSync("bash", ["-lc", "command -v openclaw >/dev/null 2>&1"]);
  if (which.status === 0) {
    return { cmd: "openclaw", argvPrefix: [] };
  }

  if (existsSync(repoCli) && (existsSync(repoDistJs) || existsSync(repoDistMjs))) {
    return { cmd: "node", argvPrefix: [repoCli] };
  }

  return null;
}

function printHelp() {
  console.log(`install-lossless-claw

Usage:
  node ./scripts/install-lossless-claw.mjs [--repo-root /path/to/openclaw] [--plugin-spec @martian-engineering/lossless-claw]

What it does:
  - installs the lossless-claw plugin with OpenClaw's plugin installer

What it needs:
  - either an available 'openclaw' binary in PATH
  - or a built OpenClaw repo checkout with dist/entry.js(.mjs)
`);
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const repoRoot = resolve(args["repo-root"] || "/workspace/openclaw-lobster-lab/openclaw");
const pluginSpec = args["plugin-spec"] || "@martian-engineering/lossless-claw";
const runner = detectRunner(repoRoot);

if (!runner) {
  console.error(
    `No usable OpenClaw runtime found. Need either:\n` +
      `- openclaw in PATH\n` +
      `- or a built repo at ${repoRoot} with dist/entry.js(.mjs)\n`,
  );
  process.exit(2);
}

try {
  await run(runner.cmd, [...runner.argvPrefix, "plugins", "install", pluginSpec]);
  console.log(JSON.stringify({ ok: true, pluginSpec, note: "Restart OpenClaw after enabling the config." }, null, 2));
} catch (error) {
  console.error(String(error.message || error));
  process.exit(1);
}
