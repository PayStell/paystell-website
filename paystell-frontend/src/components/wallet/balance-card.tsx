import React from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletData } from '@/types/types';
import { truncateAddress, copyToClipboard } from '@/utils/Util';

interface BalanceCardProps {
  walletData: WalletData;
  showBalance: boolean;
  setShowBalance: (show: boolean) => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  walletData, 
  showBalance, 
  setShowBalance 
}) => (
  <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-white/90">Total Balance</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBalance(!showBalance)}
          className="text-white/90 hover:text-white hover:bg-white/20"
        >
          {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="text-4xl font-bold">
        {showBalance ? `${walletData.balance} XLM` : '••••••••'}
      </div>
      <div className="text-xl text-white/80">
        {showBalance ? `$${walletData.balanceUSD} USD` : '••••••••'}
      </div>
      <div className="flex items-center space-x-2 text-sm text-white/70">
        <span>Address:</span>
        <code className="bg-white/20 px-2 py-1 rounded text-xs">
          {truncateAddress(walletData.address)}
        </code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(walletData.address)}
          className="p-1 h-auto text-white/70 hover:text-white"
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
);