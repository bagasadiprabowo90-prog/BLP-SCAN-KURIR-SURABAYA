
import React from 'react';
import { CourierType } from '../types';
import { COURIERS } from '../constants';

interface CourierTabsProps {
  activeCourier: CourierType;
  onSelect: (courier: CourierType) => void;
  onPrintCourier: (courier: CourierType) => void;
  counts: Record<CourierType, number>;
}

export const CourierTabs: React.FC<CourierTabsProps> = ({ activeCourier, onSelect, onPrintCourier, counts }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {COURIERS.map((courier) => {
        const isActive = activeCourier === courier.id;
        const count = counts[courier.id] || 0;
        
        return (
          <div 
            key={courier.id}
            className="flex flex-col gap-1 group"
          >
            <button
              onClick={() => onSelect(courier.id)}
              className={`
                relative flex flex-col items-center justify-center py-2.5 px-2 rounded-t-lg border-2 border-b-0 transition-all duration-200 w-full
                ${isActive 
                  ? `${courier.borderColor} ${courier.color} text-white shadow-sm` 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }
              `}
            >
              <span className={`text-[9px] font-black tracking-widest mb-0.5 uppercase ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                {courier.label}
              </span>
              <span className="text-2xl font-black leading-none">
                {count}
              </span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrintCourier(courier.id);
              }}
              disabled={count === 0}
              className={`
                flex items-center justify-center gap-1.5 py-1.5 rounded-b-lg text-[10px] font-bold uppercase tracking-wider transition-all border-2 border-t-0
                ${isActive
                  ? `${courier.borderColor} bg-white text-slate-800 hover:bg-slate-50`
                  : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
                }
                ${count === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={`Cetak Manifest ${courier.label}`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        );
      })}
    </div>
  );
};
