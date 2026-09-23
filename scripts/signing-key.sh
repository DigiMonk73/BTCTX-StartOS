#!/usr/bin/env bash
# Put the s9pk signing key where start-cli looks for it: <workspace>/.startos/
# build.key.pem, <workspace> being any directory above the package (use the
# directory above the repository checkout, so the checkout stays clean).
#
#   DEV_KEY set (the stable developer key, an Ed25519 PEM; see UPDATING.md):
#     sign with it.
#   DEV_KEY unset: `start-cli s9pk init-workspace` generates a new throwaway
#     key, as every release before DEV_KEY existed did.
#
# Usage: DEV_KEY="$(cat key.pem)" scripts/signing-key.sh <workspace>
set -euo pipefail
WS="${1:?usage: signing-key.sh <workspace dir>}"
KEY="$WS/.startos/build.key.pem"

if [ -n "${DEV_KEY:-}" ]; then
  mkdir -p "$WS/.startos"
  (umask 077 && printf '%s\n' "$DEV_KEY" > "$KEY")
  echo "Signing with DEV_KEY"
else
  start-cli s9pk init-workspace "$WS"
  msg="DEV_KEY is not set: this s9pk is signed with a throwaway key (see startos/UPDATING.md)."
  if [ -n "${GITHUB_ACTIONS:-}" ]; then echo "::warning::$msg"; else echo "warning: $msg" >&2; fi
fi

test -s "$KEY" || { echo "no signing key at $KEY" >&2; exit 1; }
# Informational only: keys written by `start-cli init-workspace` aren't in a
# format openssl reads.
echo "Signer public key:"
openssl pkey -in "$KEY" -pubout 2>/dev/null || echo "(not readable by openssl; start-cli uses it as is)"
