from aiogram import Router, types
from aiogram.filters import Command
from config import ADMIN_IDS

router = Router()

@router.message(Command("admin"))
async def command_admin_handler(message: types.Message) -> None:
    if message.from_user.id not in ADMIN_IDS:
        await message.answer("⛔ You do not have administrator permissions.")
        return

    await message.answer(
        "🛠️ **Admin Controls**\n\n"
        "To approve or reject business submissions, please log into the Django Admin panel.\n"
        "All business logic & approvals are managed centrally in Django Admin."
    )
