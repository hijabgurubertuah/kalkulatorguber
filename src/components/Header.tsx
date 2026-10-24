// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { useCalculator, AppTab } from '../context/CalculatorContext';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { activeTab, setActiveTab, isOffline } = useCalculator();

  const kalkulatorTabs: { id: AppTab; label: string }[] = [
    { id: 'standar', label: 'Standar' },
    { id: 'ilmiah', label: 'Ilmiah' },
    { id: 'programmer', label: 'Programmer' },
  ];

  const alatHitungTabs: { id: AppTab; label: string }[] = [
    { id: 'konversi', label: 'Konversi Satuan' },
    { id: 'persen', label: 'Persen dan Diskon' },
    { id: 'tanggal', label: 'Tanggal' },
  ];

  return (
    <header className="w-full bg-white border-b border-[#CCEBE7] sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-lg md:text-xl text-[#0F2E2C] tracking-tight">
            Kalkulator Guber Smart
          </span>
          {isOffline && (
            <span className="text-xs text-[#DC2626]">
              Offline
            </span>
          )}
        </div>

        {/* Desktop Navigation - Hidden on HP */}
        <nav className="hidden md:flex items-center gap-1">
          <div className="flex items-center gap-1 mr-3 pr-3 border-r border-[#CCEBE7]">
            {kalkulatorTabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[38px] ${
                    isActive
                      ? 'bg-[#0D9488] text-white font-semibold'
                      : 'text-[#3F6F6B] hover:text-[#0F2E2C] hover:bg-[#F0FDFA]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            {alatHitungTabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[38px] ${
                    isActive
                      ? 'bg-[#0D9488] text-white font-semibold'
                      : 'text-[#3F6F6B] hover:text-[#0F2E2C] hover:bg-[#F0FDFA]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};
