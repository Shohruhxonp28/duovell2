'use client';

import React from 'react';
import Link from 'next/link';
import { User, Building2, Moon, Sun, MapPin, ChevronRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useTelegram } from '@/context/TelegramContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { triggerHaptic } from '@/lib/telegram';

export default function ProfilePage() {
  const { user } = useTelegram();
  const { theme, toggleTheme } = useTheme();
  const { hasPermission, requestLocation } = useLocation();

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800/95 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-500/25">
          {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight truncate">
              {user?.first_name || 'Foydalanuvchi'} {user?.last_name || ''}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
              Faol
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {user?.username ? `@${user.username}` : `Telegram ID: ${user?.telegram_id || 'Mehmon'}`}
          </p>
        </div>
      </div>

      {/* Business Section Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 text-white p-5 rounded-3xl shadow-xl shadow-emerald-600/20 space-y-3">
        <div className="flex items-center gap-2 font-black text-sm tracking-wide">
          <Building2 className="w-5 h-5 text-emerald-300" />
          <span>Biznes egalari uchun</span>
        </div>
        <p className="text-xs text-emerald-50/90 leading-relaxed">
          Restoran, kafe, mehmonxona, klinika yoki o'z xizmatingiz bormi? Duovel platformasiga qo'shiling va yaqin atrofdagi yangi mijozlarni jalb qiling!
        </p>

        <div className="flex items-center gap-2.5 pt-2">
          <Link
            href="/business/register"
            onClick={() => triggerHaptic('selection')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white text-emerald-800 font-extrabold text-xs text-center shadow-md active:scale-98 transition-transform"
          >
            Biznesni ro'yxatdan o'tkazish
          </Link>
          <Link
            href="/business/status"
            onClick={() => triggerHaptic('selection')}
            className="py-2.5 px-3.5 rounded-xl bg-white/20 text-white font-bold text-xs border border-white/25 hover:bg-white/30 transition-colors"
          >
            Arizalar
          </Link>
        </div>
      </div>

      {/* Preferences Settings List */}
      <div className="bg-white dark:bg-slate-800/95 rounded-3xl p-2 border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
        <button
          onClick={() => {
            triggerHaptic('selection');
            toggleTheme();
          }}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Moon className="w-4.5 h-4.5 text-slate-500" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
            <span className="font-bold text-slate-900 dark:text-white">Tungi rejim (Dark Mode)</span>
          </div>
          <span className="text-slate-400 font-medium capitalize">
            {theme === 'dark' ? 'Yoqilgan' : 'O\'chirilgan'}
          </span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('selection');
            requestLocation();
          }}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4.5 h-4.5 text-slate-500" />
            <span className="font-bold text-slate-900 dark:text-white">Geolokatsiya (GPS)</span>
          </div>
          <span className={`font-bold ${hasPermission ? 'text-emerald-500' : 'text-amber-500'}`}>
            {hasPermission ? 'Faol (Ruxsat berilgan)' : 'GPS yoqish'}
          </span>
        </button>

        <Link
          href="/saved"
          onClick={() => triggerHaptic('selection')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4.5 h-4.5 text-rose-500" />
            <span className="font-bold text-slate-900 dark:text-white">Saqlangan sevimli joylar</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      <div className="text-center text-[11px] text-slate-400 py-3">
        Duovel Telegram Mini App v2.0 • Reklamasiz va bepul
      </div>
    </div>
  );
}
