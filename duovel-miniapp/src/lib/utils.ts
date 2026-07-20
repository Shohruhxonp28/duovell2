import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(km: number): string {
  if (!km || km <= 0) return 'Nearby';
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function openGoogleMaps(lat: number, lng: number, name?: string) {
  const query = name ? encodeURIComponent(name) : `${lat},${lng}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${lat},${lng}`;
  window.open(url, '_blank');
}

export function openYandexMaps(lat: number, lng: number) {
  const url = `https://yandex.com/maps/?rtext=~${lat},${lng}`;
  window.open(url, '_blank');
}
