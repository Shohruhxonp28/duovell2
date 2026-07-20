import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher
from config import BOT_TOKEN
from handlers import start, help, admin

async def main():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        stream=sys.stdout,
    )

    if not BOT_TOKEN or BOT_TOKEN == "mock_bot_token_for_dev":
        logging.warning("BOT_TOKEN is not set or using mock_bot_token_for_dev. Bot will start in dry-run mode.")

    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()

    # Register routers
    dp.include_router(start.router)
    dp.include_router(help.router)
    dp.include_router(admin.router)

    logging.info("Starting Duovel Telegram Bot...")
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot stopped.")
