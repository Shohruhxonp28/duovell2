'use client';

import React from 'react';
import { X, Navigation, ExternalLink } from 'lucide-react';
import { openGoogleMaps, openYandexMaps } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  lat: number;
  lng: number;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({
  isOpen,
  onClose,
  placeName,
  lat,
  lng,
}) => {
  if (!isOpen) return null;

  const handleGoogleMaps = () => {
    triggerHaptic('impact', 'medium');
    openGoogleMaps(lat, lng, placeName);
    onClose();
  };

  const handleYandexMaps = () => {
    triggerHaptic('impact', 'medium');
    openYandexMaps(lat, lng);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
            <Navigation className="w-4.5 h-4.5" />
            <span>Open Navigation</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{placeName}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose your preferred navigation app:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-1">
          <button
            onClick={handleGoogleMaps}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-semibold text-slate-900 dark:text-white group transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-black text-sm">G</span>
              <span>Google Maps</span>
            </div>
            <ExternalLink className="w-4.5 h-4.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
          </button>

          <button
            onClick={handleYandexMaps}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-semibold text-slate-900 dark:text-white group transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm">Y</span>
              <span>Yandex Maps</span>
            </div>
            <ExternalLink className="w-4.5 h-4.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
