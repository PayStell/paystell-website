"use client";
import { useEffect, useState } from "react";
import { CircleArrowDown, CircleChevronUp } from "lucide-react";

interface BalanceStatProps {
  balance: number;
  lastBalance: number;
}

const Balance = ({ balance, lastBalance }: BalanceStatProps) => {
  const [diff, setDiff] = useState(balance - lastBalance);

  useEffect(() => {
    setDiff(balance - lastBalance);
  }, [balance, lastBalance]);

  return (
    <div className="flex flex-row items-center">
      {diff < 0 ? (
        <CircleArrowDown size={12} color="white" fill="red" strokeWidth={1} />
      ) : (
        <CircleChevronUp size={12} color="white" fill="green" strokeWidth={1} />
      )}
      <span
        className={`text-[10px] ${
          diff < 0 ? "text-destructive" : "text-green-foreground"
        }`}
      >{`${((diff / lastBalance) * 100).toFixed(2)}%`}</span>
    </div>
  );
};

export default Balance;
