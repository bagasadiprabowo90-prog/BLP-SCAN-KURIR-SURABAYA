import React, { useState, useRef, useEffect } from 'react';
import { CourierType } from '../types';

interface ScannerSectionProps {
  activeCourier: CourierType;
  onScan: (receiptNumber: string) => void;
}

export const ScannerSection: React.FC<ScannerSectionProps> = ({ activeCourier, onScan }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onScan(inputValue);
      setInputValue('');
    }
  };

  // --- PERBAIKAN ADA DI SINI ---
  useEffect(() => {
    // Hanya fokus saat pertama kali buka atau saat ganti tab kurir
    // Kita HAPUS 'window.addEventListener' agar tidak mengganggu tombol Print
    inputRef.current?.focus();
  }, [activeCourier]); 
  // -----------------------------

  // Visual helper for the input based on courier
  const getBrandColor = () => {
    switch (activeCourier) {
      case 'SHOPEE': return 'border-orange-500 text-orange-600';
      case 'J&T': return 'border-red-500 text-red-600';
      case 'GOTO': return 'border-emerald-500 text-emerald-600';
      case 'INSTAN': return 'border-amber-500 text-amber-600';
      case 'BEBAS': return 'border-indigo-500 text-indigo-600';
      default: return 'border-slate-400 text-slate-600';
    }
  };

  const getBgColor = () => {
    switch (activeCourier) {
      case 'SHOPEE': return 'bg-orange-500';
      case 'J&T': return 'bg-red-500';
      case 'GOTO': return 'bg-emerald-500';
      case 'INSTAN': return 'bg-amber-500';
      case 'BEBAS': return 'bg-indigo-600';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className={`p-6 bg-white border-2 rounded-2xl shadow-sm transition-all duration-300 ${getBrandColor().split(' ')[0]}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getBrandColor()}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">Target: {activeCourier}</h2>
            <p className="text-xs text-slate-500 italic font-medium">Klik tab di atas untuk pindah kategori resi</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`SCAN NOMOR RESI ${activeCourier}...`}
            className="w-full h-14 pl-5 pr-12 text-lg font-mono font-bold tracking-widest bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all uppercase placeholder:text-slate-300 placeholder:font-normal"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className={`flex h-3 w-3 rounded-full animate-pulse ${getBgColor()}`}></span>
          </div>
        </div>
        <button
          type="submit"
          className={`px-8 h-14 font-black text-white rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wide
            ${getBgColor()} hover:brightness-110
          `}
        >
          Input
        </button>
      </form>
    </div>
  );
};