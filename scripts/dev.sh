#!/usr/bin/env bash
# 大屏前端 dev server 启停（日志统一落 logs/，端口与代理见 vite.config.ts）
# 用法：scripts/dev.sh {start|stop|restart|status}
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT/logs"
PID_FILE="$LOG_DIR/dev.pid"
LOG_FILE="$LOG_DIR/dev.log"
VITE_BIN="$ROOT/node_modules/vite/bin/vite.js"

mkdir -p "$LOG_DIR"

is_running() {
    [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null
}

start() {
    if is_running; then
        echo "dev server 已在运行 (PID $(cat "$PID_FILE"))"
        return 0
    fi
    if [[ ! -f "$VITE_BIN" ]]; then
        echo "未找到 vite：$VITE_BIN，请先安装依赖" >&2
        exit 1
    fi
    cd "$ROOT"
    # 直接起 vite 而非 pnpm dev：PID 即真实进程，停服不会留孤儿
    nohup node "$VITE_BIN" > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "dev server 已启动 (PID $(cat "$PID_FILE"))，日志：$LOG_FILE"
}

stop() {
    if ! is_running; then
        echo "dev server 未在运行"
        rm -f "$PID_FILE"
        return 0
    fi
    local pid
    pid="$(cat "$PID_FILE")"
    kill "$pid" 2>/dev/null || true
    sleep 1
    kill -9 "$pid" 2>/dev/null || true
    rm -f "$PID_FILE"
    echo "dev server 已停止 (PID $pid)"
}

status() {
    if is_running; then
        echo "运行中 (PID $(cat "$PID_FILE"))"
    else
        echo "未运行"
    fi
}

case "${1:-start}" in
    start) start ;;
    stop) stop ;;
    restart)
        stop
        start
        ;;
    status) status ;;
    *)
        echo "用法：$0 {start|stop|restart|status}" >&2
        exit 1
        ;;
esac
