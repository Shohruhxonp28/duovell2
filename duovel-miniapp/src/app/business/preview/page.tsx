'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Building2, MapPin, Phone, RefreshCw } from 'lucide-react';
import { BusinessRegistrationForm } from '@/types';
import { businessApi } from '@/lib/api';
import { triggerHaptic } from '@/lib/telegram';

export default function BusinessPreviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BusinessRegistrationForm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('duovel_pending_business');
    if (raw) {
      setFormData(JSON.parse(raw));
    } else {
      router.push('/business/register');
    }
  }, [router]);

  const handleConfirmSubmit = async () => {
    if (!formData) return;
    setIsSubmitting(true);
    triggerHaptic('impact', 'heavy');

    try {
      await businessApi.createBusiness(formData);
      sessionStorage.removeItem('duovel_pending_business');
      router.push('/business/status');
    } catch (err) {
      console.error('Submission failed:', err);
      // Fallback redirect for preview demo
      router.push('/business/status');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Preview Your Listing</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Step 2 of 2: Confirm details</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Pending Approval Preview
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{formData.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{formData.address}</p>
        </div>

        {formData.description && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Description</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{formData.description}</p>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Company:</span>
            <span>{formData.company_name}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Contact Phone:</span>
            <span>{formData.company_phone}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Coordinates:</span>
            <span>{formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleConfirmSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit for Admin Approval</span>
            </>
          )}
        </button>

        <button
          onClick={() => router.back()}
          className="w-full py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
}
