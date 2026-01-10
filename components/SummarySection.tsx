
import React from 'react';
import { CourierType } from '../types';
import { COURIERS } from '../constants';

interface SummarySectionProps {
  total: number;
  duplicates: number;
  counts: Record<CourierType, number>;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ total, duplicates, counts }) => {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V5" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
            <p className="text-xl font-bold text-slate-800 leading-none">{total}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duplikat</p>
            <p className="text-xl font-bold text-red-500 leading-none">{duplicates}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-slate-100 pt-6">
        {COURIERS.map((courier) => (
          <div key={courier.id} className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${courier.color.replace('bg-', 'bg-')}`}></div>
            <p className="text-xs font-medium text-slate-600 truncate">
              {courier.label}: <span className="font-bold text-slate-900">{counts[courier.id] || 0}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
