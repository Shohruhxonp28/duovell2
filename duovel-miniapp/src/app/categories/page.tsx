'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Utensils, Coffee, Stethoscope, Pill, Car, Scissors, ShoppingBag, Dumbbell, Hotel, ChevronRight } from 'lucide-react';
import { Category } from '@/types';
import { categoriesApi } from '@/lib/api';
import { triggerHaptic } from '@/lib/telegram';

const ICON_MAP: Record<string, any> = {
  Utensils, Coffee, Stethoscope, Pill, Car, Scissors, ShoppingBag, Dumbbell, Hotel
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    categoriesApi.getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Explore Categories</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Select a category to view top places and services near you.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Compass;
            return (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                onClick={() => triggerHaptic('selection')}
                className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5.5 h-5.5" />
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {cat.places_count ?? 0} places
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
