from aiogram import Router, types, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from config import MINI_APP_URL

router = Router()

HELP_TEXT = (
    "ℹ️ **How to use Duovel:**\n\n"
    "1️⃣ **Discover Places**: Open the Mini App to find nearby places sorted by distance.\n"
    "2️⃣ **Categories & Search**: Filter by categories (Clinics, Cafes, Auto Services, etc.) or keywords.\n"
    "3️⃣ **Direct Navigation**: Tap any place to get turn-by-turn navigation in **Google Maps** or **Yandex Maps**.\n"
    "4️⃣ **Business Registration**: Business owners can submit their places directly inside the Mini App for approval!\n\n"
    "No ads. No subscriptions. Completely free."
)

@router.message(Command("help"))
async def command_help_handler(message: types.Message) -> None:
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📍 Launch Duovel",
                    web_app=WebAppInfo(url=MINI_APP_URL)
                )
            ]
        ]
    )
    await message.answer(HELP_TEXT, reply_markup=keyboard, parse_mode="Markdown")

@router.callback_query(F.data == "help_info")
async def callback_help_handler(callback: types.CallbackQuery) -> None:
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📍 Launch Duovel",
                    web_app=WebAppInfo(url=MINI_APP_URL)
                )
            ]
        ]
    )
    await callback.message.edit_text(HELP_TEXT, reply_markup=keyboard, parse_mode="Markdown")
    await callback.answer()
