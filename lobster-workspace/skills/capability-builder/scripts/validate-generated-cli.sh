#!/usr/bin/env bash
set -euo pipefail

command_name="${1:-}"

if [[ -z "${command_name}" ]]; then
  echo "Usage: validate-generated-cli.sh <command-name>" >&2
  exit 2
fi

if ! command -v "$command_name" >/dev/null 2>&1; then
  echo "Command not found in PATH: $command_name" >&2
  exit 2
fi

"$command_name" --help >/dev/null
echo "ok: help available"
