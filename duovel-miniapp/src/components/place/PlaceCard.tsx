'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Navigation, Bookmark, Clock, Phone } from 'lucide-react';
import { Place } from '@/types';
import { formatDistance, openGoogleMaps } from '@/lib/utils';
import { getPlaceImage } from '@/lib/placeData';
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

  const imageUrl = getPlaceImage(place.name, place.category?.slug, place.primary_image);

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

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('impact', 'light');
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800/95 rounded-3xl p-3.5 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800/80 transition-all duration-200 space-y-3 group">
        <Link href={`/places/${place.id}`} className="block space-y-3">
          {/* Card Top Row: Image & Key Details */}
          <div className="flex gap-3">
            {/* Thumbnail Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700 shadow-sm">
              <img
                src={imageUrl}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm backdrop-blur-md ${
                  place.is_open
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-rose-500/90 text-white'
                }`}
              >
                {place.is_open ? 'Ochiq' : 'Yopiq'}
              </span>
            </div>

            {/* Info Column */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  {place.category && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide truncate max-w-[140px]">
                      {place.category.name}
                    </span>
                  )}
                  <button
                    onClick={handleBookmark}
                    className={`p-1.5 rounded-full transition-colors ${
                      isSaved
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    aria-label="Saqlash"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {place.name}
                </h3>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {place.description || place.address}
                </p>
              </div>

              {/* Rating and Distance */}
              <div className="flex items-center gap-3 text-xs pt-1">
                <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{place.rating.toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>{formatDistance(place.distance)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[55%]">
              <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{place.address}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {place.phone && (
                <a
                  href={`tel:${place.phone}`}
                  onClick={handleCallClick}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all"
                  aria-label="Qo'ng'iroq qilish"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={handleNavigateClick}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Marshrut</span>
              </button>
            </div>
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
