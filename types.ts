
export type CourierType = 'SHOPEE' | 'J&T' | 'GOTO' | 'INSTAN' | 'BEBAS';

export interface ScanItem {
  id: string;
  receiptNumber: string;
  courier: CourierType;
  scannedAt: string;
  isDuplicate: boolean;
  dailyNumber: number; // <--- INI NOMOR URUT (1, 2, 3...)
}

export interface CourierConfig {
  id: CourierType;
  label: string;
  color: string;
  borderColor: string;
}
