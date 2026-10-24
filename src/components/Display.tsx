// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { Copy } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { formatForClipboard } from '../utils/numberFormat';

interface DisplayProps {
  formula: string;
  result: string;
  showMemory?: boolean;
}

export const Display: React.FC<DisplayProps> = ({ formula, result, showMemory = true }) => {
  const { memoryValue, showToast } = useCalculator();

  const handleCopy = async () => {
    try {
      const textToCopy = formatForClipboard(result);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Tersalin');
    } catch {
      showToast('Gagal menyalin');
    }
  };

  // Determine dynamic font size based on text length to prevent clipping
  const getResultFontSize = (len: number) => {
    if (len <= 7) return 'text-4xl sm:text-5xl';
    if (len <= 10) return 'text-3xl sm:text-4xl';
    if (len <= 14) return 'text-2xl sm:text-3xl';
    if (len <= 18) return 'text-xl sm:text-2xl';
    return 'text-lg sm:text-xl';
  };

  const isMemoryActive = showMemory && memoryValue !== null && memoryValue !== 0;

  return (
    <div className="w-full bg-white rounded-2xl p-4 md:p-5 border border-[#CCEBE7] shadow-xs relative flex flex-col justify-between min-h-[120px] md:min-h-[135px]">
      {/* Top Header Row of Display: Copy button, Memory indicator on the left, Formula on the right */}
      <div className="flex items-center justify-between w-full min-h-[28px] gap-2">
        {/* Left side: Copy button and Memory indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Salin Hasil"
            title="Salin"
            className="text-[#3F6F6B] hover:text-[#0F766E] hover:bg-[#CCFBF1] active:scale-95 p-1.5 rounded-lg transition-colors flex items-center justify-center min-w-[32px] min-h-[32px]"
          >
            <Copy size={16} />
          </button>

          {isMemoryActive && (
            <span className="text-xs font-bold text-[#0D9488]">
              M
            </span>
          )}
        </div>

        {/* Formula Row (Right aligned) */}
        <div
          className="flex-1 text-right text-xs sm:text-sm text-[#3F6F6B] truncate font-num pl-2"
          title={formula}
        >
          {formula || '\u00A0'}
        </div>
      </div>

      {/* Big Result Row */}
      <div
        className="w-full text-right mt-2 overflow-x-auto no-scrollbar"
        aria-live="polite"
      >
        <span
          className={`font-num font-bold text-[#0F2E2C] tracking-tight block ${getResultFontSize(
            result.length
          )}`}
        >
          {result}
        </span>
      </div>
    </div>
  );
};
