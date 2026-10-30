'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark, RefreshCw, Compass } from 'lucide-react';
import { Place } from '@/types';
import { placesApi } from '@/lib/api';
import { useLocation } from '@/context/LocationContext';
import { PlaceCard } from '@/components/place/PlaceCard';
import Link from 'next/link';
import { triggerHaptic } from '@/lib/telegram';

export default function SavedPlacesPage() {
  const { latitude, longitude } = useLocation();
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSaved = async () => {
    setIsLoading(true);
    try {
      const res = await placesApi.getSavedPlaces(latitude || undefined, longitude || undefined);
      setSavedPlaces(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, [latitude, longitude]);

  const handleBookmarkToggle = (placeId: number, isSaved: boolean) => {
    if (!isSaved) {
      setSavedPlaces((prev) => prev.filter((p) => p.id !== placeId));
    }
  };

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Sevimli joylar</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Tezkor kirish uchun saqlab qo'yilgan joylar ro'yxati
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
          <span className="text-xs font-semibold">Saqlangan joylar yuklanmoqda...</span>
        </div>
      ) : savedPlaces.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Hali saqlangan joylar yo'q</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Yoqtirgan restoraningiz yoki joyingizdagi xatcho'p (bookmark) belgisini bosib, uni bu yerga saqlab qo'yishingiz mumkin.
          </p>
          <Link
            href="/"
            onClick={() => triggerHaptic('selection')}
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Joylar ro'yxatiga o'tish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {savedPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
