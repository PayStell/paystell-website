'use client'
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WalletData } from '@/types/types';
import { mockWalletData } from '@/mock/wallet-data';


import { Navigation } from './navigation';
import { WalletCheck } from './wallet-check';
import { WalletActivationWizard } from './wallet-activation-wizard';
import { WalletDashboard } from './wallet-dashboard';
import { TransactionHistory } from './transaction-history';
import { SettingsPage } from './settings';
import { SendPayment } from './send-payment';
import { ReceivePayment } from './receive-payment';

export const StellarWalletApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('start');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [hasWallet, setHasWallet] = useState(false);

  const handleHasWallet = () => {
    setHasWallet(true);
    setWalletData({ ...mockWalletData, hasWallet: true });
    setCurrentPage('dashboard');
  };

  const handleNoWallet = () => {
    setHasWallet(false);
    setCurrentPage('activate');
  };

  const handleWalletActivated = () => {
    setHasWallet(true);
    setWalletData({ ...mockWalletData, hasWallet: true });
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'start':
        return <WalletCheck onHasWallet={handleHasWallet} onNoWallet={handleNoWallet} />;
      case 'activate':
        return <WalletActivationWizard onComplete={handleWalletActivated} />;
      case 'dashboard':
        return <WalletDashboard walletData={walletData} onNavigate={setCurrentPage} />;
      case 'transactions':
        return <TransactionHistory onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} />;
      case 'send':
        return <SendPayment onNavigate={setCurrentPage} />;
      case 'receive':
        return <ReceivePayment onNavigate={setCurrentPage} />;
      default:
        return <WalletDashboard walletData={walletData} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} hasWallet={hasWallet} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          {renderPage()}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default StellarWalletApp;