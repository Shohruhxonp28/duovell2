'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark, RefreshCw } from 'lucide-react';
import { Place } from '@/types';
import { placesApi } from '@/lib/api';
import { useLocation } from '@/context/LocationContext';
import { PlaceCard } from '@/components/place/PlaceCard';

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
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Saved Places</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Your favorite bookmarked places for quick access.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">Loading saved places...</span>
        </div>
      ) : savedPlaces.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Saved Places Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Tap the bookmark icon on any place card to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
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
