// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export const HARI_INDONESIA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const BULAN_INDONESIA = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function formatIndonesianDateFull(d: Date): string {
  if (isNaN(d.getTime())) return '-';
  const hari = HARI_INDONESIA[d.getDay()];
  const tgl = d.getDate();
  const bln = BULAN_INDONESIA[d.getMonth()];
  const thn = d.getFullYear();
  return `${hari}, ${tgl} ${bln} ${thn}`;
}

export function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Calculates calendar difference: years, months, days accurately respecting month lengths and leap years
 */
export function calculateDateDiff(
  startDate: Date,
  endDate: Date
): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  remainingDaysInWeeks: number;
  workDays: number;
  isNegative: boolean;
} {
  let isNegative = false;
  let start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  let end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (start > end) {
    isNegative = true;
    const temp = start;
    start = end;
    end = temp;
  }

  // Exact calendar difference (years, months, days)
  let yDiff = end.getFullYear() - start.getFullYear();
  let mDiff = end.getMonth() - start.getMonth();
  let dDiff = end.getDate() - start.getDate();

  if (dDiff < 0) {
    mDiff--;
    // days in previous month of end date
    const prevMonthDays = getDaysInMonth(end.getFullYear(), end.getMonth() - 1);
    dDiff += prevMonthDays;
  }

  if (mDiff < 0) {
    yDiff--;
    mDiff += 12;
  }

  // Total elapsed days
  const oneDayMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.round((end.getTime() - start.getTime()) / oneDayMs);
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysInWeeks = totalDays % 7;

  // Working days (Senin - Jumat)
  let workDays = 0;
  const cur = new Date(start);
  while (cur < end) {
    cur.setDate(cur.getDate() + 1);
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workDays++;
    }
  }

  return {
    years: yDiff,
    months: mDiff,
    days: dDiff,
    totalDays,
    totalWeeks,
    remainingDaysInWeeks,
    workDays,
    isNegative,
  };
}

/**
 * Add or subtract days/weeks/months/years from a date
 */
export function adjustDate(
  baseDate: Date,
  amount: number,
  unit: 'hari' | 'minggu' | 'bulan' | 'tahun',
  direction: 'tambah' | 'kurang'
): Date {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const factor = direction === 'kurang' ? -1 : 1;
  const delta = amount * factor;

  if (unit === 'hari') {
    d.setDate(d.getDate() + delta);
  } else if (unit === 'minggu') {
    d.setDate(d.getDate() + delta * 7);
  } else if (unit === 'bulan') {
    const curDay = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + delta);
    const maxDays = getDaysInMonth(d.getFullYear(), d.getMonth());
    d.setDate(Math.min(curDay, maxDays));
  } else if (unit === 'tahun') {
    const curDay = d.getDate();
    const curMonth = d.getMonth();
    d.setFullYear(d.getFullYear() + delta);
    const maxDays = getDaysInMonth(d.getFullYear(), curMonth);
    d.setDate(Math.min(curDay, maxDays));
  }

  return d;
}
