// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { formatDisplayTyping, parseIndonesianNumber } from '../utils/numberFormat';

interface NumberInputProps {
  label: string;
  value: number | string;
  onChange: (val: number, rawFormatted: string) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  className = '',
}) => {
  // Format current value with dot thousands
  const displayVal = typeof value === 'number' ? formatDisplayTyping(value.toString().replace('.', ',')) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    // Allow digits and comma, minus
    input = input.replace(/[^0-9,-]/g, '');

    // Format typing
    const formatted = formatDisplayTyping(input);
    const parsed = parseIndonesianNumber(formatted);
    onChange(isNaN(parsed) ? 0 : parsed, formatted);
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-xs font-semibold text-[#3F6F6B] mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-sm font-semibold text-[#3F6F6B] pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={displayVal}
          onChange={handleChange}
          className={`w-full min-h-[48px] bg-white border border-[#CCEBE7] hover:border-[#0D9488] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl text-base font-semibold text-[#0F2E2C] font-num transition-colors ${
            prefix ? 'pl-10' : 'pl-3.5'
          } ${suffix ? 'pr-12' : 'pr-3.5'}`}
        />
        {suffix && (
          <span className="absolute right-3.5 text-sm font-semibold text-[#3F6F6B] pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
