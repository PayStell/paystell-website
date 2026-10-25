'use client';

import { WithdrawFlow } from '@/components/withdraw/WithdrawFlow';

export default function WithdrawPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Withdraw Funds</h1>
        <p className="text-muted-foreground">
          Transfer XLM, USDC, or EURC from your PayStell wallet to any external Stellar address.
        </p>
      </div>
      <WithdrawFlow />
    </div>
  );
}
