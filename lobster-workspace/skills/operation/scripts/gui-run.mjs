#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const candidates = [
  process.env.LOBSTER_GUI_SCRIPT,
  path.resolve(here, "../vendor/macos-gui-executor.mjs"),
];
const script = candidates.find((candidate) => candidate && existsSync(candidate));

if (!script) {
  console.error("No GUI capability script found. Set LOBSTER_GUI_SCRIPT.");
  process.exit(2);
}

const child = spawn("node", [script, ...process.argv.slice(2)], { stdio: "inherit" });

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
