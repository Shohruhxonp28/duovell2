from aiogram import Router, types
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, MenuButtonWebApp
from config import MINI_APP_URL

router = Router()

@router.message(CommandStart())
async def command_start_handler(message: types.Message) -> None:
    # Set persistent menu button to launch Mini App
    try:
        await message.bot.set_chat_menu_button(
            chat_id=message.chat.id,
            menu_button=MenuButtonWebApp(
                text="Open Duovel",
                web_app=WebAppInfo(url=MINI_APP_URL)
            )
        )
    except Exception as e:
        print(f"Error setting menu button: {e}")

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📍 Open Duovel Mini App",
                    web_app=WebAppInfo(url=MINI_APP_URL)
                )
            ],
            [
                InlineKeyboardButton(
                    text="❓ Help & Info",
                    callback_data="help_info"
                )
            ]
        ]
    )

    welcome_text = (
        f"👋 **Welcome to Duovel**, {message.from_user.first_name}!\n\n"
        "Duovel helps you instantly discover nearby places, businesses, and services:\n"
        "• 🍕 Restaurants & Cafes\n"
        "• 🏥 Clinics & Pharmacies\n"
        "• 🚗 Auto Services\n"
        "• ✂️ Beauty Salons & Fitness\n"
        "• 🏨 Hotels & Shopping Centers\n\n"
        "Tap the button below or use the Menu button to open the Mini App and start exploring near you!"
    )

    await message.answer(welcome_text, reply_markup=keyboard, parse_mode="Markdown")
