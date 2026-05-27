#!/bin/bash
# ClawMart CN — Build & Restart 前后端
# 用法:
#   ./restart.sh          # 重启前后端（不重新 build）
#   ./restart.sh build    # build 前端 + 重启前后端
#   ./restart.sh frontend # 仅重启前端
#   ./restart.sh backend  # 仅重启后端

set -e

PROJECT="/home/ubuntu/clawmart-cn"
BACKEND="$PROJECT/backend"
FRONTEND="$PROJECT/frontend"

log() { echo -e "\033[1;36m[$(date '+%H:%M:%S')] $*\033[0m"; }
ok()  { echo -e "\033[1;32m✓ $*\033[0m"; }
err() { echo -e "\033[1;31m✗ $*\033[0m"; }

restart_backend() {
  log "重启 backend (clawmart-cn-backend)..."
  pm2 restart clawmart-cn-backend
  ok "Backend 已重启 → http://127.0.0.1:8072"
}

restart_frontend() {
  log "重启 frontend (clawmart-cn-frontend)..."
  pm2 restart clawmart-cn-frontend
  ok "Frontend 已重启 → http://127.0.0.1:3113"
}

build_frontend() {
  log "安装 npm 依赖..."
  cd "$FRONTEND" && npm install --silent
  log "Build Next.js 前端..."
  cd "$FRONTEND" && npm run build
  ok "Frontend build 完成"
}

MODE="${1:-restart}"

case "$MODE" in
  build)
    build_frontend
    restart_backend
    restart_frontend
    ;;
  frontend)
    restart_frontend
    ;;
  backend)
    restart_backend
    ;;
  restart|*)
    restart_backend
    restart_frontend
    ;;
esac

log "PM2 状态:"
pm2 list --no-color | grep -E "clawmart-cn|name"
