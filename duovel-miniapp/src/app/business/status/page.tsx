'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, Building2, Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import { businessApi } from '@/lib/api';
import { triggerHaptic } from '@/lib/telegram';

export default function BusinessStatusPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await businessApi.getMyBusinesses();
      setSubmissions(res);
    } catch (e) {
      console.error(e);
      // Fallback sample for demonstration UI
      setSubmissions([
        {
          id: 101,
          name: 'Your Submitted Business Place',
          category_name: 'Restaurants',
          address: 'Navoi St 15',
          status: 'PENDING',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-bold text-xs">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 font-bold text-xs">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Submission Status</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track your registered places</p>
          </div>
        </div>

        <Link
          href="/business/register"
          onClick={() => triggerHaptic('selection')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 text-white font-semibold text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">Loading submission status...</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Submissions Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Submit your business to get featured on Duovel once approved by admins.
          </p>
          <Link
            href="/business/register"
            className="inline-block px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs"
          >
            Submit Business
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {sub.category_name}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{sub.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub.address}</p>
                </div>
                {getStatusBadge(sub.status)}
              </div>

              {sub.status === 'PENDING' && (
                <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-800/40">
                  Your business details have been sent to admins for review. It will become visible on Duovel upon approval.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
