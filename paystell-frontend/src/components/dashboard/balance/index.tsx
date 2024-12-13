"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import BalanceStat from "./BalanceStat";

interface BalanceProps {
  title?: string;
  balance: number;
  lastBalance: number;
  currency?: string;
}

const Balance = ({
  title = "Available",
  balance,
  lastBalance,
  currency = "USD",
}: BalanceProps) => {
  // @TODO implement withdraw
  const handleWithdraw = () => {
    console.log("withdraw clicked");
  };

  return (
    <Card className="min-w-[25%]">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center gap-3">
          <p className="text-xl font-bold">
            {`${formatPrice(balance, currency)}`}
          </p>
          <BalanceStat balance={balance} lastBalance={lastBalance} />
        </div>
        <Button
          className="mt-4 text-xs text-black font-semibold bg-slate-200"
          size={"sm"}
          onClick={handleWithdraw}
        >
          Withdraw
        </Button>
      </CardContent>
    </Card>
  );
};

export default Balance;