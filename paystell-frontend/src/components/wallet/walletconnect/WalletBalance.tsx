'use client';

import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@/providers/useWalletProvider';
import { useStellar } from '@/hooks/use-wallet';
import Image from 'next/image';
import { toast } from 'sonner';

export default function WalletBalance() {
  const { state: walletState } = useWallet();
  const { publicKey, isConnected } = walletState;
  const { state, fetchBalances, fetchXLMPrice } = useStellar();
  const { balances, isLoadingBalances, balanceError, xlmPrice, isLoadingPrice } = state;

  useEffect(() => {
    if (isConnected && publicKey) {
      fetchBalances(publicKey);
      fetchXLMPrice();

      const balanceIntervalId = setInterval(() => {
        fetchBalances(publicKey);
        fetchXLMPrice();
      }, 30000);

      return () => clearInterval(balanceIntervalId);
    }
  }, [publicKey, isConnected, fetchBalances, fetchXLMPrice]);

  if (isLoadingBalances) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (balanceError) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-600">
        {balanceError}
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">No assets found in this account.</div>
    );
  }

  // Find the XLM balance
  const xlmBalance = balances.find((asset) => asset.asset_type === 'native');
  if (!xlmBalance) {
    toast.error('Warning', {
      description: 'No XLM found in this account.',
    });
  }
  // Calculate USD value for XLM
  const getXlmUsdValue = (balance: string) => {
    if (isLoadingPrice || !xlmPrice) return null;
    const xlmAmount = Number.parseFloat(balance) || 0;
    return (xlmAmount * xlmPrice).toFixed(2);
  };

  return (
    <div className="space-y-4">
      {xlmBalance && (
        <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Image
              alt="xlm"
              src={process.env.NEXT_PUBLIC_COIN_LOGO_URL + '/512.png'}
              width={40}
              height={40}
            />
            <h3 className="font-medium">XLM</h3>
          </div>
          <div></div>
          <div className="text-right">
            <p className="font-bold text-lg">
              {Number.parseFloat(xlmBalance.balance).toFixed(2) || 0}
            </p>
            {!isLoadingPrice && xlmPrice && (
              <p className="text-sm text-muted-foreground">
                ≈ ${getXlmUsdValue(xlmBalance.balance)} USD
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
