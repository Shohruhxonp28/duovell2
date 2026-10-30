'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Moon, Sun, MapPin, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { triggerHaptic } from '@/lib/telegram';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { hasPermission, isLocating, requestLocation } = useLocation();

  const handleLocationClick = () => {
    triggerHaptic('selection');
    requestLocation();
  };

  const handleThemeClick = () => {
    triggerHaptic('selection');
    toggleTheme();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-4 py-2.5 transition-colors">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white leading-none tracking-tight">
                Duovel
              </h1>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Yaqin atrofdagi xizmatlar</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLocationClick}
            disabled={isLocating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              hasPermission 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce' : ''}`} />
            <span>{isLocating ? 'Aniqlanmoqda...' : (hasPermission ? 'Toshkent' : 'GPS yoqish')}</span>
          </button>

          <button
            onClick={handleThemeClick}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
            aria-label="Rejimni o'zgartirish"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
