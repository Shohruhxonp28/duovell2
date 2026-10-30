'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bookmark, ShoppingCart, User } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram';

export const BottomNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Bosh sahifa', icon: Home },
    { href: '/saved', label: 'Sevimli', icon: Bookmark },
    { href: '/orders', label: 'Buyurtma', icon: ShoppingCart },
    { href: '/profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] py-1.5 transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => triggerHaptic('selection')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-500 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-colors ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/50' : ''}`}>
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'
                  }`}
                />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
