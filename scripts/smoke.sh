#!/usr/bin/env bash
# 用無頭 Chrome 跑 tests/smoke.html（需要 serve.py 已在 PORT 上跑）。用法：scripts/smoke.sh [PORT]
PORT="${1:-3000}"
PROFILE="$(mktemp -d)"
CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser)"
[ -z "$CHROME" ] && { echo "找不到 Chrome/Chromium"; exit 1; }
"$CHROME" --headless=new --disable-gpu --no-sandbox --virtual-time-budget=15000 --user-data-dir="$PROFILE" \
  --dump-dom "http://127.0.0.1:${PORT}/__smoke" 2>/dev/null \
  | python3 -c 'import sys,re,html;s=sys.stdin.read();m=re.search(r"<pre id=\"out\">(.*?)</pre>",s,re.S);print(html.unescape(m.group(1)) if m else "(no output)")'
rm -rf "$PROFILE"
