#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoCli = path.resolve(here, "../../../../openclaw.mjs");
const candidates = [process.env.LOBSTER_BROWSER_SCRIPT];
const script = candidates.find((candidate) => candidate && existsSync(candidate));

if (script) {
  const child = spawn("node", [script, ...process.argv.slice(2)], { stdio: "inherit" });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
} else if (existsSync(repoCli)) {
  const child = spawn("node", [repoCli, "browser", ...process.argv.slice(2)], { stdio: "inherit" });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
} else {
  const child = spawn("openclaw", ["browser", ...process.argv.slice(2)], { stdio: "inherit" });
  child.on("error", () => {
    console.error("No browser capability found. Set LOBSTER_BROWSER_SCRIPT or ensure `openclaw browser` is available.");
    process.exit(2);
  });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
}
