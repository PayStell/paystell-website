import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletData } from '@/types/types';
import { BalanceCard } from './balance-card';
import { QuickActions } from './quick-action';
import { RecentTransactions } from './recent-transaction';

interface WalletDashboardProps {
  walletData: WalletData | null;
  onNavigate: (page: string) => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ walletData, onNavigate }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // TODO: Implement actual wallet data refresh
      // await walletService.refreshWalletData();
    } catch (error) {
      console.error('Failed to refresh wallet data:', error);
      // Show error notification to user
    }
    setRefreshing(false);
  };

  if (!walletData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet Dashboard</h1>
          <p className="text-gray-600">Manage your Stellar wallet and transactions</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <BalanceCard
        walletData={walletData}
        showBalance={showBalance}
        setShowBalance={setShowBalance}
      />
      <QuickActions onNavigate={onNavigate} />
      <RecentTransactions onNavigate={onNavigate} />
    </div>
  );
};
