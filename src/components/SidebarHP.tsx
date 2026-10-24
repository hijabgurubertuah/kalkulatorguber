// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useEffect, useState } from 'react';
import { Menu, ChevronDown, ChevronUp } from 'lucide-react';
import { useCalculator, AppTab } from '../context/CalculatorContext';

export const SidebarHP: React.FC = () => {
  const { activeTab, setActiveTab } = useCalculator();
  const [isOpen, setIsOpen] = useState(false);
  const [kalkulatorOpen, setKalkulatorOpen] = useState(true);
  const [alatHitungOpen, setAlatHitungOpen] = useState(true);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (tab: AppTab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Sidebar Toggle Button for Mobile Only (120px high, 25px wide, vertically centered on left screen edge) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Buka Menu"
        className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-30 w-[25px] h-[120px] bg-[#0D9488]/90 text-white rounded-r-xl shadow-md flex items-center justify-center hover:bg-[#0D9488] active:scale-95 transition-all focus:outline-none"
      >
        <Menu size={18} strokeWidth={2.2} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Panel */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[calc(100vw-16px)] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#CCEBE7] flex items-center justify-between">
          <span className="font-heading font-bold text-lg text-[#0F2E2C]">
            Kalkulator Guber Smart
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Tutup Menu"
            className="w-10 h-10 flex items-center justify-center text-[#3F6F6B] rounded-lg active:bg-[#F0FDFA]"
          >
            ✕
          </button>
        </div>

        {/* Menu Items with Accordion */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Kelompok Kalkulator */}
          <div>
            <button
              type="button"
              onClick={() => setKalkulatorOpen(!kalkulatorOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#3F6F6B] rounded-md hover:bg-[#F0FDFA]"
            >
              <span>Kalkulator</span>
              {kalkulatorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {kalkulatorOpen && (
              <div className="mt-1 space-y-1 pl-1">
                {[
                  { id: 'standar', label: 'Standar' },
                  { id: 'ilmiah', label: 'Ilmiah' },
                  { id: 'programmer', label: 'Programmer' },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.id as AppTab)}
                      className={`w-full min-h-[48px] px-3 py-2 rounded-xl text-left text-base font-medium transition-colors flex items-center ${
                        isActive
                          ? 'bg-[#0D9488] text-white font-semibold'
                          : 'text-[#0F2E2C] hover:bg-[#F0FDFA] active:bg-[#CCFBF1]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kelompok Alat Hitung */}
          <div>
            <button
              type="button"
              onClick={() => setAlatHitungOpen(!alatHitungOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#3F6F6B] rounded-md hover:bg-[#F0FDFA]"
            >
              <span>Alat Hitung</span>
              {alatHitungOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {alatHitungOpen && (
              <div className="mt-1 space-y-1 pl-1">
                {[
                  { id: 'konversi', label: 'Konversi Satuan' },
                  { id: 'persen', label: 'Persen dan Diskon' },
                  { id: 'tanggal', label: 'Tanggal' },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.id as AppTab)}
                      className={`w-full min-h-[48px] px-3 py-2 rounded-xl text-left text-base font-medium transition-colors flex items-center ${
                        isActive
                          ? 'bg-[#0D9488] text-white font-semibold'
                          : 'text-[#0F2E2C] hover:bg-[#F0FDFA] active:bg-[#CCFBF1]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#CCEBE7] text-center">
          <span className="text-xs text-[#3F6F6B]">
            by : Guber Smart
          </span>
        </div>
      </div>
    </>
  );
};
