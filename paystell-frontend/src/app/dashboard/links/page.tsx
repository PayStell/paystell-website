"use client";
import {
  PaymentLinkType,
  PaymentLinksTable,
} from "@/components/dashboard/links/PaymentLinksTable";
import { Button } from "@/components/ui/button";
import { NewLinkModal } from "@/components/dashboard/links/newLink/NewLinkModal";
import { useState } from "react";

const paymentLinksData: PaymentLinkType[] = [
  {
    id: 1,
    name: "Product 1",
    sku: "SKU12345",
    price: "$20.00",
    state: "Active",
  },
  {
    id: 2,
    name: "Product 2",
    sku: "SKU67890",
    price: "$35.00",
    state: "Inactive",
  },
  {
    id: 4,
    name: "Product 3",
    sku: "SKU54321",
    price: "$50.00",
    state: "Active",
  },
  {
    id: 5,
    name: "Product 3",
    sku: "SKU54321",
    price: "$50.00",
    state: "Active",
  },
  {
    id: 6,
    name: "Product 3",
    sku: "SKU54321",
    price: "$50.00",
    state: "Active",
  },
  {
    id: 7,
    name: "Product 3",
    sku: "SKU54321",
    price: "$50.00",
    state: "Active",
  },
  {
    id: 8,
    name: "Product 3",
    sku: "SKU54321",
    price: "$50.00",
    state: "Active",
  },
];

export default function PaymentLinkScreen(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Payment Links</h1>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          + New Payment
        </Button>
      </div>
      <PaymentLinksTable data={paymentLinksData} />
      <NewLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
