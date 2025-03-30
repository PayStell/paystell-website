"use client";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

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
        <MdKeyboardArrowDown size={12} style={{ color: "red" }} />
      ) : (
        <MdKeyboardArrowUp size={12} style={{ color: "green" }} />
      )}
      <span
        className={`text-xs font-semibold ml-1 ${
          diff < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        {Math.abs(diff).toFixed(2)}
      </span>
    </div>
  );
};

export default Balance;
