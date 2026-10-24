// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { CalculatorProvider, useCalculator } from './context/CalculatorContext';
import { Header } from './components/Header';
import { SidebarHP } from './components/SidebarHP';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { StandarPage } from './pages/StandarPage';
import { IlmiahPage } from './pages/IlmiahPage';
import { ProgrammerPage } from './pages/ProgrammerPage';
import { KonversiSatuanPage } from './pages/KonversiSatuanPage';
import { PersenDiskonPage } from './pages/PersenDiskonPage';
import { TanggalPage } from './pages/TanggalPage';

const AppContent: React.FC = () => {
  const { activeTab } = useCalculator();

  return (
    <div className="min-h-screen flex flex-col bg-[#F0FDFA] text-[#0F2E2C]">
      {/* Header */}
      <Header />

      {/* Floating 120x25 Sidebar Toggle on Phone */}
      <SidebarHP />

      {/* Toast Notification Container (500ms duration) */}
      <Toast />

      {/* Main Page Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-3 sm:pt-6 pb-2 flex flex-col">
        {activeTab === 'standar' && <StandarPage />}
        {activeTab === 'ilmiah' && <IlmiahPage />}
        {activeTab === 'programmer' && <ProgrammerPage />}
        {activeTab === 'konversi' && <KonversiSatuanPage />}
        {activeTab === 'persen' && <PersenDiskonPage />}
        {activeTab === 'tanggal' && <TanggalPage />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <CalculatorProvider>
      <AppContent />
    </CalculatorProvider>
  );
}
