'use client';

import React from 'react';
import Link from 'next/link';
import { User, Building2, Moon, Sun, MapPin, ChevronRight, ShieldCheck } from 'lucide-react';
import { useTelegram } from '@/context/TelegramContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { triggerHaptic } from '@/lib/telegram';

export default function ProfilePage() {
  const { user } = useTelegram();
  const { theme, toggleTheme } = useTheme();
  const { hasPermission, requestLocation } = useLocation();

  return (
    <div className="space-y-5 pb-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20">
          {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
        </div>
        <div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
            {user?.first_name || 'Guest User'} {user?.last_name || ''}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.username ? `@${user.username}` : `Telegram ID: ${user?.telegram_id || 'N/A'}`}
          </p>
        </div>
      </div>

      {/* Business Section Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-3xl shadow-lg shadow-blue-500/20 space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Building2 className="w-5 h-5" />
          <span>Business Owner Portal</span>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed">
          Own a restaurant, cafe, clinic or service? Submit your business to Duovel to get discovered by nearby customers!
        </p>

        <div className="flex items-center gap-2 pt-2">
          <Link
            href="/business/register"
            onClick={() => triggerHaptic('selection')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white text-blue-700 font-bold text-xs text-center shadow-md active:scale-98 transition-transform"
          >
            Register Business
          </Link>
          <Link
            href="/business/status"
            onClick={() => triggerHaptic('selection')}
            className="py-2.5 px-4 rounded-xl bg-blue-500/30 text-white font-semibold text-xs border border-white/20 hover:bg-blue-500/40 transition-colors"
          >
            My Submissions
          </Link>
        </div>
      </div>

      {/* Preferences Settings List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-2 border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
        <button
          onClick={() => {
            triggerHaptic('selection');
            toggleTheme();
          }}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Moon className="w-4.5 h-4.5 text-slate-500" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
            <span className="font-semibold text-slate-900 dark:text-white">Dark Mode</span>
          </div>
          <span className="text-slate-400 capitalize">{theme}</span>
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
            <span className="font-semibold text-slate-900 dark:text-white">Location Permissions</span>
          </div>
          <span className={`font-semibold ${hasPermission ? 'text-emerald-500' : 'text-amber-500'}`}>
            {hasPermission ? 'Granted' : 'Request'}
          </span>
        </button>
      </div>

      <div className="text-center text-[11px] text-slate-400 py-2">
        Duovel Telegram Mini App v1.0.0 • No ads • No payments
      </div>
    </div>
  );
}
