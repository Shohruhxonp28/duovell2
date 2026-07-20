'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, MapPin, Sparkles, Utensils, Coffee, Stethoscope, Pill, Car, Scissors, ShoppingBag, Dumbbell, Hotel, ArrowRight, RefreshCw } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useTelegram } from '@/context/TelegramContext';
import { Category, Place, PlaceFilterOptions } from '@/types';
import { categoriesApi, placesApi } from '@/lib/api';
import { PlaceCard } from '@/components/place/PlaceCard';
import { PlaceFilters } from '@/components/place/PlaceFilters';
import { triggerHaptic } from '@/lib/telegram';

const ICON_MAP: Record<string, any> = {
  Utensils, Coffee, Stethoscope, Pill, Car, Scissors, ShoppingBag, Dumbbell, Hotel
};

export default function HomePage() {
  const { latitude, longitude, hasPermission, requestLocation, isLocating } = useLocation();
  const { isLoading: isTelegramLoading, user } = useTelegram();

  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [filters, setFilters] = useState<PlaceFilterOptions>({ sort_by: 'distance' });
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('duovel_seen_welcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const dismissWelcome = () => {
    localStorage.setItem('duovel_seen_welcome', 'true');
    setShowWelcome(false);
  };

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
  }, [selectedCategory, filters.open_now, filters.min_rating, filters.sort_by, latitude, longitude]);

  if (isTelegramLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 animate-pulse">
          <Compass className="w-9 h-9 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Duovel</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Discovering places near you...</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="flex flex-col items-center justify-between min-h-[75vh] py-6 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 mt-6">
          <Compass className="w-11 h-11" />
        </div>

        <div className="space-y-3 px-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Discover What's Nearby</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
            Find top-rated cafes, clinics, auto repair, and shops around you with instant turn-by-turn navigation in Google Maps & Yandex Maps.
          </p>
        </div>

        <div className="w-full space-y-3 pt-4">
          <button
            onClick={() => {
              triggerHaptic('impact', 'medium');
              requestLocation();
              dismissWelcome();
            }}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-4.5 h-4.5" />
            <span>Enable Location & Explore</span>
          </button>

          <button
            onClick={dismissWelcome}
            className="w-full py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Location Permission Alert Banner if not enabled */}
      {!hasPermission && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-amber-900 dark:text-amber-200 font-medium">
              Enable location to see exact distances to places near you.
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('selection');
              requestLocation();
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold shrink-0 shadow-sm"
          >
            Enable
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <PlaceFilters
        filters={filters}
        onChange={setFilters}
        onSearchSubmit={(q) => {
          triggerHaptic('selection');
        }}
      />

      {/* Categories Horizontal Scroll */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Categories
          </h2>
          <Link
            href="/categories"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              triggerHaptic('selection');
              setSelectedCategory(undefined);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === undefined
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All</span>
          </button>

          {categories.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || Compass;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedCategory(isSelected ? undefined : cat.slug);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Places List Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="font-bold text-base text-slate-900 dark:text-white">
          {selectedCategory ? `${categories.find(c => c.slug === selectedCategory)?.name || 'Places'}` : 'Nearby Places'}
        </h2>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {places.length} results
        </span>
      </div>

      {/* Places Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">Finding nearby places...</span>
        </div>
      ) : places.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Places Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Try adjusting your search query or filters to discover places near you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
