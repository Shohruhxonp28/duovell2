'use client';

import React, { useEffect, useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { Place } from '@/types';
import { placesApi } from '@/lib/api';
import { MapContainer } from '@/components/map/MapContainer';
import { RefreshCw } from 'lucide-react';

export default function MapPage() {
  const { latitude, longitude } = useLocation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    placesApi.getPlaces({}, latitude || undefined, longitude || undefined)
      .then(setPlaces)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [latitude, longitude]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-xs font-medium">Loading Map View...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Interactive Map</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tap a place pin to preview details and get navigation.</p>
        </div>
      </div>

      <MapContainer
        userLat={latitude || 41.311081}
        userLng={longitude || 69.240562}
        places={places}
      />
    </div>
  );
}
