'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Navigation, Phone, Globe, Clock, Bookmark, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { Place } from '@/types';
import { placesApi } from '@/lib/api';
import { useLocation } from '@/context/LocationContext';
import { formatDistance, openGoogleMaps, openYandexMaps } from '@/lib/utils';
import { NavigationModal } from '@/components/common/NavigationModal';
import { triggerHaptic } from '@/lib/telegram';

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const placeId = Number(params.id);
  const { latitude, longitude } = useLocation();

  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  useEffect(() => {
    if (placeId) {
      placesApi.getPlaceDetail(placeId, latitude || undefined, longitude || undefined)
        .then((res) => {
          setPlace(res);
          setIsSaved(res.is_saved);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [placeId, latitude, longitude]);

  const handleBookmarkToggle = async () => {
    if (!place) return;
    triggerHaptic('notification', 'success');
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      await placesApi.toggleSavePlace(place.id);
    } catch (e) {
      setIsSaved(!isSaved);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-xs font-medium">Loading details...</span>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="text-center py-12 space-y-3">
        <h2 className="font-bold text-slate-900 dark:text-white text-base">Place not found</h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            triggerHaptic('selection');
            router.back();
          }}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={handleBookmarkToggle}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isSaved
              ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Bookmark className={`w-4.5 h-4.5 ${isSaved ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Place Main Details Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {place.category && (
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold">
                {place.category.name}
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                place.is_open
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
              }`}
            >
              {place.is_open ? 'Open Now' : 'Closed'}
            </span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{place.name}</h1>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-slate-900 dark:text-white font-bold">{place.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{formatDistance(place.distance)}</span>
            </div>
          </div>
        </div>

        {place.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-3">
            {place.description}
          </p>
        )}

        {/* Quick Navigation Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={() => {
              triggerHaptic('impact', 'medium');
              openGoogleMaps(place.latitude, place.longitude, place.name);
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Google Maps</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('impact', 'medium');
              openYandexMaps(place.latitude, place.longitude);
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Yandex Maps</span>
          </button>
        </div>
      </div>

      {/* Info List Section */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Contact & Location</h3>

        <div className="space-y-3 text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{place.address}</span>
          </div>

          {place.phone && (
            <a href={`tel:${place.phone}`} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400">
              <Phone className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span className="font-semibold">{place.phone}</span>
            </a>
          )}

          {place.website && (
            <a href={place.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline">
              <Globe className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span className="truncate">{place.website}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Working Hours Card */}
      {place.working_hours && Object.keys(place.working_hours).length > 0 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Clock className="w-4.5 h-4.5 text-blue-500" />
            <span>Working Hours</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {Object.entries(place.working_hours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between text-slate-600 dark:text-slate-300 capitalize py-0.5">
                <span className="font-semibold">{day}</span>
                <span className="font-mono text-slate-900 dark:text-white">{hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
