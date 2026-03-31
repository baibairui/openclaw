#!/usr/bin/env bash
set -euo pipefail

repo_url="${1:-${CLI_ANYTHING_REPO_URL:-}}"
repo_ref="${2:-${CLI_ANYTHING_REF:-main}}"
install_home="${3:-${CLI_ANYTHING_HOME:-$HOME/.lobster/cli-anything}}"

if [[ -z "${repo_url}" ]]; then
  echo "Missing CLI Anything repo URL. Provide arg1 or CLI_ANYTHING_REPO_URL." >&2
  exit 2
fi

mkdir -p "$(dirname "$install_home")"

if [[ ! -d "$install_home/.git" ]]; then
  git clone "$repo_url" "$install_home"
fi

git -C "$install_home" fetch --all --tags
git -C "$install_home" checkout "$repo_ref"

echo "CLI_ANYTHING_HOME=$install_home"
echo "CLI_ANYTHING_REF=$repo_ref"
