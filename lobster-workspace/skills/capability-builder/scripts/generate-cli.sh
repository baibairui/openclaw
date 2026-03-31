#!/usr/bin/env bash
set -euo pipefail

cli_anything_home="${CLI_ANYTHING_HOME:-${1:-}}"
target_path="${2:-${TARGET_PATH:-}}"
target_name="${3:-${TARGET_NAME:-}}"

if [[ -z "${cli_anything_home}" ]]; then
  echo "Missing CLI_ANYTHING_HOME." >&2
  exit 2
fi

if [[ -z "${target_path}" || -z "${target_name}" ]]; then
  echo "Usage: generate-cli.sh <cli_anything_home> <target_path> <target_name>" >&2
  exit 2
fi

if [[ ! -d "$cli_anything_home" ]]; then
  echo "CLI Anything home not found: $cli_anything_home" >&2
  exit 2
fi

echo "TODO: wire actual CLI Anything generation command here."
echo "target_path=$target_path"
echo "target_name=$target_name"
exit 3
