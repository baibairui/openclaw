#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { homedir } from "node:os";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
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

function stripJsonComments(input) {
  return input
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
}

function readJsonConfig(filePath) {
  if (!existsSync(filePath)) return {};
  const raw = readFileSync(filePath, "utf8");
  if (!raw.trim()) return {};
  return JSON.parse(stripJsonComments(raw));
}

function printHelp() {
  console.log(`enable-lossless-claw

Usage:
  node ./scripts/enable-lossless-claw.mjs [--config-path ~/.openclaw/openclaw.json]

What it does:
  - enables plugins
  - selects plugins.slots.contextEngine = "lossless-claw"
  - ensures plugins.entries["lossless-claw"].enabled = true

What it does not do:
  - it does not install the plugin package
  - it does not restart OpenClaw
`);
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const configPath = resolve(args["config-path"] || `${homedir()}/.openclaw/openclaw.json`);
const config = readJsonConfig(configPath);

config.plugins ??= {};
config.plugins.enabled = true;
config.plugins.slots ??= {};
config.plugins.slots.contextEngine = "lossless-claw";
config.plugins.entries ??= {};
config.plugins.entries["lossless-claw"] ??= {};
config.plugins.entries["lossless-claw"].enabled = true;

mkdirSync(dirname(configPath), { recursive: true });
writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      configPath,
      contextEngine: config.plugins.slots.contextEngine,
      pluginEnabled: config.plugins.entries["lossless-claw"].enabled,
      note: "Install the plugin package separately, then restart OpenClaw.",
    },
    null,
    2,
  ),
);
