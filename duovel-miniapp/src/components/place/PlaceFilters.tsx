'use client';

import React from 'react';
import { Search, SlidersHorizontal, Clock, Star, ArrowUpDown } from 'lucide-react';
import { PlaceFilterOptions } from '@/types';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit(filters.search || '');
    }
  };

  const toggleOpenNow = () => {
    onChange({ ...filters, open_now: !filters.open_now });
  };

  const toggleSort = () => {
    const nextSort = filters.sort_by === 'rating' ? 'distance' : 'rating';
    onChange({ ...filters, sort_by: nextSort });
  };

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          value={filters.search || ''}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Search restaurants, clinics, cafes..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        <button
          onClick={toggleOpenNow}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            filters.open_now
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Open Now</span>
        </button>

        <button
          onClick={toggleSort}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-all shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort: {filters.sort_by === 'rating' ? 'Rating' : 'Nearest'}</span>
        </button>

        <button
          onClick={() => onChange({ ...filters, min_rating: filters.min_rating === 4.5 ? undefined : 4.5 })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            filters.min_rating === 4.5
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>4.5+ Rating</span>
        </button>
      </div>
    </div>
  );
};
