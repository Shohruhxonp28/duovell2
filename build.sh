#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=========================================="
echo "  DUOVEL ALL-IN-ONE BUILD SCRIPT (RENDER) "
echo "=========================================="

# 1. Install Python packages for backend & bot
echo ">>> Installing Backend dependencies..."
pip install -r duovel-backend/requirements.txt
echo ">>> Installing Bot dependencies..."
pip install -r duovel-bot/requirements.txt

# 2. Run Django migrations, staticfiles collection & seed data
echo ">>> Setting up Django Database & Staticfiles..."
cd duovel-backend
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed_data
cd ..

# 3. Ensure Node.js & npm exist (auto-download portable Node if in Render Python environment)
if ! command -v node &> /dev/null; then
  echo ">>> Node.js not detected in PATH. Downloading portable Node.js v20..."
  NODE_VER="v20.12.2"
  curl -sL https://nodejs.org/dist/${NODE_VER}/node-${NODE_VER}-linux-x64.tar.xz | tar -xJ
  export PATH="$PWD/node-${NODE_VER}-linux-x64/bin:$PATH"
fi

echo ">>> Node version: $(node -v)"
echo ">>> NPM version: $(npm -v)"

# 4. Build Next.js Mini App
echo ">>> Building Next.js Mini App..."
cd duovel-miniapp
npm install
npm run build
cd ..

echo "=========================================="
echo "  BUILD FINISHED SUCCESSFULLY!            "
echo "=========================================="
