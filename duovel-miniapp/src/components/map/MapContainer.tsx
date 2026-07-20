'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';
import { Place } from '@/types';
import { formatDistance, openGoogleMaps, openYandexMaps } from '@/lib/utils';
import { NavigationModal } from '../common/NavigationModal';

interface MapContainerProps {
  userLat: number;
  userLng: number;
  places: Place[];
  onPlaceSelect?: (place: Place) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  userLat,
  userLng,
  places,
  onPlaceSelect,
}) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(places[0] || null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Constructs OSM Embed URL centered around current location or selected place
  const activeLat = selectedPlace ? selectedPlace.latitude : userLat;
  const activeLng = selectedPlace ? selectedPlace.longitude : userLng;

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${activeLng - 0.015}%2C${activeLat - 0.015}%2C${activeLng + 0.015}%2C${activeLat + 0.015}&layer=mapnik&marker=${activeLat}%2C${activeLng}`;

  return (
    <div className="relative w-full h-[calc(100vh-180px)] rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
      {/* Map Iframe */}
      <iframe
        title="Interactive Map"
        width="100%"
        height="100%"
        src={osmUrl}
        className="w-full h-full border-0 filter dark:contrast-125 dark:hue-rotate-180 dark:invert"
      />

      {/* Places Pill List overlay on top */}
      <div className="absolute top-3 left-3 right-3 z-10 overflow-x-auto flex gap-2 no-scrollbar pb-1">
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <button
              key={place.id}
              onClick={() => {
                setSelectedPlace(place);
                if (onPlaceSelect) onPlaceSelect(place);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shadow-md transition-all shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md hover:bg-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{place.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Place Detail Card floating at bottom of map */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-slate-100 dark:border-slate-800 space-y-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {selectedPlace.category?.name || 'Place'}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                {selectedPlace.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {selectedPlace.address}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                ★ {selectedPlace.rating.toFixed(1)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {formatDistance(selectedPlace.distance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setIsNavOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions (Google / Yandex)</span>
            </button>
          </div>
        </div>
      )}

      {selectedPlace && (
        <NavigationModal
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          placeName={selectedPlace.name}
          lat={selectedPlace.latitude}
          lng={selectedPlace.longitude}
        />
      )}
    </div>
  );
};
