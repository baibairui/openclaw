#!/usr/bin/env bash
set -euo pipefail

source_path="${1:-}"
tool_name="${2:-}"
bin_dir="${LOBSTER_TOOL_BIN_DIR:-$HOME/.lobster/bin}"

if [[ -z "${source_path}" || -z "${tool_name}" ]]; then
  echo "Usage: register-generated-cli.sh <source-path> <tool-name>" >&2
  exit 2
fi

if [[ ! -e "$source_path" ]]; then
  echo "Source path not found: $source_path" >&2
  exit 2
fi

mkdir -p "$bin_dir"
ln -sfn "$source_path" "$bin_dir/$tool_name"

echo "registered=$bin_dir/$tool_name"
echo "note=ensure $bin_dir is in PATH before runtime use"
