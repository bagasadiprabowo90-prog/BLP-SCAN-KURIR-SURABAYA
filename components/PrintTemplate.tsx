import React from 'react';
import { ScanItem, CourierType } from '../types';

interface PrintTemplateProps {
  items: ScanItem[];
  activeCourier: CourierType;
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({ items, activeCourier }) => {
  const currentDate = new Date();
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  const formattedDateLong = `${dayNames[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch (e) { return "-"; }
  };

  const formatFullDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${date.getDate()} ${shortMonths[date.getMonth()]} ${date.getFullYear()} ${formatTime(isoString)}`;
    } catch (e) { return "-"; }
  };

  return (
    <div className="print-container w-full bg-white text-black p-0">
      
      {/* HEADER: BLP Beauty */}
      <div className="text-center mb-6 pt-2">
        <h1 className="text-4xl font-black tracking-tighter text-black">BLP BEAUTY</h1>
        <p className="text-[10pt] font-bold uppercase tracking-[0.4em] border-t-2 border-black inline-block mt-1 pt-1 px-12">Manifest Pengiriman</p>
      </div>

      {/* INFO BAR */}
      <div className="flex justify-between items-end mb-4 font-bold border-b border-gray-300 pb-2">
        <div className="space-y-0.5">
          <p className="text-[8pt] uppercase text-gray-500 tracking-wider">Ekspedisi / Courier</p>
          <p className="text-2xl font-black uppercase underline underline-offset-4">{activeCourier}</p>
        </div>
        <div className="text-right space-y-0.5">
          <h2 className="text-2xl font-black italic">Blp</h2>
          <p className="text-[9pt]">Bogor, {formattedDateLong}</p>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-y-2 border-black">
              <th className="w-10 text-center py-1.5 font-black uppercase text-[9pt]">No</th>
              <th className="py-1.5 font-black uppercase text-[9pt]">Nomor Resi / Tracking ID</th>
              <th className="w-44 py-1.5 font-black uppercase text-[9pt] text-center">Waktu Scan</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="text-center font-mono py-1 text-[9pt]">{index + 1}</td>
                <td className="font-mono font-bold tracking-wider py-1 text-[10pt] uppercase">{item.receiptNumber}</td>
                <td className="font-mono py-1 text-[9pt] text-center">{formatFullDateTime(item.scannedAt)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-20 italic text-gray-400 uppercase font-bold tracking-widest border-b border-gray-200">
                  -- TIDAK ADA DATA UNTUK KURIR {activeCourier} --
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER & SIGNATURES */}
      <div className="break-inside-avoid mt-12 flex justify-between px-6">
        <div className="text-center min-w-[200px]">
          <p className="text-[9pt] font-black uppercase mb-24">Diserahkan Oleh (Driver),</p>
          <div className="border-b-2 border-black w-full mb-1"></div>
          <p className="text-[8pt] font-bold">( Tanda Tangan & Nama Terang )</p>
        </div>
        
        <div className="text-center min-w-[200px]">
          <p className="text-[9pt] font-black uppercase mb-24">Diterima Oleh (Admin),</p>
          <div className="border-b-2 border-black w-full mb-1"></div>
          <p className="text-[8pt] font-bold">( Tanda Tangan & Nama Terang )</p>
        </div>
      </div>

      {/* SYSTEM INFO */}
      <div className="mt-20 pt-4 border-t border-dotted border-gray-300 flex justify-between text-[8pt] text-gray-400 italic font-medium">
        <p>Dicetak otomatis oleh Sistem BLP Scan Kurir v2.0</p>
        <p>Total Muatan: {items.length} Resi</p>
      </div>

    </div>
  );
};