'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Navigation, Bookmark, Clock, Phone } from 'lucide-react';
import { Place } from '@/types';
import { formatDistance } from '@/lib/utils';
import { placesApi } from '@/lib/api';
import { NavigationModal } from '../common/NavigationModal';
import { triggerHaptic } from '@/lib/telegram';

interface PlaceCardProps {
  place: Place;
  onBookmarkToggle?: (placeId: number, isSaved: boolean) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onBookmarkToggle }) => {
  const [isSaved, setIsSaved] = useState(place.is_saved);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('notification', 'success');
    try {
      const nextSaved = !isSaved;
      setIsSaved(nextSaved);
      await placesApi.toggleSavePlace(place.id);
      if (onBookmarkToggle) {
        onBookmarkToggle(place.id, nextSaved);
      }
    } catch (err) {
      setIsSaved(!isSaved);
    }
  };

  const handleNavigateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('impact', 'medium');
    setIsNavOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-4 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all space-y-3 group">
        <Link href={`/places/${place.id}`} className="block space-y-3">
          {/* Header info */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {place.category && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
                    {place.category.name}
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    place.is_open
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {place.is_open ? 'Open Now' : 'Closed'}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {place.name}
              </h3>
            </div>

            <button
              onClick={handleBookmark}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isSaved
                  ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-300 hover:text-slate-700'
              }`}
            >
              <Bookmark className={`w-4.5 h-4.5 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {place.description || place.address}
          </p>

          {/* Details footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{place.rating.toFixed(1)}</span>
              </div>

              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{formatDistance(place.distance)}</span>
              </div>
            </div>

            <button
              onClick={handleNavigateClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route</span>
            </button>
          </div>
        </Link>
      </div>

      <NavigationModal
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        placeName={place.name}
        lat={place.latitude}
        lng={place.longitude}
      />
    </>
  );
};
