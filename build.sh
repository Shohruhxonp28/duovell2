#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=========================================="
echo "  DUOVEL ALL-IN-ONE BUILD SCRIPT (RENDER) "
echo "=========================================="

# Find Python executable
if command -v python3 &> /dev/null; then
  PY_BIN="python3"
elif command -v python &> /dev/null; then
  PY_BIN="python"
else
  echo "Python not found, installing python3..."
  apt-get update && apt-get install -y python3 python3-pip || true
  PY_BIN="python3"
fi

echo ">>> Using Python: $($PY_BIN --version 2>&1)"

# Ensure pip is available
if ! $PY_BIN -m pip --version &> /dev/null; then
  echo ">>> pip not found, bootstrapping pip..."
  curl -sS https://bootstrap.pypa.io/get-pip.py | $PY_BIN
fi

# 1. Install Backend & Bot requirements
echo ">>> Installing Backend dependencies..."
$PY_BIN -m pip install -r duovel-backend/requirements.txt
echo ">>> Installing Bot dependencies..."
$PY_BIN -m pip install -r duovel-bot/requirements.txt

# 2. Run Django setup
echo ">>> Setting up Django Database & Staticfiles..."
cd duovel-backend
$PY_BIN manage.py collectstatic --no-input
$PY_BIN manage.py migrate
$PY_BIN manage.py seed_data
cd ..

# 3. Ensure Node.js exists
if ! command -v node &> /dev/null; then
  echo ">>> Node.js not detected in PATH. Downloading portable Node.js..."
  NODE_VER="v20.12.2"
  curl -sL https://nodejs.org/dist/${NODE_VER}/node-${NODE_VER}-linux-x64.tar.xz | tar -xJ
  export PATH="$PWD/node-${NODE_VER}-linux-x64/bin:$PATH"
fi

echo ">>> Using Node: $(node -v)"
echo ">>> Using NPM: $(npm -v)"

# 4. Build Next.js Mini App
echo ">>> Building Next.js Mini App..."
cd duovel-miniapp
npm install
npm run build
cd ..

echo "=========================================="
echo "  BUILD FINISHED SUCCESSFULLY!            "
echo "=========================================="
