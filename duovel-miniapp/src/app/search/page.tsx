'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Compass, RefreshCw } from 'lucide-react';
import { Place, PlaceFilterOptions } from '@/types';
import { placesApi } from '@/lib/api';
import { useLocation } from '@/context/LocationContext';
import { PlaceCard } from '@/components/place/PlaceCard';
import { PlaceFilters } from '@/components/place/PlaceFilters';

function SearchContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');

  const { latitude, longitude } = useLocation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<PlaceFilterOptions>({
    category: categoryParam || undefined,
    search: queryParam || '',
    sort_by: 'distance',
  });

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const results = await placesApi.getPlaces(filters, latitude || undefined, longitude || undefined);
      setPlaces(results);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [filters.category, filters.search, filters.open_now, filters.min_rating, filters.sort_by, latitude, longitude]);

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Joy qidirish</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Nom, toifa yoki reyting bo'yicha qidiring
        </p>
      </div>

      <PlaceFilters filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {places.length} ta natija ko'rsatilmoqda
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
          <span className="text-xs font-semibold">Qidirilmoqda...</span>
        </div>
      ) : places.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
          <Search className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Natija topilmadi</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Boshqa so'z bilan qidirib ko'ring yoki filtrlarni tozalang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
          <span className="text-xs font-semibold">Qidiruv sahifasi yuklanmoqda...</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
