import hmac
import hashlib
import json
import urllib.parse
from django.conf import settings

def verify_telegram_init_data(init_data_raw: str, bot_token: str = None) -> tuple[bool, dict]:
    """
    Validates Telegram WebApp initData string using HMAC-SHA256 signature algorithm.
    Returns (is_valid, user_data_dict).
    """
    if not init_data_raw:
        return False, {}

    if not bot_token:
        bot_token = settings.TELEGRAM_BOT_TOKEN

    try:
        parsed_data = dict(urllib.parse.parse_qsl(init_data_raw, keep_blank_values=True))
        received_hash = parsed_data.pop('hash', None)

        if not received_hash:
            # Handle mock initData for local development/testing
            if settings.DEBUG and 'user' in parsed_data:
                try:
                    user_dict = json.loads(parsed_data['user'])
                    return True, user_dict
                except Exception:
                    pass
            return False, {}

        # Construct sorted data check string
        data_check_string = "\n".join(
            f"{key}={parsed_data[key]}"
            for key in sorted(parsed_data.keys())
        )

        # Compute HMAC signature according to Telegram specification
        secret_key = hmac.new(b"WebAppData", bot_token.encode('utf-8'), hashlib.sha256).digest()
        computed_hash = hmac.new(secret_key, data_check_string.encode('utf-8'), hashlib.sha256).hexdigest()

        if hmac.compare_digest(computed_hash, received_hash):
            user_data = json.loads(parsed_data.get('user', '{}'))
            return True, user_data
        
        # Development fallback mode
        if settings.DEBUG:
            user_data = json.loads(parsed_data.get('user', '{}'))
            if user_data:
                return True, user_data

        return False, {}
    except Exception as e:
        if settings.DEBUG:
            print(f"[TelegramAuth] Validation error: {e}")
        return False, {}
