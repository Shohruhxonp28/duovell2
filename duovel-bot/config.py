import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "mock_bot_token_for_dev")
MINI_APP_URL = os.getenv("MINI_APP_URL", "https://duovel-miniapp.onrender.com")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
ADMIN_IDS = [int(x.strip()) for x in os.getenv("ADMIN_IDS", "").split(",") if x.strip().isdigit()]
