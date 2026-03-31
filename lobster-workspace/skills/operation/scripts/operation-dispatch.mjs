#!/usr/bin/env node

import { spawn } from "node:child_process";

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

function toBool(value, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  return ["1", "true", "yes", "y"].includes(String(value).toLowerCase());
}

function chooseMode(options) {
  if (toBool(options["cli-available"])) return "cli";
  if (toBool(options["browser-available"]) || options.target === "web") return "browser";
  if (toBool(options["gui-available"]) || options.target === "desktop") return "gui";
  return "manual";
}

function runNodeScript(scriptPath, scriptArgs) {
  const child = spawn("node", [scriptPath, ...scriptArgs], { stdio: "inherit" });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
}

function printHelp() {
  console.log(`operation-dispatch

Usage:
  node ./scripts/operation-dispatch.mjs choose [--target web|desktop|mixed] [--cli-available true|false] [--browser-available true|false] [--gui-available true|false]
  node ./scripts/operation-dispatch.mjs run --mode cli|browser|gui -- [args...]

Examples:
  node ./scripts/operation-dispatch.mjs choose --target web --cli-available false --browser-available true
  node ./scripts/operation-dispatch.mjs run --mode browser -- snapshot
`);
}

const args = parseArgs(process.argv.slice(2));
const command = args._[0];

if (!command || command === "help" || command === "--help") {
  printHelp();
  process.exit(0);
}

if (command === "choose") {
  const mode = chooseMode(args);
  const reason =
    mode === "cli"
      ? "存在更稳定的结构化 CLI 执行路径，优先 CLI。"
      : mode === "browser"
        ? "当前更适合网页执行路径，优先浏览器。"
        : mode === "gui"
          ? "没有更高优先级路径，进入 GUI 兜底。"
          : "未发现可直接执行路径，需要人工判断。";
  console.log(JSON.stringify({ mode, reason }, null, 2));
  process.exit(0);
}

if (command === "run") {
  const mode = args.mode;
  const passthroughIndex = process.argv.indexOf("--");
  const passthrough = passthroughIndex >= 0 ? process.argv.slice(passthroughIndex + 1) : [];

  if (!mode) {
    console.error("Missing --mode. Use cli, browser, or gui.");
    process.exit(2);
  }

  const scriptMap = {
    cli: new URL("./cli-run.mjs", import.meta.url).pathname,
    browser: new URL("./browser-run.mjs", import.meta.url).pathname,
    gui: new URL("./gui-run.mjs", import.meta.url).pathname,
  };

  if (!scriptMap[mode]) {
    console.error(`Unsupported mode: ${mode}`);
    process.exit(2);
  }

  runNodeScript(scriptMap[mode], passthrough);
}

console.error(`Unknown command: ${command}`);
printHelp();
process.exit(2);
