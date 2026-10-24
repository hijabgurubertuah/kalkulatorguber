// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { Trash2, X } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';
import { HistoryItem } from '../utils/calculatorEngine';

interface HistorySheetProps {
  onSelectResult: (val: string) => void;
  isDesktopInline?: boolean;
}

export const HistorySheet: React.FC<HistorySheetProps> = ({ onSelectResult, isDesktopInline = false }) => {
  const { history, clearHistory, historyOpen, setHistoryOpen } = useCalculator();

  const handleSelect = (item: HistoryItem) => {
    onSelectResult(item.result);
    if (!isDesktopInline) {
      setHistoryOpen(false);
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#CCEBE7] overflow-hidden">
      {/* Header of History */}
      <div className="px-4 py-3 border-b border-[#CCEBE7] flex items-center justify-between">
        <h3 className="font-heading font-bold text-base text-[#0F2E2C]">
          Riwayat
        </h3>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              aria-label="Hapus Riwayat"
              title="Hapus Riwayat"
              className="p-1.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
          {!isDesktopInline && (
            <button
              type="button"
              onClick={() => setHistoryOpen(false)}
              aria-label="Tutup"
              className="p-1.5 text-[#3F6F6B] hover:bg-[#F0FDFA] rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* History Items or Empty State */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[380px] md:max-h-[500px]">
        {history.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-[#3F6F6B]">
              Belum ada riwayat
            </p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-right p-3 rounded-xl border border-[#CCEBE7] hover:border-[#0D9488] hover:bg-[#F0FDFA] transition-all group"
            >
              <div className="text-xs text-[#3F6F6B] truncate font-num">
                {item.formula}
              </div>
              <div className="text-lg font-bold text-[#0F2E2C] group-hover:text-[#0D9488] font-num mt-1">
                = {item.result}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  // If in desktop side view mode
  if (isDesktopInline) {
    return <div className="w-[300px] h-full flex flex-col">{content}</div>;
  }

  // Mobile Bottom Sheet modal
  if (!historyOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
        onClick={() => setHistoryOpen(false)}
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] p-2 sm:p-4 flex justify-center">
        <div className="w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-200">
          {content}
        </div>
      </div>
    </>
  );
};
