// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { SegmentedControl, SegmentOption } from '../components/SegmentedControl';
import { SelectDropdown, OptionItem } from '../components/SelectDropdown';
import {
  calculateDateDiff,
  adjustDate,
  formatISODate,
  parseISODate,
  formatIndonesianDateFull,
} from '../utils/dateUtils';
import { useCalculator } from '../context/CalculatorContext';
import { formatForClipboard } from '../utils/numberFormat';

type TanggalMode = 'selisih' | 'tambah_kurang';
type AdjustUnit = 'hari' | 'minggu' | 'bulan' | 'tahun';
type AdjustDirection = 'tambah' | 'kurang';

export const TanggalPage: React.FC = () => {
  const { showToast } = useCalculator();
  const [mode, setMode] = useState<TanggalMode>('selisih');

  const todayStr = formatISODate(new Date());

  // Selisih tanggal state
  const [fromDateStr, setFromDateStr] = useState<string>(todayStr);
  const [toDateStr, setToDateStr] = useState<string>(todayStr);

  // Tambah/Kurang tanggal state
  const [baseDateStr, setBaseDateStr] = useState<string>(todayStr);
  const [amount, setAmount] = useState<number>(30);
  const [unit, setUnit] = useState<AdjustUnit>('hari');
  const [direction, setDirection] = useState<AdjustDirection>('tambah');

  // Copy helper
  const handleCopy = async (val: string) => {
    try {
      const text = formatForClipboard(val);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      showToast('Tersalin');
    } catch {
      showToast('Gagal menyalin');
    }
  };

  const modeOptions: SegmentOption<TanggalMode>[] = [
    { id: 'selisih', label: 'Selisih Tanggal' },
    { id: 'tambah_kurang', label: 'Tambah / Kurang' },
  ];

  const unitOptions: OptionItem[] = [
    { id: 'hari', label: 'Hari' },
    { id: 'minggu', label: 'Minggu' },
    { id: 'bulan', label: 'Bulan' },
    { id: 'tahun', label: 'Tahun' },
  ];

  const directionOptions: SegmentOption<AdjustDirection>[] = [
    { id: 'tambah', label: 'Tambah' },
    { id: 'kurang', label: 'Kurang' },
  ];

  return (
    <div className="w-full flex justify-center pb-6">
      <div className="w-full max-w-[560px] flex flex-col space-y-4">
        {/* Mode Selector */}
        <div className="bg-white rounded-2xl border border-[#CCEBE7] p-2 sm:p-3 shadow-xs">
          <SegmentedControl
            options={modeOptions}
            value={mode}
            onChange={(m) => setMode(m)}
          />
        </div>

        {/* Mode 1: Selisih Tanggal */}
        {mode === 'selisih' && (() => {
          const fromDate = parseISODate(fromDateStr);
          const toDate = parseISODate(toDateStr);
          const diff = calculateDateDiff(fromDate, toDate);

          const ymdSummary = `${diff.years > 0 ? `${diff.years} tahun ` : ''}${
            diff.months > 0 ? `${diff.months} bulan ` : ''
          }${diff.days} hari`.trim();

          return (
            <div className="bg-white rounded-2xl border border-[#CCEBE7] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#3F6F6B]">
                    Dari
                  </label>
                  <input
                    type="date"
                    value={fromDateStr}
                    onChange={(e) => setFromDateStr(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 bg-white border border-[#CCEBE7] hover:border-[#0D9488] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl text-sm font-semibold text-[#0F2E2C]"
                  />
                  <div className="text-xs text-[#3F6F6B] pt-0.5">
                    {formatIndonesianDateFull(fromDate)}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#3F6F6B]">
                    Sampai
                  </label>
                  <input
                    type="date"
                    value={toDateStr}
                    onChange={(e) => setToDateStr(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 bg-white border border-[#CCEBE7] hover:border-[#0D9488] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl text-sm font-semibold text-[#0F2E2C]"
                  />
                  <div className="text-xs text-[#3F6F6B] pt-0.5">
                    {formatIndonesianDateFull(toDate)}
                  </div>
                </div>
              </div>

              {/* Difference Results */}
              <div className="bg-[#F0FDFA] border border-[#CCEBE7] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-semibold text-[#3F6F6B]">
                      Selisih Kalender
                    </span>
                    <span className="font-num font-bold text-xl sm:text-2xl text-[#0F2E2C]">
                      {ymdSummary || '0 hari'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(ymdSummary)}
                    aria-label="Salin Selisih"
                    className="p-2 text-[#3F6F6B] hover:text-[#0F766E] active:scale-95 transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                <div className="h-px bg-[#CCEBE7]" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-sm">
                  <div>
                    <span className="block text-xs text-[#3F6F6B]">
                      Total Hari
                    </span>
                    <span className="font-num font-bold text-base text-[#0F2E2C]">
                      {diff.totalDays} hari
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-[#3F6F6B]">
                      Total Minggu
                    </span>
                    <span className="font-num font-bold text-base text-[#0F2E2C]">
                      {diff.totalWeeks} minggu {diff.remainingDaysInWeeks > 0 ? `${diff.remainingDaysInWeeks} hari` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-[#3F6F6B]">
                      Hari Kerja (Sen-Jum)
                    </span>
                    <span className="font-num font-bold text-base text-[#0D9488]">
                      {diff.workDays} hari
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Mode 2: Tambah / Kurang Tanggal */}
        {mode === 'tambah_kurang' && (() => {
          const baseDate = parseISODate(baseDateStr);
          const resultDate = adjustDate(baseDate, amount, unit, direction);
          const resultFormatted = formatIndonesianDateFull(resultDate);

          return (
            <div className="bg-white rounded-2xl border border-[#CCEBE7] p-4 sm:p-5 shadow-xs space-y-4">
              {/* Direction Toggle: Tambah / Kurang */}
              <SegmentedControl
                options={directionOptions}
                value={direction}
                onChange={(d) => setDirection(d)}
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#3F6F6B]">
                  Tanggal Awal
                </label>
                <input
                  type="date"
                  value={baseDateStr}
                  onChange={(e) => setBaseDateStr(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 bg-white border border-[#CCEBE7] hover:border-[#0D9488] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl text-sm font-semibold text-[#0F2E2C]"
                />
                <div className="text-xs text-[#3F6F6B] pt-0.5">
                  {formatIndonesianDateFull(baseDate)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#3F6F6B]">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full min-h-[48px] px-3.5 bg-white border border-[#CCEBE7] hover:border-[#0D9488] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl text-base font-semibold text-[#0F2E2C] font-num"
                  />
                </div>

                <SelectDropdown
                  label="Satuan Waktu"
                  value={unit}
                  options={unitOptions}
                  onChange={(u) => setUnit(u as AdjustUnit)}
                />
              </div>

              {/* Result Date Card */}
              <div className="bg-[#F0FDFA] border border-[#CCEBE7] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-[#3F6F6B]">
                    Tanggal Hasil
                  </span>
                  <span className="font-heading font-bold text-lg sm:text-xl text-[#0F2E2C]">
                    {resultFormatted}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(resultFormatted)}
                  aria-label="Salin Tanggal Hasil"
                  className="p-2 text-[#3F6F6B] hover:text-[#0F766E] active:scale-95 transition-colors"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
