FROM python:3.11-slim

# Install system utilities, curl, build tools & Node.js 20
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy entire repository
COPY . /app

# Install Python requirements
RUN pip install --no-cache-dir -r duovel-backend/requirements.txt \
    && pip install --no-cache-dir -r duovel-bot/requirements.txt

# Setup Django static files
WORKDIR /app/duovel-backend
RUN python manage.py collectstatic --no-input

# Build Next.js Mini App
WORKDIR /app/duovel-miniapp
RUN npm install && npm run build

WORKDIR /app

RUN chmod +x build.sh start.sh

EXPOSE 10000

CMD ["bash", "start.sh"]

