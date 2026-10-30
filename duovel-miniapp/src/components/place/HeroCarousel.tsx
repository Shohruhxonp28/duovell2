'use client';

import React, { useState, useEffect } from 'react';
import { Place } from '@/types';
import { getPlaceImage } from '@/lib/placeData';
import { triggerHaptic } from '@/lib/telegram';
import { Star, MapPin, Clock, Phone, Sparkles, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';

interface HeroCarouselProps {
  places: Place[];
  onOpenStory?: (index: number) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ places, onOpenStory }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (places.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % places.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [places.length]);

  if (!places || places.length === 0) return null;

  const currentPlace = places[activeIndex];
  const imageUrl = getPlaceImage(currentPlace.name, currentPlace.category?.slug, currentPlace.primary_image);

  const hoursDisplay = currentPlace.working_hours?.restaurant
    ? `Ish vaqti: ${currentPlace.working_hours.restaurant}`
    : currentPlace.working_hours?.mon
    ? `Ish vaqti: ${currentPlace.working_hours.mon}`
    : 'Ish vaqti: 24/7';

  return (
    <div className="relative w-full space-y-2.5">
      {/* Main Slide Card */}
      <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-lg shadow-black/10 border border-slate-100 dark:border-slate-800/80 bg-slate-900 group">
        <img
          src={imageUrl}
          alt={currentPlace.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for ultra legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Tavsiya etiladi</span>
            </span>
            {currentPlace.category && (
              <span className="px-2.5 py-1 rounded-full bg-black/40 text-white/90 text-[10px] font-semibold backdrop-blur-md border border-white/20">
                {currentPlace.category.name}
              </span>
            )}
          </div>

          {onOpenStory && (
            <button
              onClick={(e) => {
                e.preventDefault();
                triggerHaptic('selection');
                onOpenStory(activeIndex);
              }}
              className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold backdrop-blur-md border border-white/25 flex items-center gap-1 transition-all"
            >
              <Layers className="w-3 h-3" />
              <span>Hikoya</span>
            </button>
          )}
        </div>

        {/* Bottom Content Area */}
        <Link
          href={`/places/${currentPlace.id}`}
          onClick={() => triggerHaptic('selection')}
          className="absolute inset-x-0 bottom-0 p-4 z-10 text-white block space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-white drop-shadow-sm group-hover:text-emerald-300 transition-colors">
              {currentPlace.name}
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/90 text-white text-xs font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>{currentPlace.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-200">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium text-[11px] truncate">{hoursDisplay}</span>
            </div>
            {currentPlace.phone && (
              <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-300">
                <Phone className="w-3 h-3 shrink-0" />
                <span className="truncate">{currentPlace.phone}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
            <div className="flex items-center gap-1 text-slate-300 truncate max-w-[80%]">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate">{currentPlace.address}</span>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5 text-xs shrink-0">
              Batafsil <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Pagination Dots (Matches Image 1 & 3) */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {places.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              triggerHaptic('selection');
              setActiveIndex(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? 'w-7 bg-emerald-500 dark:bg-emerald-400'
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

