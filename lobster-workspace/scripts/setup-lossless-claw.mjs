#!/usr/bin/env node

import { spawn } from "node:child_process";
import { resolve } from "node:path";

if (process.argv.includes("--help")) {
  console.log(`setup-lossless-claw

Usage:
  node ./scripts/setup-lossless-claw.mjs [--repo-root /path/to/openclaw] [--plugin-spec @martian-engineering/lossless-claw] [--config-path ~/.openclaw/openclaw.json]

What it does:
  1. installs lossless-claw with OpenClaw's plugin installer
  2. enables it as plugins.slots.contextEngine
  3. reminds you to restart OpenClaw
`);
  process.exit(0);
}

function runNode(scriptPath, extraArgs = []) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn("node", [scriptPath, ...extraArgs], { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${scriptPath} exited with code ${code ?? 1}`));
    });
    child.on("error", rejectRun);
  });
}

const base = "/workspace/openclaw-lobster-lab/openclaw/lobster-workspace/scripts";
const installScript = resolve(base, "install-lossless-claw.mjs");
const enableScript = resolve(base, "enable-lossless-claw.mjs");

try {
  await runNode(installScript, process.argv.slice(2));
  await runNode(enableScript, process.argv.slice(2));
  console.log(JSON.stringify({ ok: true, note: "lossless-claw installed and config enabled; restart OpenClaw to apply." }, null, 2));
} catch (error) {
  console.error(String(error.message || error));
  process.exit(1);
}
