'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, MapPin, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useTelegram } from '@/context/TelegramContext';
import { Category, Place, PlaceFilterOptions } from '@/types';
import { categoriesApi, placesApi } from '@/lib/api';
import { PlaceCard } from '@/components/place/PlaceCard';
import { PlaceFilters } from '@/components/place/PlaceFilters';
import { CategoriesGrid } from '@/components/place/CategoriesGrid';
import { HeroCarousel } from '@/components/place/HeroCarousel';
import { PlaceStoryModal } from '@/components/place/PlaceStoryModal';
import { triggerHaptic } from '@/lib/telegram';

export default function HomePage() {
  const { latitude, longitude, hasPermission, requestLocation } = useLocation();
  const { isLoading: isTelegramLoading } = useTelegram();

  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [filters, setFilters] = useState<PlaceFilterOptions>({ sort_by: 'distance' });
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [storyInitialIndex, setStoryInitialIndex] = useState(0);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catsRes, placesRes] = await Promise.all([
        categoriesApi.getCategories(),
        placesApi.getPlaces({ ...filters, category: selectedCategory }, latitude || undefined, longitude || undefined)
      ]);
      setCategories(catsRes);
      setPlaces(placesRes);
    } catch (e) {
      console.error('Failed loading home data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, filters.open_now, filters.min_rating, filters.sort_by, filters.search, latitude, longitude]);

  const featuredPlaces = places.slice(0, 5);

  const handleOpenStory = (index: number) => {
    setStoryInitialIndex(index);
    setStoryModalOpen(true);
  };

  if (isTelegramLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 animate-pulse">
          <Compass className="w-9 h-9 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Duovel</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yaqin atrofdagi joylar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-300">
      {/* Search & Quick Filters Bar (Matches Image 1) */}
      <PlaceFilters
        filters={filters}
        onChange={setFilters}
        onSearchSubmit={() => triggerHaptic('selection')}
      />

      {/* Featured Places Hero Carousel with Pagination Dots (Matches Image 1 & 3) */}
      {featuredPlaces.length > 0 && !filters.search && !selectedCategory && (
        <HeroCarousel
          places={featuredPlaces}
          onOpenStory={handleOpenStory}
        />
      )}

      {/* 8 Categories Grid in 4x2 Layout (Matches Image 1) */}
      <CategoriesGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Places List Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
            {selectedCategory
              ? (categories.find((c) => c.slug === selectedCategory)?.name || 'Tanlangan toifa')
              : 'Yaqin atrofdagi joylar'}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {places.length} ta natija topildi
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => {
              triggerHaptic('selection');
              setSelectedCategory(undefined);
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Filtrni tozalash
          </button>
        )}
      </div>

      {/* Places List Feed */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
          <span className="text-xs font-semibold">Joylar izlanmoqda...</span>
        </div>
      ) : places.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Joylar topilmadi</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}

      {/* Fullscreen Place Story Modal (Matches Image 3) */}
      <PlaceStoryModal
        isOpen={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
        places={featuredPlaces}
        initialIndex={storyInitialIndex}
      />
    </div>
  );
}
