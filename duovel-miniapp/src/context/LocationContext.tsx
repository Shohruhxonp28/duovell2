'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

interface LocationContextType {
  latitude: number | null;
  longitude: number | null;
  hasPermission: boolean;
  isLocating: boolean;
  requestLocation: () => Promise<boolean>;
}

const DEFAULT_LAT = 41.311081;
const DEFAULT_LNG = 69.240562;

const LocationContext = createContext<LocationContextType>({
  latitude: DEFAULT_LAT,
  longitude: DEFAULT_LNG,
  hasPermission: false,
  isLocating: false,
  requestLocation: async () => false,
});

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [latitude, setLatitude] = useState<number | null>(DEFAULT_LAT);
  const [longitude, setLongitude] = useState<number | null>(DEFAULT_LNG);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  useEffect(() => {
    // Attempt saved location from localStorage
    const savedLat = localStorage.getItem('duovel_lat');
    const savedLng = localStorage.getItem('duovel_lng');
    if (savedLat && savedLng) {
      setLatitude(parseFloat(savedLat));
      setLongitude(parseFloat(savedLng));
      setHasPermission(true);
    }
  }, []);

  const requestLocation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setIsLocating(false);
        resolve(false);
        return;
      }

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setHasPermission(true);
          setIsLocating(false);

          localStorage.setItem('duovel_lat', lat.toString());
          localStorage.setItem('duovel_lng', lng.toString());

          authApi.updateLocation(lat, lng).catch(() => {});
          resolve(true);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setIsLocating(false);
          setHasPermission(false);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        latitude: latitude ?? DEFAULT_LAT,
        longitude: longitude ?? DEFAULT_LNG,
        hasPermission,
        isLocating,
        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
