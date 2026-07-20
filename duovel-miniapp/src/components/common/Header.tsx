'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Moon, Sun, MapPin } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-none">Duovel</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Nearby Discovery</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLocationClick}
            disabled={isLocating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              hasPermission 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce' : ''}`} />
            <span>{isLocating ? 'Locating...' : (hasPermission ? 'GPS Active' : 'Enable Location')}</span>
          </button>

          <button
            onClick={handleThemeClick}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
