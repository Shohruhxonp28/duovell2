'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Utensils, 
  Coffee, 
  Stethoscope, 
  Pill, 
  Car, 
  Scissors, 
  ShoppingBag, 
  ShoppingCart, 
  Dumbbell, 
  Hotel, 
  Gamepad2, 
  Trees, 
  Landmark, 
  ChevronRight 
} from 'lucide-react';
import { Category } from '@/types';
import { categoriesApi } from '@/lib/api';
import { triggerHaptic } from '@/lib/telegram';

const ICON_MAP: Record<string, any> = {
  Utensils, Coffee, Stethoscope, Pill, Car, Scissors, ShoppingBag, ShoppingCart, Dumbbell, Hotel, Gamepad2, Trees, Landmark
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
    <div className="space-y-4 pb-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Barcha toifalar</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          O'zingizga kerakli xizmat turini tanlang
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
                className="bg-white dark:bg-slate-800/95 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group active:scale-95"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Joylar mavjud
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
