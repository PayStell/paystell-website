'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import BalanceStat from './BalanceStat';

interface BalanceProps {
  title?: string;
  balance: number;
  lastBalance: number;
  currency?: string;
}

const Balance = memo(({ title = 'Available', balance, lastBalance, currency = 'USD' }: BalanceProps) => {
  // @TODO implement withdraw
  const handleWithdraw = () => {
    console.log('withdraw clicked');
  };

  return (
    <Card className="w-full max-w-md mx-auto sm:max-w-none">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-base font-semibold text-center sm:text-left">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex flex-col items-center sm:items-start sm:flex-row sm:items-center gap-2 sm:gap-3">
          <p className="text-xl xs:text-2xl sm:text-3xl font-bold break-words text-center sm:text-left leading-tight">
            {`${formatPrice(balance, currency)}`}
          </p>
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            <BalanceStat balance={balance} lastBalance={lastBalance} />
          </div>
        </div>
        <div className="pt-2">
          <Button
            className="w-full sm:w-auto h-12 sm:h-9 text-sm sm:text-xs font-semibold min-h-[48px] sm:min-h-[36px] touch-manipulation"
            size={'sm'}
            onClick={handleWithdraw}
            variant="secondary"
          >
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

});

Balance.displayName = 'Balance';

export default Balance;
