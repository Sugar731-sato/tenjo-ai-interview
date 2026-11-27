#!/bin/bash
# イラストの緑を、1色に塗り替えてリポジトリのファイルを上書きする(macOS 専用)。
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

path=web/public/illustrations/interview-illustration.png
git -C "$ROOT" show "$SOURCE_REF:$path" >"$WORK/in.png"
"$WORK/recolor" "$WORK/in.png" "$ROOT/$path" "$COLOR"
echo "updated $path"
echo "done: #$COLOR"
