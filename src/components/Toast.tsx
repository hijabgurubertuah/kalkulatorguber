// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { useCalculator } from '../context/CalculatorContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCalculator();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-150 ease-out">
      <div className="bg-[#0F2E2C] text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg border border-[#0D9488]/40 text-center min-w-[120px]">
        {toastMessage}
      </div>
    </div>
  );
};
