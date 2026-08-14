#!/usr/bin/env bash
# Idempotent Cloud Agent install for Vault Notes.
#
# Vault Notes consumes @modula/module-standard, @modula/module-validator and
# @modula/module-sdk through file:../modula-module-standard/... links, so the
# Modula Module Standard repository must be checked out as a sibling of this
# repository and its packages must be built (they ship only dist/) before this
# module can install, build, test or verify.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STD_DIR="$(dirname "$REPO_ROOT")/modula-module-standard"
STD_REMOTE="https://github.com/modula-mod/modula-module-standard.git"
STD_REF="${MODULA_STANDARD_REF:-main}"

echo "==> Vault Notes install"
echo "    repo:     $REPO_ROOT"
echo "    standard: $STD_DIR (ref: $STD_REF)"

# The sibling checkout lives next to this repo. In the Cloud Agent VM the parent
# directory (/) is not writable by the agent user, so fall back to sudo to
# create and own the directory before cloning into it.
if [ ! -d "$STD_DIR/.git" ]; then
  parent="$(dirname "$STD_DIR")"
  if [ ! -w "$parent" ]; then
    sudo mkdir -p "$STD_DIR"
    sudo chown "$(id -u):$(id -g)" "$STD_DIR"
  else
    mkdir -p "$STD_DIR"
  fi
  echo "==> Cloning Modula Module Standard"
  git clone "$STD_REMOTE" "$STD_DIR"
fi

echo "==> Updating Modula Module Standard to $STD_REF"
# Best-effort refresh. When a usable checkout already exists (e.g. restored from
# a build snapshot) a transient network/token issue must not fail the install.
git -C "$STD_DIR" fetch --tags --prune origin || echo "warn: fetch failed, using existing checkout"
git -C "$STD_DIR" checkout "$STD_REF" || echo "warn: checkout $STD_REF failed, using current HEAD"
git -C "$STD_DIR" pull --ff-only origin "$STD_REF" || true

echo "==> Installing and building Modula Module Standard packages"
pnpm --dir "$STD_DIR" install
pnpm --dir "$STD_DIR" -r build

echo "==> Installing Vault Notes dependencies"
pnpm --dir "$REPO_ROOT" install --frozen-lockfile

echo "==> Building Vault Notes"
pnpm --dir "$REPO_ROOT" build

echo "==> Install complete"
