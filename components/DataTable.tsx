import React, { useState, useEffect } from 'react';
import { ScanItem } from '../types';

interface DataTableProps {
  items: ScanItem[];
  onClear: () => void;
  onDelete: (id: string) => void;
  onDeleteDuplicates?: () => void; 
}

export const DataTable: React.FC<DataTableProps> = ({ items, onClear, onDelete, onDeleteDuplicates }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    let timeout: number;
    if (isConfirming) {
      timeout = setTimeout(() => setIsConfirming(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isConfirming]);

  const formatScanTime = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours} : ${minutes}`;
  };

  const hasDuplicates = items.some(i => i.isDuplicate);

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white">
        <h3 className="text-base font-bold text-slate-700">Tidak ada hasil scan</h3>
        <p className="text-xs text-slate-400 mt-1">Gunakan scanner di samping untuk mulai.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Riwayat Scan</span>
          <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {items.length} Data
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {hasDuplicates && onDeleteDuplicates && (
            <button type="button" onClick={onDeleteDuplicates} className="cursor-pointer text-[10px] font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-500 border border-orange-100 px-3 py-1.5 rounded-lg transition-all">
              Hapus Duplikat
            </button>
          )}

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isConfirming) { onClear(); setIsConfirming(false); } 
              else { setIsConfirming(true); }
            }}
            className={`cursor-pointer relative z-50 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95
              ${isConfirming ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' : 'text-red-600 bg-white border border-red-100 hover:bg-red-50'}`}
          >
            {isConfirming ? 'Yakin Hapus?' : 'Hapus Semua'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto z-10 bg-white">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-20">
            <tr className="bg-white">
              <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-full"># &bull; Nomor Resi</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-44">Waktu Scan</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Kurir</th>
              <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className={`group transition-all ${item.isDuplicate ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${item.isDuplicate ? 'bg-red-200 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.dailyNumber}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm font-mono font-bold truncate ${item.isDuplicate ? 'text-red-700' : 'text-slate-800'}`}>{item.receiptNumber}</span>
                      {item.isDuplicate && <span className="text-[9px] font-black text-red-600 uppercase flex items-center gap-1 mt-0.5">DUPLIKAT</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className="text-[10px] font-bold text-slate-400 tabular-nums">{formatScanTime(item.scannedAt)}</span></td>
                <td className="px-4 py-3.5"><span className="text-[9px] font-black px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 shadow-sm">{item.courier}</span></td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => onDelete(item.id)} className="cursor-pointer p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-all md:opacity-0 group-hover:opacity-100">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};