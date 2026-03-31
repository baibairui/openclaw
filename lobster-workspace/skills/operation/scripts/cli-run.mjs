#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { delimiter } from "node:path";

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
  console.log(`cli-run

Usage:
  node ./scripts/cli-run.mjs --script /path/to/adapter.mjs -- [args...]
  node ./scripts/cli-run.mjs --command "<structured cli command>"

Notes:
  - --script: hand over to an external adapter script.
  - --command: lightweight entry for already-structured local CLI execution.
  - auto prepends lobster local bin path so bundled CLIs like oracle can be found.
`);
}

function withLobsterPath() {
  const localBin = "/workspace/.codex-runtime/home/.npm-global/bin";
  const current = process.env.PATH || "";
  const segments = current.split(delimiter).filter(Boolean);
  if (!segments.includes(localBin)) {
    segments.unshift(localBin);
  }
  return { ...process.env, PATH: segments.join(delimiter) };
}

const args = parseArgs(process.argv.slice(2));
const script = args.script || process.env.LOBSTER_CLI_ADAPTER_SCRIPT;

if ((!script && !args.command) || args.help || args["--help"]) {
  printHelp();
  process.exit(0);
}

if (script) {
  if (!existsSync(script)) {
    console.error(`Adapter script not found: ${script}`);
    process.exit(2);
  }
  const passthroughIndex = process.argv.indexOf("--");
  const passthrough = passthroughIndex >= 0 ? process.argv.slice(passthroughIndex + 1) : [];
  const child = spawn("node", [script, ...passthrough], {
    stdio: "inherit",
    env: withLobsterPath(),
  });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
} else if (args.command) {
  const child = spawn("bash", ["-lc", args.command], {
    stdio: "inherit",
    env: withLobsterPath(),
  });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
} else {
  console.error("Missing --script or --command.");
  process.exit(2);
}
