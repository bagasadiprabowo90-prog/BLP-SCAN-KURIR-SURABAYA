import React, { useState, useEffect, useCallback, useMemo } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { Header } from "./components/Header";
import { CourierTabs } from "./components/CourierTabs";
import { ScannerSection } from "./components/ScannerSection";
import { SummarySection } from "./components/SummarySection";
import { DataTable } from "./components/DataTable";
import { Toast } from "./components/Toast";
import { PrintTemplate } from "./components/PrintTemplate";

import { ScanItem, CourierType } from "./types";
import { COURIERS } from "./constants";

// ✅ Ambil URL WebApp Google Script dari .env / .env.local
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}

const generateId = () => {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const App: React.FC = () => {
  // =========================
  // STATE
  // =========================
  const [scannedItems, setScannedItems] = useState<ScanItem[]>(() => {
    const saved = localStorage.getItem("blp_scan_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [activeCourier, setActiveCourier] = useState<CourierType>("SHOPEE");
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // ✅ pointer sync (hanya kirim data baru)
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => {
    return localStorage.getItem("blp_last_synced_at") || "";
  });

  // =========================
  // PERSISTENCE (LOCALSTORAGE)
  // =========================
  useEffect(() => {
    localStorage.setItem("blp_scan_data", JSON.stringify(scannedItems));
  }, [scannedItems]);

  useEffect(() => {
    localStorage.setItem("blp_last_synced_at", lastSyncedAt);
  }, [lastSyncedAt]);

  // =========================
  // TOAST
  // =========================
  const addToast = useCallback(
    (message: string, type: "success" | "error" | "warning") => {
      const id = generateId();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  // =========================
  // SCAN
  // =========================
  const handleScan = useCallback(
    (receiptNumber: string) => {
      const cleanReceipt = receiptNumber.trim().toUpperCase();
      if (!cleanReceipt) return;

      const isDuplicate = scannedItems.some(
        (item) => item.receiptNumber === cleanReceipt
      );

      // Nomor urut reset per hari
      const todayStr = new Date().toDateString();
      const itemsToday = scannedItems.filter(
        (item) => new Date(item.scannedAt).toDateString() === todayStr
      );

      const maxDailyNumber = itemsToday.reduce(
        (max, item) => Math.max(max, item.dailyNumber || 0),
        0
      );
      const nextNumber = maxDailyNumber + 1;

      const newItem: ScanItem = {
        id: generateId(),
        receiptNumber: cleanReceipt,
        courier: activeCourier,
        scannedAt: new Date().toISOString(),
        isDuplicate,
        dailyNumber: nextNumber,
      };

      setScannedItems((prev) => [newItem, ...prev]);

      const msg = isDuplicate
        ? `Resi ${cleanReceipt} Duplikat!`
        : `Resi tersimpan! (No. ${nextNumber})`;

      addToast(msg, isDuplicate ? "error" : "success");
    },
    [activeCourier, scannedItems, addToast]
  );

  // =========================
  // DELETE / CLEAR
  // =========================
  const handleDeleteItem = useCallback(
    (id: string) => {
      setScannedItems((prev) => prev.filter((item) => item.id !== id));
      addToast("Data dihapus", "warning");
    },
    [addToast]
  );

  const handleClearAll = useCallback(() => {
    setScannedItems([]);
    localStorage.removeItem("blp_scan_data");
    addToast("Database berhasil dikosongkan.", "success");
  }, [addToast]);

  const handleDeleteDuplicates = useCallback(() => {
    const initialCount = scannedItems.length;
    const filtered = scannedItems.filter((item) => !item.isDuplicate);

    if (initialCount - filtered.length > 0) {
      setScannedItems(filtered);
      addToast(`${initialCount - filtered.length} data duplikat dihapus`, "success");
    } else {
      addToast("Tidak ada data duplikat", "warning");
    }
  }, [scannedItems, addToast]);

  // =========================
  // EXPORT EXCEL (ExcelJS)
  // =========================
  const handleExportExcel = useCallback(async () => {
    if (scannedItems.length === 0) {
      addToast("Tidak ada data untuk di-export", "warning");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data Scan");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Nomor Resi", key: "resi", width: 30 },
        { header: "Kurir", key: "kurir", width: 15 },
        { header: "Waktu Scan", key: "waktu", width: 22 },
        { header: "Status", key: "status", width: 12 },
      ];

      worksheet.getRow(1).font = { bold: true };

      // Data dari lama -> baru
      scannedItems
        .slice()
        .reverse()
        .forEach((item) => {
          worksheet.addRow({
            id: item.dailyNumber ?? "",
            resi: item.receiptNumber,
            kurir: item.courier,
            waktu: new Date(item.scannedAt).toLocaleString("id-ID"),
            status: item.isDuplicate ? "DUPLIKAT" : "OK",
          });
        });

      worksheet.getColumn("id").alignment = { horizontal: "center" };
      worksheet.getColumn("kurir").alignment = { horizontal: "center" };
      worksheet.getColumn("status").alignment = { horizontal: "center" };
      worksheet.getColumn("waktu").alignment = { horizontal: "center" };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `BLP_Scan_${new Date().toISOString().slice(0, 10)}.xlsx`;
      saveAs(blob, fileName);

      addToast("Download Excel Berhasil!", "success");
    } catch (error) {
      console.error(error);
      addToast("Gagal membuat Excel", "error");
    }
  }, [scannedItems, addToast]);

  // =========================
  // SYNC GOOGLE SHEETS
  // =========================
  const handleSync = useCallback(async () => {
    if (scannedItems.length === 0) {
      addToast("Data kosong.", "warning");
      return;
    }

    if (!GOOGLE_SCRIPT_URL) {
      addToast("URL Google Script kosong! cek .env.local", "error");
      return;
    }

    // 1) hanya data baru sejak sync terakhir
    const newItems = scannedItems.filter((item) => {
      if (!lastSyncedAt) return true;
      return (
        new Date(item.scannedAt).getTime() > new Date(lastSyncedAt).getTime()
      );
    });

    if (newItems.length === 0) {
      addToast("✅ Tidak ada data baru untuk sync.", "success");
      return;
    }

    // 2) sort supaya ID masuk urut
    const newItemsSorted = [...newItems].sort((a, b) => {
      const da = a.dailyNumber || 0;
      const db = b.dailyNumber || 0;
      if (da !== db) return da - db;

      return (
        new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime()
      );
    });

    const payload = newItemsSorted.map((item) => ({
      id: item.id,
      dailyNumber: item.dailyNumber,
      receiptNumber: item.receiptNumber,
      courier: item.courier,
      scannedAt: item.scannedAt,
      isDuplicate: item.isDuplicate,
    }));

    setIsSyncing(true);
    addToast(`Mengirim ${payload.length} data baru...`, "warning");

    try {
      // anti-cache + anti redirect error
      const url = `${GOOGLE_SCRIPT_URL}?nocache=${Date.now()}`;

      const response = await fetch(url, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let result: any = null;
      try {
        result = JSON.parse(text);
      } catch {
        result = null;
      }

      if (!response.ok) {
        addToast(`❌ Sync gagal (HTTP ${response.status})`, "error");
        console.error("Sync HTTP Error:", response.status, text);
        return;
      }

      if (!result?.success) {
        addToast(`❌ Sync gagal: ${result?.message || "Unknown error"}`, "error");
        console.error("Sync Script Error:", result, text);
        return;
      }

      // update sync pointer
      const newest = newItemsSorted[newItemsSorted.length - 1];
      setLastSyncedAt(newest.scannedAt);

      addToast(
        `✅ Sync berhasil! Added: ${result.added ?? "-"}, Skipped: ${result.skipped ?? "-"}`,
        "success"
      );
    } catch (error) {
      console.error("Sync Error:", error);
      addToast("❌ Gagal koneksi ke Google Script", "error");
    } finally {
      setIsSyncing(false);
    }
  }, [scannedItems, lastSyncedAt, addToast]);

  // =========================
  // PRINT
  // =========================
  const handlePrint = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  }, []);

  // =========================
  // MEMO DATA
  // =========================
  const duplicatesCount = useMemo(
    () => scannedItems.filter((item) => item.isDuplicate).length,
    [scannedItems]
  );

  const courierCounts = useMemo(() => {
    const counts = COURIERS.reduce(
      (acc, c) => ({ ...acc, [c.id]: 0 }),
      {} as Record<CourierType, number>
    );

    scannedItems.forEach((item) => {
      counts[item.courier] = (counts[item.courier] || 0) + 1;
    });

    return counts;
  }, [scannedItems]);

  const printItems = useMemo(
    () =>
      scannedItems
        .filter((item) => item.courier === activeCourier)
        .slice()
        .reverse(),
    [scannedItems, activeCourier]
  );

  // =========================
  // RENDER
  // =========================
  return (
    <>
      {/* SCREEN UI */}
      <div id="screen-content" className="min-h-screen flex flex-col bg-slate-50">
        <Header
          onSync={handleSync}
          onExport={handleExportExcel}
          onPrint={handlePrint}
        />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
          <CourierTabs
            activeCourier={activeCourier}
            onSelect={setActiveCourier}
            counts={courierCounts}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <ScannerSection activeCourier={activeCourier} onScan={handleScan} />
              <SummarySection
                total={scannedItems.length}
                duplicates={duplicatesCount}
                counts={courierCounts}
              />
            </div>

            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
              <DataTable
                items={scannedItems}
                onClear={handleClearAll}
                onDelete={handleDeleteItem}
                onDeleteDuplicates={handleDeleteDuplicates}
              />
            </div>
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400 font-medium">
            BLP SCAN KURIR &copy; 2025
          </div>
        </footer>

        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} />
          ))}

          {isSyncing && (
            <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse font-bold">
              🔄 Sedang Sync...
            </div>
          )}
        </div>
      </div>

      {/* PRINT AREA */}
      <div id="print-area">
        <PrintTemplate items={printItems} activeCourier={activeCourier} />
      </div>
    </>
  );
};

export default App;
