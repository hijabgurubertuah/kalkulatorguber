// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';

export interface SegmentOption<T extends string> {
  id: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`grid gap-1.5 p-1 bg-[#CCFBF1]/50 border border-[#CCEBE7] rounded-xl ${className}`}
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`min-h-[44px] px-2 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors text-center truncate ${
              isActive
                ? 'bg-[#0D9488] text-white shadow-xs'
                : 'text-[#0F766E] hover:bg-white/60 active:bg-white'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
