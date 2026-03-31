#!/usr/bin/env node

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

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function printHelp() {
  console.log(`should-dream-cycle

Usage:
  node ./scripts/should-dream-cycle.mjs [options]

Options:
  --repeated-corrections <n>
  --repeated-failures <n>
  --pending-count <n>
  --days-since-last <n>
  --milestone              Treat current state as a milestone boundary
  --capability-gap         Repeated long-term capability gap observed
  --force                  Always recommend triggering

Output:
  JSON with { trigger, reasons, mode }
`);
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

const repeatedCorrections = toNumber(args["repeated-corrections"]);
const repeatedFailures = toNumber(args["repeated-failures"]);
const pendingCount = toNumber(args["pending-count"]);
const daysSinceLast = toNumber(args["days-since-last"]);
const reasons = [];

if (args.force) {
  reasons.push("force");
}
if (repeatedCorrections >= 2) {
  reasons.push("repeated-corrections>=2");
}
if (repeatedFailures >= 2) {
  reasons.push("repeated-failures>=2");
}
if (pendingCount >= 4 && daysSinceLast >= 1) {
  reasons.push("pending>=4-and-days-since-last>=1");
}
if (args.milestone) {
  reasons.push("milestone");
}
if (args["capability-gap"]) {
  reasons.push("repeated-capability-gap");
}

const trigger = reasons.length > 0;
const mode =
  args.force || args.milestone || args["capability-gap"] || repeatedCorrections > 0 || repeatedFailures > 0 || pendingCount > 0
    ? "self-trigger"
    : "no-trigger";

console.log(
  JSON.stringify(
    {
      trigger,
      mode,
      reasons,
      inputs: {
        repeatedCorrections,
        repeatedFailures,
        pendingCount,
        daysSinceLast,
        milestone: Boolean(args.milestone),
        capabilityGap: Boolean(args["capability-gap"]),
        force: Boolean(args.force),
      },
    },
    null,
    2,
  ),
);
