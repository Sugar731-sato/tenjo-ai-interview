#!/bin/bash
# イラスト3枚の緑を、1色に塗り替えてリポジトリのファイルを上書きする(macOS 専用)。
#
# 使い方: scripts/tenjo/recolor-illustrations/recolor-illustrations.sh [RRGGBB]
#   色を省略すると COLOR の値を使う。
set -euo pipefail

# 塗り替え後の色(# なしの16進数6桁)
COLOR="E6DCC3"
# 元の緑のイラストが入っているコミット(イラストを変える直前のコミット)
SOURCE_REF="1a644292"

COLOR="${1:-$COLOR}"
COLOR="${COLOR#\#}"
if [[ ! "$COLOR" =~ ^[0-9A-Fa-f]{6}$ ]]; then
  echo "色は RRGGBB の形で指定してください(例: D9C9A3)" >&2
  exit 1
fi

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(git -C "$HERE" rev-parse --show-toplevel)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

swiftc -O "$HERE/recolor.swift" -o "$WORK/recolor"

# PNG の2枚
for path in \
  web/public/illustrations/interview-illustration.png \
  web/public/images/readingbook_woman_green.png; do
  git -C "$ROOT" show "$SOURCE_REF:$path" >"$WORK/in.png"
  "$WORK/recolor" "$WORK/in.png" "$ROOT/$path" "$COLOR"
  echo "updated $path"
done

# SVG の1枚(中に埋め込まれた PNG を塗り替えて、埋め込み直す)
svg=web/public/illustrations/inspiration-simple-green.svg
git -C "$ROOT" show "$SOURCE_REF:$svg" >"$WORK/in.svg"
grep -oE 'data:image/png;base64,[A-Za-z0-9+/=]+' "$WORK/in.svg" | head -1 |
  cut -d, -f2 | base64 -d >"$WORK/in.png"
"$WORK/recolor" "$WORK/in.png" "$WORK/out.png" "$COLOR"
python3 -I - "$WORK/in.svg" "$WORK/out.png" "$ROOT/$svg" <<'EOF'
import base64, re, sys
svg = open(sys.argv[1]).read()
b64 = base64.b64encode(open(sys.argv[2], "rb").read()).decode()
out, n = re.subn(r"(data:image/png;base64,)[A-Za-z0-9+/=]+",
                 lambda m: m.group(1) + b64, svg, count=1)
assert n == 1, "embedded PNG not found"
open(sys.argv[3], "w").write(out)
EOF
echo "updated $svg"
echo "done: #$COLOR"
