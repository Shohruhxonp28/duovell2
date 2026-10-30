#!/usr/bin/env bash
set -o errexit

echo "=========================================="
echo "  STARTING DUOVEL ALL-IN-ONE SERVICE      "
echo "=========================================="

# Add portable node to PATH if downloaded during build
if [ -d "$PWD/node-v20.12.2-linux-x64/bin" ]; then
  export PATH="$PWD/node-v20.12.2-linux-x64/bin:$PATH"
fi

# 1. Start Django API Backend on internal 127.0.0.1:8000
echo ">>> Starting Django Backend on http://127.0.0.1:8000..."
cd duovel-backend
gunicorn duovel.wsgi:application --bind 127.0.0.1:8000 --workers 2 --timeout 120 &
cd ..

# 2. Start Telegram Bot in background (if BOT_TOKEN provided)
if [ -n "$BOT_TOKEN" ] && [ "$BOT_TOKEN" != "mock_bot_token_for_dev" ]; then
  echo ">>> Starting Telegram Bot in background..."
  cd duovel-bot
  python main.py &
  cd ..
else
  echo ">>> Note: BOT_TOKEN not provided, skipping Telegram Bot."
fi

# 3. Start Next.js Mini App as main frontend server on Render PORT
TARGET_PORT="${PORT:-3000}"
echo ">>> Starting Next.js Mini App on public port ${TARGET_PORT}..."
cd duovel-miniapp
exec npm run start -- -p "${TARGET_PORT}"
