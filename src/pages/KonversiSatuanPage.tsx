// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Copy } from 'lucide-react';
import { UNIT_CATEGORIES, convertUnits } from '../utils/unitsData';
import { SelectDropdown, OptionItem } from '../components/SelectDropdown';
import { formatForClipboard, formatIndonesianNumber, parseIndonesianNumber } from '../utils/numberFormat';
import { useCalculator } from '../context/CalculatorContext';

export const KonversiSatuanPage: React.FC = () => {
  const { showToast } = useCalculator();

  const [categoryId, setCategoryId] = useState<string>('panjang');
  const activeCategory = useMemo(() => {
    return UNIT_CATEGORIES.find((c) => c.id === categoryId) || UNIT_CATEGORIES[0];
  }, [categoryId]);

  const [fromUnitId, setFromUnitId] = useState<string>(activeCategory.defaultFrom);
  const [toUnitId, setToUnitId] = useState<string>(activeCategory.defaultTo);
  const [inputValue, setInputValue] = useState<string>('1');

  // When category changes, reset from & to units
  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setFromUnitId(cat.defaultFrom);
      setToUnitId(cat.defaultTo);
    }
  };

  // Convert
  const parsedVal = parseIndonesianNumber(inputValue);
  const convertedVal = useMemo(() => {
    if (isNaN(parsedVal)) return 0;
    return convertUnits(parsedVal, fromUnitId, toUnitId, categoryId);
  }, [parsedVal, fromUnitId, toUnitId, categoryId]);

  const formattedResult = formatIndonesianNumber(convertedVal, { maxDecimals: 10 });

  // Swap units and values
  const handleSwap = () => {
    const tempUnit = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(tempUnit);
    setInputValue(formatForClipboard(convertedVal));
  };

  // Copy result
  const handleCopy = async () => {
    try {
      const text = formatForClipboard(convertedVal);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      showToast('Tersalin');
    } catch {
      showToast('Gagal menyalin');
    }
  };

  // Options for Category dropdown
  const categoryOptions: OptionItem[] = useMemo(
    () => UNIT_CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
    []
  );

  // Options for Units
  const unitOptions: OptionItem[] = useMemo(
    () =>
      activeCategory.units.map((u) => ({
        id: u.id,
        label: `${u.name} (${u.symbol})`,
      })),
    [activeCategory]
  );

  // All other units conversion list
  const otherUnitsList = useMemo(() => {
    if (isNaN(parsedVal)) return [];
    return activeCategory.units.map((u) => {
      const val = convertUnits(parsedVal, fromUnitId, u.id, categoryId);
      return {
        unit: u,
        valueFormatted: formatIndonesianNumber(val, { maxDecimals: 8 }),
      };
    });
  }, [parsedVal, fromUnitId, categoryId, activeCategory]);

  return (
    <div className="w-full flex justify-center pb-6">
      <div className="w-full max-w-[560px] flex flex-col space-y-4">
        {/* Category Selector Card */}
        <div className="bg-white rounded-2xl border border-[#CCEBE7] p-4 shadow-xs">
          <SelectDropdown
            label="Kategori"
            value={categoryId}
            options={categoryOptions}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Conversion Main Card */}
        <div className="bg-white rounded-2xl border border-[#CCEBE7] p-4 sm:p-5 shadow-xs space-y-4">
          {/* Asal (From) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3F6F6B]">
              Dari
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.replace(/[^0-9,.-]/g, ''))}
                className="w-full min-h-[48px] px-3.5 bg-white border border-[#CCEBE7] hover:border-[#0D9488] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl text-base font-semibold text-[#0F2E2C] font-num"
              />
              <SelectDropdown
                value={fromUnitId}
                options={unitOptions}
                onChange={setFromUnitId}
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Tukar Satuan"
              title="Tukar"
              className="min-h-[44px] min-w-[44px] px-4 py-2 bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4] active:scale-95 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ArrowLeftRight size={16} />
              <span>Tukar</span>
            </button>
          </div>

          {/* Tujuan (To) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3F6F6B]">
              Menjadi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="min-h-[48px] px-3.5 bg-[#F0FDFA] border border-[#CCEBE7] rounded-xl flex items-center justify-between">
                <span className="font-num font-bold text-base sm:text-lg text-[#0F2E2C] truncate">
                  {formattedResult}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Salin Hasil"
                  title="Salin"
                  className="p-1.5 text-[#3F6F6B] hover:text-[#0F766E] active:scale-95 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
              <SelectDropdown
                value={toUnitId}
                options={unitOptions}
                onChange={setToUnitId}
              />
            </div>
          </div>
        </div>

        {/* List of All Other Units in this category */}
        <div className="bg-white rounded-2xl border border-[#CCEBE7] p-4 shadow-xs">
          <h3 className="font-heading font-bold text-sm text-[#0F2E2C] mb-3">
            Semua Satuan
          </h3>
          <div className="divide-y divide-[#CCEBE7]/60">
            {otherUnitsList.map(({ unit, valueFormatted }) => (
              <div
                key={unit.id}
                className="py-2.5 flex items-center justify-between text-sm"
              >
                <span className="text-[#3F6F6B] text-xs sm:text-sm font-medium">
                  {unit.name} ({unit.symbol})
                </span>
                <span className="font-num font-bold text-[#0F2E2C] text-sm sm:text-base text-right ml-2">
                  {valueFormatted}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
