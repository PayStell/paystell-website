"use client";

import { useEffect, useState } from "react";
import Balance from "@/components/dashboard/balance";
import Activity, { UserActivity } from "@/components/dashboard/activity";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { StellarAnalytics } from "@/components/dashboard/analytics/StellarAnalytics";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<UserActivity[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [lastBalance, setLastBalance] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 2000));

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
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex flex-col gap-8 mt-5 items-start md:flex-row">
        {loading ? (
          <LoadingSkeleton type="card" width={400} height="150px" />
        ) : error ? (
          <div className="text-red-400 font-bold text-center mt-4 p-3 rounded-md shadow-md w-fit mx-auto">{error}</div>
        ) : (
          <Balance balance={balance} lastBalance={lastBalance} />
        )}
        {loading ? (
          <LoadingSkeleton type="table" rows={3} width="100%" />
        ) : error ? (
            <div className="text-red-400 font-bold text-center mt-4 p-3 rounded-md shadow-md w-fit mx-auto"> {error} </div>
        ) : (
          <Activity data={activityData} />
        )}
      </div>
      
      {/* Stellar Analytics Section */}
      <div className="mt-8">
          <StellarAnalytics />
      </div>
    </main>
  );
}
