'use client';

import React from 'react';
import { Search, X, Clock, Star, ArrowUpDown, Sparkles } from 'lucide-react';
import { PlaceFilterOptions } from '@/types';
import { triggerHaptic } from '@/lib/telegram';

interface PlaceFiltersProps {
  filters: PlaceFilterOptions;
  onChange: (newFilters: PlaceFilterOptions) => void;
  onSearchSubmit?: (query: string) => void;
}

export const PlaceFilters: React.FC<PlaceFiltersProps> = ({
  filters,
  onChange,
  onSearchSubmit,
}) => {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleClear = () => {
    triggerHaptic('selection');
    onChange({ ...filters, search: '' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit(filters.search || '');
    }
  };

  const toggleOpenNow = () => {
    triggerHaptic('selection');
    onChange({ ...filters, open_now: !filters.open_now });
  };

  const toggleSort = () => {
    triggerHaptic('selection');
    const nextSort = filters.sort_by === 'rating' ? 'distance' : 'rating';
    onChange({ ...filters, sort_by: nextSort });
  };

  const toggleRating = () => {
    triggerHaptic('selection');
    onChange({ ...filters, min_rating: filters.min_rating === 4.5 ? undefined : 4.5 });
  };

  return (
    <div className="space-y-2.5">
      {/* Search Input Bar (Matches Image 1: 'Joy nomini qidirish' with X) */}
      <div className="relative flex items-center shadow-sm">
        <Search className="absolute left-4 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={filters.search || ''}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Joy nomini qidirish"
          className="w-full pl-11 pr-11 py-3 bg-white dark:bg-slate-800/95 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200/80 dark:border-slate-700/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />

        {filters.search && (
          <button
            onClick={handleClear}
            className="absolute right-3.5 p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            aria-label="Tozalash"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        <button
          onClick={toggleOpenNow}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            filters.open_now
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Ochiq</span>
        </button>

        <button
          onClick={toggleRating}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            filters.min_rating === 4.5
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>4.5+ Reyting</span>
        </button>

        <button
          onClick={toggleSort}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 hover:border-slate-300 transition-all shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{filters.sort_by === 'rating' ? 'Reyting bo\'yicha' : 'Eng yaqin'}</span>
        </button>
      </div>
    </div>
  );
};
