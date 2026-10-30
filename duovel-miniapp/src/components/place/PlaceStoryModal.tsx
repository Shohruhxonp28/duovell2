'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Phone, Navigation, Clock, MapPin, Sparkles } from 'lucide-react';
import { Place } from '@/types';
import { getPlaceImage } from '@/lib/placeData';
import { triggerHaptic } from '@/lib/telegram';
import { openGoogleMaps } from '@/lib/utils';
import Link from 'next/link';

interface PlaceStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  initialIndex?: number;
}

export const PlaceStoryModal: React.FC<PlaceStoryModalProps> = ({
  isOpen,
  onClose,
  places,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || places.length === 0) return null;

  const currentPlace = places[currentIndex] || places[0];
  const imageUrl = getPlaceImage(currentPlace.name, currentPlace.category?.slug, currentPlace.primary_image);

  const handleNext = () => {
    triggerHaptic('selection');
    setCurrentIndex((prev) => (prev + 1) % places.length);
  };

  const handlePrev = () => {
    triggerHaptic('selection');
    setCurrentIndex((prev) => (prev - 1 + places.length) % places.length);
  };

  const hoursString = currentPlace.working_hours
    ? (currentPlace.working_hours.restaurant
      ? `Restaurant: ${currentPlace.working_hours.restaurant}`
      : currentPlace.working_hours.mon || '24/7')
    : '24/7';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Story Card Container */}
      <div className="relative w-full max-w-sm h-[92vh] max-h-[760px] mx-4 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10 bg-slate-950">
        {/* Fullscreen Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={currentPlace.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
        </div>

        {/* Top Header / Progress Bars */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Story Progress Indicators */}
          <div className="flex items-center gap-1.5 w-full">
            {places.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'bg-white w-full'
                      : idx < currentIndex
                      ? 'bg-white/80 w-full'
                      : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>Tanlangan Maskon</span>
              </span>
            </div>

            <button
              onClick={() => {
                triggerHaptic('selection');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Touch Triggers */}
        <div className="absolute inset-y-20 inset-x-0 z-10 flex justify-between pointer-events-none">
          <button
            onClick={handlePrev}
            className="w-1/3 h-full pointer-events-auto flex items-center justify-start pl-2 text-white/40 hover:text-white transition-opacity opacity-0 hover:opacity-100"
          >
            <ChevronLeft className="w-8 h-8 drop-shadow" />
          </button>
          <button
            onClick={handleNext}
            className="w-1/3 h-full pointer-events-auto flex items-center justify-end pr-2 text-white/40 hover:text-white transition-opacity opacity-0 hover:opacity-100"
          >
            <ChevronRight className="w-8 h-8 drop-shadow" />
          </button>
        </div>

        {/* Bottom Details Overlay (Matches Image 3) */}
        <div className="relative z-10 p-5 space-y-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
          {/* Card Info Box */}
          <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-white space-y-2 shadow-xl">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {currentPlace.name}
            </h2>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ish vaqti: {hoursString}</span>
              </div>
              {currentPlace.working_hours?.hotel && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Hotel: {currentPlace.working_hours.hotel}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">Manzil: {currentPlace.address}</span>
              </div>
              {currentPlace.phone && (
                <div className="flex items-center gap-2 font-mono font-medium text-emerald-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Tel: {currentPlace.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {currentPlace.phone && (
              <a
                href={`tel:${currentPlace.phone}`}
                onClick={() => triggerHaptic('impact', 'medium')}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 active:scale-98 transition-all"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Qo'ng'iroq</span>
              </a>
            )}

            <button
              onClick={() => {
                triggerHaptic('impact', 'medium');
                openGoogleMaps(currentPlace.latitude, currentPlace.longitude, currentPlace.name);
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md active:scale-98 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Marshrut</span>
            </button>
          </div>

          <Link
            href={`/places/${currentPlace.id}`}
            onClick={() => {
              triggerHaptic('selection');
              onClose();
            }}
            className="block text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1 underline-offset-4 hover:underline"
          >
            Batafsil ma'lumot va izohlar →
          </Link>

          {/* Bottom Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {places.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic('selection');
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? 'w-6 bg-emerald-400'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

