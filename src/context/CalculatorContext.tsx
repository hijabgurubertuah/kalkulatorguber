// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../utils/calculatorEngine';
import { THEME } from '../constants/designSystem';

export type AppTab = 'standar' | 'ilmiah' | 'programmer' | 'konversi' | 'persen' | 'tanggal';

interface CalculatorContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  history: HistoryItem[];
  addHistory: (formula: string, result: string) => void;
  clearHistory: () => void;
  memoryValue: number | null;
  setMemoryValue: (val: number | null) => void;
  ans: number;
  setAns: (val: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isOffline: boolean;
  historyOpen: boolean;
  setHistoryOpen: (open: boolean) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

const VALID_TABS: AppTab[] = ['standar', 'ilmiah', 'programmer', 'konversi', 'persen', 'tanggal'];

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial tab from URL hash without saving to storage
  const getInitialTab = (): AppTab => {
    const hash = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();
    if (VALID_TABS.includes(hash as AppTab)) {
      return hash as AppTab;
    }
    return 'standar';
  };

  const [activeTab, setActiveTabState] = useState<AppTab>(getInitialTab);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [memoryValue, setMemoryValue] = useState<number | null>(null);
  const [ans, setAns] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  // Sync activeTab with URL hash
  const setActiveTab = useCallback((tab: AppTab) => {
    setActiveTabState(tab);
    if (window.location.hash !== `#/${tab}`) {
      window.location.hash = `#/${tab}`;
    }
  }, []);

  // Listen to browser back/forward buttons and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();
      if (VALID_TABS.includes(hash as AppTab)) {
        setActiveTabState(hash as AppTab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial hash set if empty
    if (!window.location.hash) {
      window.location.hash = `#/standar`;
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Toast notification (500ms exact duration)
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, THEME.notificationDurationMs);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addHistory = useCallback((formula: string, result: string) => {
    setHistory((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        formula,
        result,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 99), // max 100 entries
    ]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    showToast('Riwayat dibersihkan');
  }, [showToast]);

  return (
    <CalculatorContext.Provider
      value={{
        activeTab,
        setActiveTab,
        history,
        addHistory,
        clearHistory,
        memoryValue,
        setMemoryValue,
        ans,
        setAns,
        toastMessage,
        showToast,
        isOffline,
        historyOpen,
        setHistoryOpen,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = (): CalculatorContextType => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within CalculatorProvider');
  }
  return context;
};
