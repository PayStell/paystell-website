"use client";

export const dynamic = 'force-dynamic';

import Header from "@/components/dashboard/sales/Header";
import Cards, { CardData } from "@/components/dashboard/sales/Cards";
import SalesHistory from "@/components/dashboard/sales/SalesHistory";
import { FiUsers } from "react-icons/fi";
import { CiCreditCard1 } from "react-icons/ci";
import { MdShowChart } from "react-icons/md";
import { useEffect, useState } from "react";

const SalesPage = () => {
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
          setCardData([
            {
              title: "Total Revenue",
              value: "$45,231.89",
              percentage: "20.1%",
              icon: <span>$</span>,
            },
            {
              title: "Subscriptions",
              value: "+3000",
              percentage: "20.1%",
              icon: <FiUsers />,
            },
            {
              title: "Sales",
              value: "+12,234",
              percentage: "20.1%",
              icon: <CiCreditCard1 />,
            },
            {
              title: "Active Now",
              value: "+3000",
              percentage: "20.1%",
              icon: <MdShowChart />,
            },
          ]);
          setError(null);
          setLoading(false);
        }, 2000);
      } catch (err) {
        setError("Failed to load sales data. Please try again.");
        setLoading(false);
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <Cards data={cardData} loading={loading} />
      {error && <p className="text-red-500">{error}</p>}
      <SalesHistory />
    </div>
  );
};

export default SalesPage;


  return (
    <div className="py-10 px-8">
      <Header />
      {error ? (
        <div className="text-red-400 font-bold text-center my-4 p-3 rounded-md shadow-md w-fit mx-auto">{error}</div>
      ) : (
        <Cards data={cardData} loading={loading} />
      )}
      <SalesHistory />
    </div>
  );
};

export default SalesPage;