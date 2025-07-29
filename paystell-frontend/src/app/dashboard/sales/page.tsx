"use client";

export const dynamic = "force-dynamic";

import Header from "@/components/dashboard/sales/Header";
import Cards from "@/components/dashboard/sales/Cards";
import SalesHistory from "@/components/dashboard/sales/SalesHistory";
import { useEffect, useState } from "react";

const SalesPage = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          setError(null);
        }, 2000);
      } catch (err) {
        setError("Failed to load sales data. Please try again.");
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <Cards />
      {error && <p className="text-red-500">{error}</p>}
      <SalesHistory />
    </div>
  );
};

export default SalesPage;
