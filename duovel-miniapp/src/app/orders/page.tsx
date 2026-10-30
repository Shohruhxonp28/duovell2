'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  Utensils,
  Hotel,
  Gamepad2,
  Car
} from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram';

interface OrderItem {
  id: string;
  place_name: string;
  service_type: string;
  icon: any;
  date: string;
  time: string;
  details: string;
  status: 'active' | 'completed' | 'pending';
  phone: string;
  price?: string;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ORD-1042',
      place_name: 'XON Restaurant & Hotel',
      service_type: 'Stol band qilish (VIP zal)',
      icon: Utensils,
      date: 'Bugun',
      time: '19:30',
      details: '4 kishilik stol, deraza yonida',
      status: 'active',
      phone: '+998 91 234 56 78',
      price: 'Bron qilingan'
    },
    {
      id: 'ORD-1039',
      place_name: 'Play Game Club',
      service_type: 'VIP kompyuter zali',
      icon: Gamepad2,
      date: 'Ertaga',
      time: '15:00 - 18:00',
      details: '2 ta RTX 4080 o\'yin kompyuteri',
      status: 'active',
      phone: '+998 93 456 78 90',
      price: '70,000 so\'m / soat'
    },
    {
      id: 'ORD-1021',
      place_name: 'City Taxi Toshkent',
      service_type: 'Shahar bo\'ylab safar',
      icon: Car,
      date: '28 Oktabr',
      time: '18:15',
      details: 'Chorsu Bozori → Mirobod',
      status: 'completed',
      phone: '+998 71 200 55 55',
      price: '28,000 so\'m'
    },
    {
      id: 'ORD-1015',
      place_name: 'Kafe Afruza',
      service_type: 'Kofe va desert buyurtmasi',
      icon: Utensils,
      date: '25 Oktabr',
      time: '14:20',
      details: '2x Kapuchino, 1x San Sebastian',
      status: 'completed',
      phone: '+998 90 123 45 67',
      price: '65,000 so\'m'
    }
  ]);

  const filteredOrders = orders.filter((o) => 
    activeTab === 'active' ? (o.status === 'active' || o.status === 'pending') : o.status === 'completed'
  );

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Buyurtmalar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Joy band qilish va xizmat buyurtmalari
          </p>
        </div>

        <Link
          href="/"
          onClick={() => triggerHaptic('selection')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi buyurtma</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveTab('active');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'active'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Faol ({orders.filter(o => o.status === 'active').length})
        </button>

        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveTab('completed');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'completed'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Tarix ({orders.filter(o => o.status === 'completed').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Buyurtmalar yo'q</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Restoran yoki xizmat ko'rsatish joylarini tanlab buyurtma berishingiz mumkin.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const Icon = order.icon;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-800/95 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {order.place_name}
                      </h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        {order.service_type}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {order.status === 'active' ? 'Faol' : 'Bajarildi'}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.time}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    {order.details}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {order.price}
                  </span>

                  <a
                    href={`tel:${order.phone}`}
                    onClick={() => triggerHaptic('selection')}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Bog'lanish</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

