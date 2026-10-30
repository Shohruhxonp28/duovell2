#!/usr/bin/env bash
set -o errexit

echo "=========================================="
echo "  STARTING DUOVEL ALL-IN-ONE SERVICE      "
echo "=========================================="

# Find Python executable
if command -v python3 &> /dev/null; then
  PY_BIN="python3"
elif command -v python &> /dev/null; then
  PY_BIN="python"
else
  PY_BIN="python3"
fi

# 1. Start Django API Backend on internal 127.0.0.1:8000
echo ">>> Starting Django Backend on http://127.0.0.1:8000..."
cd duovel-backend
$PY_BIN -m gunicorn duovel.wsgi:application --bind 127.0.0.1:8000 --workers 2 --timeout 120 &
cd ..

# 2. Start Telegram Bot in background (if BOT_TOKEN provided)
if [ -n "$BOT_TOKEN" ] && [ "$BOT_TOKEN" != "mock_bot_token_for_dev" ]; then
  echo ">>> Starting Telegram Bot in background..."
  cd duovel-bot
  $PY_BIN main.py &
  cd ..
else
  echo ">>> Note: BOT_TOKEN not provided, skipping Telegram Bot."
fi

# 3. Start Next.js Mini App as main frontend server on Render PORT
TARGET_PORT="${PORT:-3000}"
echo ">>> Starting Next.js Mini App on public port ${TARGET_PORT}..."
cd duovel-miniapp
exec npm run start -- -p "${TARGET_PORT}"
