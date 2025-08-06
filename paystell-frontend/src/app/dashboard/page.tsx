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
        await new Promise((resolve) => setTimeout(resolve, 500)); // Reduced from 2000ms to 500ms

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
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-2 md:p-8">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-5">
        Dashboard
      </h1>

      {/* Balance and Activity Section */}
      <div className="flex flex-col gap-6 md:gap-8 mb-8">
        {loading ? (
          <LoadingSkeleton type="card" width="100%" height="150px" />
        ) : error ? (
          <div className="text-red-400 font-bold text-center mt-4 p-3 rounded-md shadow-md w-fit mx-auto">
            {error}
          </div>
        ) : (
          <Balance balance={balance} lastBalance={lastBalance} />
        )}

        {loading ? (
          <LoadingSkeleton type="table" rows={3} width="100%" />
        ) : error ? (
          <div className="text-red-400 font-bold text-center mt-4 p-3 rounded-md shadow-md w-fit mx-auto">
            {error}
          </div>
        ) : (
          <Activity data={activityData} />
        )}
      </div>

      {/* Stellar Analytics Section */}
      <div className=" ">
        {loading ? (
          <LoadingSkeleton type="chart" height="300px" width="100%" />
        ) : error ? (
          <div className="text-red-400 font-bold text-center mt-4 p-3 rounded-md shadow-md w-fit mx-auto">
            {error}
          </div>
        ) : (
          <StellarAnalytics />
        )}
      </div>
    </main>
  );
}
