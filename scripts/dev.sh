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

# 兜底清理：pid 文件记录的是 wrapper 进程，真实 node 可能残留并占用端口
# （Windows/Git Bash 下曾出现 stop "成功"但 server 仍监听、新实例端口漂移）
cleanup_stale_node() {
    local port pid image
    for port in 3005 3006; do
        while read -r pid; do
            [[ -z "$pid" ]] && continue
            image="$(tasklist //FI "PID eq $pid" //FO CSV //NH 2>/dev/null | head -1 | cut -d',' -f1 | tr -d '"')"
            if [[ "$image" == "node.exe" ]]; then
                echo "清理端口 $port 上的残留 node 进程 (PID $pid)"
                taskkill //F //PID "$pid" >/dev/null 2>&1 || true
            fi
        done < <(netstat -ano 2>/dev/null | grep "LISTENING" | grep -E ":$port " | awk '{print $NF}' | sort -u)
    done
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
        cleanup_stale_node
        return 0
    fi
    local pid
    pid="$(cat "$PID_FILE")"
    kill "$pid" 2>/dev/null || true
    sleep 1
    kill -9 "$pid" 2>/dev/null || true
    rm -f "$PID_FILE"
    echo "dev server 已停止 (PID $pid)"
    cleanup_stale_node
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
