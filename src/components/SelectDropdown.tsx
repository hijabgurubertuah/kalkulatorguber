// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface OptionItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface SelectDropdownProps {
  label?: string;
  value: string;
  options: OptionItem[];
  onChange: (id: string) => void;
  className?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.id === value) || options[0];

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-[#3F6F6B] mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-[#CCEBE7] hover:border-[#0D9488] rounded-xl text-left text-sm font-medium text-[#0F2E2C] flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : ''}</span>
        <ChevronDown size={16} className="text-[#3F6F6B] shrink-0 ml-2" />
      </button>

      {/* Mobile Bottom Sheet (Screen width < 640px) */}
      {isOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-2 max-h-[80vh] flex flex-col bg-white rounded-t-2xl shadow-2xl border-t border-[#CCEBE7]">
            <div className="flex items-center justify-between p-3 border-b border-[#CCEBE7]">
              <span className="font-heading font-bold text-sm text-[#0F2E2C]">
                {label || 'Pilih'}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-[#3F6F6B] rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto p-2 space-y-1 max-h-[60vh]">
              {options.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0D9488] text-white font-semibold'
                        : 'text-[#0F2E2C] hover:bg-[#F0FDFA] active:bg-[#CCFBF1]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {opt.sublabel && (
                      <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-[#3F6F6B]'}`}>
                        {opt.sublabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Desktop Floating Menu (Screen width >= 640px) */}
      {isOpen && (
        <div className="hidden sm:block absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#CCEBE7] rounded-xl shadow-lg max-h-60 overflow-y-auto p-1">
          {options.map((opt) => {
            const isSelected = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={`w-full min-h-[40px] px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#0D9488] text-white font-semibold'
                    : 'text-[#0F2E2C] hover:bg-[#F0FDFA] active:bg-[#CCFBF1]'
                }`}
              >
                <span>{opt.label}</span>
                {opt.sublabel && (
                  <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-[#3F6F6B]'}`}>
                    {opt.sublabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
