#!/usr/bin/env bash
# vue-tsc 类型检查（build 模式，项目引用见 tsconfig.json）
# 用法：scripts/typecheck.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VUE_TSC_BIN="$ROOT/node_modules/vue-tsc/bin/vue-tsc.js"

if [[ ! -f "$VUE_TSC_BIN" ]]; then
    echo "未找到 vue-tsc：$VUE_TSC_BIN，请先安装依赖" >&2
    exit 1
fi

cd "$ROOT"
node "$VUE_TSC_BIN" -b
echo "类型检查通过"
