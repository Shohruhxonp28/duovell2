'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowLeft, MapPin, Phone, Globe, Clock, ChevronRight } from 'lucide-react';
import { Category, BusinessRegistrationForm } from '@/types';
import { categoriesApi } from '@/lib/api';
import { useLocation } from '@/context/LocationContext';
import { triggerHaptic } from '@/lib/telegram';

export default function BusinessRegisterPage() {
  const router = useRouter();
  const { latitude, longitude } = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState<BusinessRegistrationForm>({
    company_name: '',
    company_phone: '',
    category_id: 0,
    name: '',
    description: '',
    address: '',
    latitude: latitude || 41.311081,
    longitude: longitude || 69.240562,
    phone: '',
    website: '',
    working_hours: { all: '09:00-21:00' },
  });

  useEffect(() => {
    categoriesApi.getCategories().then((res) => {
      setCategories(res);
      if (res.length > 0) {
        setForm((prev) => ({ ...prev, category_id: res[0].id }));
      }
    });
  }, []);

  const handleChange = (field: keyof BusinessRegistrationForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('notification', 'success');
    // Store in sessionStorage for preview page
    sessionStorage.setItem('duovel_pending_business', JSON.stringify(form));
    router.push('/business/preview');
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Submit Your Business</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Step 1 of 2: Fill place details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Company Info */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Company Info</h3>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Company / Owner Name</label>
            <input
              type="text"
              required
              value={form.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              placeholder="e.g. Gourmet Group LLC"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Owner Contact Phone</label>
            <input
              type="tel"
              required
              value={form.company_phone}
              onChange={(e) => handleChange('company_phone', e.target.value)}
              placeholder="e.g. +998 90 123 4567"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Place Details */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Place Profile</h3>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Place / Business Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Italian Coffee Bar"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => handleChange('category_id', Number(e.target.value))}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Street Address</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Navoi St 15, City Center"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={form.latitude}
                onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={form.longitude}
                onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your place and offerings..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Preview Submission</span>
          <ChevronRight className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
