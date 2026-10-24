// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { SegmentedControl, SegmentOption } from '../components/SegmentedControl';
import { NumberInput } from '../components/NumberInput';
import { formatForClipboard, formatIndonesianNumber } from '../utils/numberFormat';
import { useCalculator } from '../context/CalculatorContext';

type PersenMode = 'persen_dari' | 'berapa_persen' | 'selisih_persen' | 'diskon' | 'ppn';

export const PersenDiskonPage: React.FC = () => {
  const { showToast } = useCalculator();
  const [mode, setMode] = useState<PersenMode>('persen_dari');

  // Mode 1: Persen Dari (e.g. 15% dari 200 = 30)
  const [persenVal, setPersenVal] = useState<number>(15);
  const [dariAngkaVal, setDariAngkaVal] = useState<number>(200);

  // Mode 2: Berapa Persen (e.g. 30 dari 200 = 15%)
  const [angkaVal, setAngkaVal] = useState<number>(30);
  const [dariTotalVal, setDariTotalVal] = useState<number>(200);

  // Mode 3: Selisih Persen (e.g. dari 100 menjadi 120 = +20%)
  const [nilaiAwal, setNilaiAwal] = useState<number>(100);
  const [nilaiAkhir, setNilaiAkhir] = useState<number>(120);

  // Mode 4: Diskon (Harga awal, Diskon 1, Diskon 2)
  const [hargaAwal, setHargaAwal] = useState<number>(500000);
  const [diskon1, setDiskon1] = useState<number>(20);
  const [diskon2, setDiskon2] = useState<number>(10);

  // Mode 5: PPN
  const [hargaPPN, setHargaPPN] = useState<number>(1000000);
  const [tarifPPN, setTarifPPN] = useState<number>(11);
  const [tipePPN, setTipePPN] = useState<'tambah' | 'pisahkan'>('tambah');

  // Copy helper
  const handleCopy = async (val: number | string) => {
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

  const modeOptions: SegmentOption<PersenMode>[] = [
    { id: 'persen_dari', label: 'Persen Dari' },
    { id: 'berapa_persen', label: 'Berapa %' },
    { id: 'selisih_persen', label: 'Selisih %' },
    { id: 'diskon', label: 'Diskon' },
    { id: 'ppn', label: 'PPN' },
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

        {/* Mode Forms */}
        <div className="bg-white rounded-2xl border border-[#CCEBE7] p-4 sm:p-5 shadow-xs space-y-4">
          {/* 1. Persen Dari */}
          {mode === 'persen_dari' && (() => {
            const hasil = (persenVal * dariAngkaVal) / 100;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NumberInput
                    label="Persen (%)"
                    value={persenVal}
                    suffix="%"
                    onChange={(v) => setPersenVal(v)}
                  />
                  <NumberInput
                    label="Dari Angka"
                    value={dariAngkaVal}
                    onChange={(v) => setDariAngkaVal(v)}
                  />
                </div>

                <div className="bg-[#F0FDFA] border border-[#CCEBE7] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-semibold text-[#3F6F6B]">
                      Hasil
                    </span>
                    <span className="font-num font-bold text-2xl text-[#0F2E2C]">
                      {formatIndonesianNumber(hasil)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(hasil)}
                    aria-label="Salin Hasil"
                    className="p-2 text-[#3F6F6B] hover:text-[#0F766E] active:scale-95 transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 2. Berapa Persen */}
          {mode === 'berapa_persen' && (() => {
            const hasil = dariTotalVal !== 0 ? (angkaVal / dariTotalVal) * 100 : 0;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NumberInput
                    label="Angka"
                    value={angkaVal}
                    onChange={(v) => setAngkaVal(v)}
                  />
                  <NumberInput
                    label="Dari Total"
                    value={dariTotalVal}
                    onChange={(v) => setDariTotalVal(v)}
                  />
                </div>

                <div className="bg-[#F0FDFA] border border-[#CCEBE7] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-semibold text-[#3F6F6B]">
                      Persentase
                    </span>
                    <span className="font-num font-bold text-2xl text-[#0F2E2C]">
                      {formatIndonesianNumber(hasil)}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${formatIndonesianNumber(hasil)}%`)}
                    aria-label="Salin Hasil"
                    className="p-2 text-[#3F6F6B] hover:text-[#0F766E] active:scale-95 transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 3. Selisih Persen */}
          {mode === 'selisih_persen' && (() => {
            const selisih = nilaiAwal !== 0 ? ((nilaiAkhir - nilaiAwal) / Math.abs(nilaiAwal)) * 100 : 0;
            const sign = selisih > 0 ? '+' : '';
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NumberInput
                    label="Dari Nilai Awal"
                    value={nilaiAwal}
                    onChange={(v) => setNilaiAwal(v)}
                  />
                  <NumberInput
                    label="Menjadi Nilai Akhir"
                    value={nilaiAkhir}
                    onChange={(v) => setNilaiAkhir(v)}
                  />
                </div>

                <div className="bg-[#F0FDFA] border border-[#CCEBE7] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-semibold text-[#3F6F6B]">
                      Perubahan Persen
                    </span>
                    <span
                      className={`font-num font-bold text-2xl ${
                        selisih > 0 ? 'text-[#0D9488]' : selisih < 0 ? 'text-[#DC2626]' : 'text-[#0F2E2C]'
                      }`}
                    >
                      {sign}{formatIndonesianNumber(selisih)}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${sign}${formatIndonesianNumber(selisih)}%`)}
                    aria-label="Salin Hasil"
                    className="p-2 text-[#3F6F6B] hover:text-[#0F766E] active:scale-95 transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 4. Diskon */}
          {mode === 'diskon' && (() => {
            const pot1 = (hargaAwal * (diskon1 || 0)) / 100;
            const setelahDiskon1 = Math.max(0, hargaAwal - pot1);
            const pot2 = (setelahDiskon1 * (diskon2 || 0)) / 100;
            const hargaAkhir = Math.max(0, setelahDiskon1 - pot2);
            const totalHemat = pot1 + pot2;

            return (
              <div className="space-y-4">
                <NumberInput
                  label="Harga Awal (Rp)"
                  prefix="Rp"
                  value={hargaAwal}
                  onChange={(v) => setHargaAwal(v)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NumberInput
                    label="Diskon 1 (%)"
                    suffix="%"
                    value={diskon1}
                    onChange={(v) => setDiskon1(v)}
                  />
                  <NumberInput
                    label="Diskon 2 (%)"
                    suffix="%"
                    value={diskon2}
                    onChange={(v) => setDiskon2(v)}
                  />
                </div>

                <div className="bg-[#F0FDFA] border border-[#CCEBE7] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#3F6F6B]">
                      Jumlah Potongan
                    </span>
                    <span className="font-num font-bold text-lg text-[#DC2626]">
                      Rp {formatIndonesianNumber(totalHemat)}
                    </span>
                  </div>
                  <div className="h-px bg-[#CCEBE7]" />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-[#3F6F6B]">
                        Harga Akhir
                      </span>
                      <span className="font-num font-bold text-2xl text-[#0F2E2C]">
                        Rp {formatIndonesianNumber(hargaAkhir)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(hargaAkhir)}
                      aria-label="Salin Harga Akhir"
                      className="p-2 text-[#3F6F6B] hover:text-[#0F766E] active:scale-95 transition-colors"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 5. PPN */}
          {mode === 'ppn' && (() => {
            const isTambah = tipePPN === 'tambah';
            let nilaiPPN = 0;
            let totalAkhir = 0;
            let dpp = 0;

            if (isTambah) {
              dpp = hargaPPN;
              nilaiPPN = (hargaPPN * (tarifPPN || 0)) / 100;
              totalAkhir = hargaPPN + nilaiPPN;
            } else {
              // Pisahkan PPN: hargaPPN is already inclusive of PPN
              // DPP = harga / (1 + tarif/100)
              dpp = hargaPPN / (1 + (tarifPPN || 0) / 100);
              nilaiPPN = hargaPPN - dpp;
              totalAkhir = hargaPPN;
            }

            return (
              <div className="space-y-4">
                {/* PPN Method Toggle */}
                <SegmentedControl
                  options={[
                    { id: 'tambah', label: 'Tambah PPN' },
                    { id: 'pisahkan', label: 'Pisahkan PPN' },
                  ]}
                  value={tipePPN}
                  onChange={(t) => setTipePPN(t)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NumberInput
                    label={isTambah ? 'Harga Sebelum PPN (Rp)' : 'Harga Termasuk PPN (Rp)'}
                    prefix="Rp"
                    value={hargaPPN}
                    onChange={(v) => setHargaPPN(v)}
                  />
                  <NumberInput
                    label="Tarif PPN (%)"
                    suffix="%"
                    value={tarifPPN}
                    onChange={(v) => setTarifPPN(v)}
                  />
                </div>

                <div className="bg-[#F0FDFA] border border-[#CCEBE7] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#3F6F6B]">
                      {isTambah ? 'Harga Sebelum PPN' : 'Harga Sebelum PPN (DPP)'}
                    </span>
                    <span className="font-num font-bold text-base text-[#0F2E2C]">
                      Rp {formatIndonesianNumber(Math.round(dpp))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#3F6F6B]">
                      Jumlah PPN ({tarifPPN}%)
                    </span>
                    <span className="font-num font-bold text-base text-[#0D9488]">
                      Rp {formatIndonesianNumber(Math.round(nilaiPPN))}
                    </span>
                  </div>
                  <div className="h-px bg-[#CCEBE7]" />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-semibold text-[#3F6F6B]">
                        Total
                      </span>
                      <span className="font-num font-bold text-2xl text-[#0F2E2C]">
                        Rp {formatIndonesianNumber(Math.round(totalAkhir))}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(Math.round(totalAkhir))}
                      aria-label="Salin Total"
                      className="p-2 text-[#3F6F6B] hover:text-[#0F766E] active:scale-95 transition-colors"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
