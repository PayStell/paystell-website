"use client";

import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Balance from "@/components/dashboard/balance";
import Activity, { UserActivity } from "@/components/dashboard/activity";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<UserActivity[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [lastBalance, setLastBalance] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      // @TODO remove this mock data once the BE is integrated
      setActivityData([
        {
          id: 1,
          name: "Product 1",
          sku: "ID12345",
          date: new Date("11/10/2024"),
          value: 1099.9,
          currency: "USDC",
        },
        {
          id: 2,
          name: "Product 2",
          sku: "ID67890",
          date: new Date("11/15/2024"),
          value: 1000,
          currency: "XML",
        },
      ]);
      setBalance(2100.1);
      setLastBalance(1800);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex flex-col gap-8 mt-5 items-start md:flex-row">
        {loading ? (
          <BalanceSkeleton />
        ) : (
          <Balance balance={balance} lastBalance={lastBalance} />
        )}
        {loading ? <ActivitySkeleton /> : <Activity data={activityData} />}
      </div>
    </main>
  );
}

const BalanceSkeleton = () => (
  <div className="w-[300px] h-[150px] p-4 bg-white rounded-lg shadow-md">
    <Skeleton height={20} width={100} className="mb-2" />
    <Skeleton height={36} width={150} className="mb-4" />
    <Skeleton height={30} width={100} />
  </div>
);

const ActivitySkeleton = () => (
  <div className="w-full h-[200px] p-4 bg-white rounded-lg shadow-md">
    <Skeleton height={20} width={150} className="mb-4" />
    <Skeleton count={3} height={30} className="mb-2" />
  </div>
);
