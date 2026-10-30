'use client';

import React from 'react';
import { 
  Car, 
  Utensils, 
  Hotel, 
  Gamepad2, 
  Stethoscope, 
  ShoppingCart, 
  Trees, 
  Landmark, 
  Sparkles,
  Compass
} from 'lucide-react';
import { Category } from '@/types';
import { triggerHaptic } from '@/lib/telegram';

interface CategoriesGridProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (slug?: string) => void;
}

// 8 Core Categories from User's Design with icons and distinct vibrant color gradients
const CORE_CATEGORIES = [
  {
    name: 'Taksi',
    slug: 'taksi',
    icon: Car,
    bgGradient: 'from-amber-400 to-amber-500',
    shadowColor: 'shadow-amber-500/20',
    iconColor: 'text-amber-950',
    badge: 'Tezkor',
  },
  {
    name: 'Restoran va Kafe',
    slug: 'restoran-kafe',
    icon: Utensils,
    bgGradient: 'from-orange-500 to-rose-500',
    shadowColor: 'shadow-orange-500/20',
    iconColor: 'text-white',
    badge: null,
  },
  {
    name: 'Mehmonxona',
    slug: 'mehmonxona',
    icon: Hotel,
    bgGradient: 'from-blue-500 to-indigo-600',
    shadowColor: 'shadow-blue-500/20',
    iconColor: 'text-white',
    badge: null,
  },
  {
    name: 'Game club',
    slug: 'game-club',
    icon: Gamepad2,
    bgGradient: 'from-purple-500 to-indigo-700',
    shadowColor: 'shadow-purple-500/20',
    iconColor: 'text-white',
    badge: 'Play',
  },
  {
    name: 'Shifoxona',
    slug: 'shifoxona',
    icon: Stethoscope,
    bgGradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/20',
    iconColor: 'text-white',
    badge: '24/7',
  },
  {
    name: 'Bozor va do\'kon',
    slug: 'bozor-dokon',
    icon: ShoppingCart,
    bgGradient: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/20',
    iconColor: 'text-white',
    badge: null,
  },
  {
    name: 'Bog\' va Parklar',
    slug: 'bog-parklar',
    icon: Trees,
    bgGradient: 'from-green-500 to-emerald-600',
    shadowColor: 'shadow-green-500/20',
    iconColor: 'text-white',
    badge: null,
  },
  {
    name: 'Bank va Bankamat',
    slug: 'bank-bankamat',
    icon: Landmark,
    bgGradient: 'from-slate-700 to-slate-900',
    shadowColor: 'shadow-slate-500/20',
    iconColor: 'text-white',
    badge: 'ATM',
  },
];

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-3">
      {/* Header with All reset */}
      <div className="flex items-center justify-between px-0.5">
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span>Kategoriyalar</span>
        </h2>

        {selectedCategory && (
          <button
            onClick={() => {
              triggerHaptic('selection');
              onSelectCategory(undefined);
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Barchasini ko'rsatish</span>
          </button>
        )}
      </div>

      {/* 4x2 Responsive Grid matching Screenshot 1 */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {CORE_CATEGORIES.map((item) => {
          const IconComp = item.icon;
          const isSelected = selectedCategory === item.slug;

          return (
            <button
              key={item.slug}
              onClick={() => {
                triggerHaptic('selection');
                onSelectCategory(isSelected ? undefined : item.slug);
              }}
              className={`flex flex-col items-center justify-start text-center group transition-all duration-200 active:scale-95 ${
                isSelected ? 'scale-105' : ''
              }`}
            >
              {/* Modern Rounded Circle / Squircle Icon Container */}
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${item.shadowColor} ${
                  isSelected
                    ? 'ring-4 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105'
                    : 'group-hover:scale-105'
                } bg-gradient-to-tr ${item.bgGradient}`}
              >
                <IconComp className={`w-7 h-7 sm:w-8 sm:h-8 ${item.iconColor} drop-shadow-sm`} />

                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-black border border-white/40 shadow-sm leading-none">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label below */}
              <span
                className={`mt-1.5 text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2 h-7 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                    : 'text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

