"use client";

import Header from "@/components/dashboard/sales/Header";
import Cards, { CardData } from "@/components/dashboard/sales/Cards";
import SalesHistory from "@/components/dashboard/sales/SalesHistory";
import { useState } from "react";

const SalesPage = () => {
  const [loading] = useState(true);
  const cardData: CardData[] = [];

  return (
    <div className="py-10 px-8">
      <Header />
      <Cards />
      <SalesHistory />
    </div>
  );
};

export default SalesPage;