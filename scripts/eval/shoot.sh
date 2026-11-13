#!/usr/bin/env bash
# Usage: bash scripts/eval/shoot.sh [id|all]
# Env: EVAL_LINK=expogo|dev (default expogo), EVAL_HOST (default 127.0.0.1:8081),
#      EVAL_WAIT seconds (default 2.5), EVAL_UDID, EVAL_ROUTE (override route for a single id)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
UDID="${EVAL_UDID:-A7D02B0B-F2EB-41D0-8927-4A98A09E746A}"
LINK="${EVAL_LINK:-expogo}"
HOST="${EVAL_HOST:-127.0.0.1:8081}"
WAIT="${EVAL_WAIT:-2.5}"
TARGET="${1:-all}"
OUT="$ROOT/docs/evals/shots"
mkdir -p "$OUT"

if ! xcrun simctl list devices | grep "$UDID" | grep -q Booted; then
  xcrun simctl boot "$UDID"
  xcrun simctl bootstatus "$UDID" -b >/dev/null
fi
xcrun simctl status_bar "$UDID" override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3

ROWS="$(python3 -I - "$ROOT/scripts/eval/screens.json" "$TARGET" <<'PY'
import json, sys
rows = json.load(open(sys.argv[1]))
t = sys.argv[2]
sel = [r for r in rows if t == "all" or r["id"] == t]
if not sel:
    sys.exit("unknown id: " + t)
for r in sel:
    print(r["id"], r["route"], r["preset"])
PY
)"

while read -r id route preset; do
  [ -n "${EVAL_ROUTE:-}" ] && [ "$TARGET" != "all" ] && route="$EVAL_ROUTE"
  q="?preset=$preset"
  if [ "$LINK" = "dev" ]; then
    url="junoonboarding://${route}${q}"
  else
    url="exp://${HOST}/--${route}${q}"
  fi
  echo "shoot $id -> $url"
  xcrun simctl openurl "$UDID" "$url"
  sleep "$WAIT"
  xcrun simctl io "$UDID" screenshot --type=png "$OUT/$id.png" >/dev/null 2>&1
  echo "saved $OUT/$id.png"
done <<< "$ROWS"
