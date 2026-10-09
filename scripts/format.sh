#!/usr/bin/env bash
# prettier 格式化：src 修 src/ 源码（默认），all 全量（含根配置与文档），check 仅检查
# 用法：scripts/format.sh {src|all|check}
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRETTIER_BIN="$ROOT/node_modules/prettier/bin/prettier.cjs"

if [[ ! -f "$PRETTIER_BIN" ]]; then
    echo "未找到 prettier：$PRETTIER_BIN，请先安装依赖" >&2
    exit 1
fi

cd "$ROOT"

case "${1:-src}" in
    src) node "$PRETTIER_BIN" --write src/ ;;
    all) node "$PRETTIER_BIN" --write . ;;
    check) node "$PRETTIER_BIN" --check src/ ;;
    *)
        echo "用法：$0 {src|all|check}" >&2
        exit 1
        ;;
esac
