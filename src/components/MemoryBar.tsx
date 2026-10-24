// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { parseIndonesianNumber } from '../utils/numberFormat';

interface MemoryBarProps {
  currentDisplayValue: string;
  onRecallMemory: (val: number) => void;
}

export const MemoryBar: React.FC<MemoryBarProps> = ({ currentDisplayValue, onRecallMemory }) => {
  const { memoryValue, setMemoryValue, showToast, historyOpen, setHistoryOpen } = useCalculator();

  const handleMC = () => {
    setMemoryValue(null);
    showToast('Memori dikosongkan');
  };

  const handleMR = () => {
    if (memoryValue !== null) {
      onRecallMemory(memoryValue);
    }
  };

  const handleMPlus = () => {
    const cur = parseIndonesianNumber(currentDisplayValue);
    if (!isNaN(cur)) {
      setMemoryValue((memoryValue || 0) + cur);
      showToast('Ditambahkan ke memori');
    }
  };

  const handleMMinus = () => {
    const cur = parseIndonesianNumber(currentDisplayValue);
    if (!isNaN(cur)) {
      setMemoryValue((memoryValue || 0) - cur);
      showToast('Dikurangkan dari memori');
    }
  };

  const isMemoryEmpty = memoryValue === null || memoryValue === 0;

  return (
    <div className="flex items-center justify-between gap-1 w-full my-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleMC}
          disabled={isMemoryEmpty}
          className={`h-9 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
            isMemoryEmpty
              ? 'text-[#CCEBE7] cursor-not-allowed'
              : 'text-[#0F766E] hover:bg-[#CCFBF1] active:bg-[#CCEBE7]'
          }`}
        >
          MC
        </button>

        <button
          type="button"
          onClick={handleMR}
          disabled={isMemoryEmpty}
          className={`h-9 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
            isMemoryEmpty
              ? 'text-[#CCEBE7] cursor-not-allowed'
              : 'text-[#0F766E] hover:bg-[#CCFBF1] active:bg-[#CCEBE7]'
          }`}
        >
          MR
        </button>

        <button
          type="button"
          onClick={handleMPlus}
          className="h-9 px-2.5 rounded-lg text-xs font-semibold text-[#0F766E] hover:bg-[#CCFBF1] active:bg-[#CCEBE7] transition-colors"
        >
          M+
        </button>

        <button
          type="button"
          onClick={handleMMinus}
          className="h-9 px-2.5 rounded-lg text-xs font-semibold text-[#0F766E] hover:bg-[#CCFBF1] active:bg-[#CCEBE7] transition-colors"
        >
          M−
        </button>
      </div>

      {/* Button Riwayat */}
      <button
        type="button"
        onClick={() => setHistoryOpen(!historyOpen)}
        className="h-9 px-3 rounded-lg text-xs font-semibold text-[#0F766E] hover:bg-[#CCFBF1] active:bg-[#CCEBE7] transition-colors flex items-center gap-1.5"
      >
        <HistoryIcon size={14} />
        <span>Riwayat</span>
      </button>
    </div>
  );
};
