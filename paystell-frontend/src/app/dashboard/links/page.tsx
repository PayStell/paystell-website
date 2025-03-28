"use client";
import { useState, useEffect } from "react";
import {
  PaymentLinkType,
  PaymentLinksTable,
} from "@/components/dashboard/links/PaymentLinksTable";
import { Button } from "@/components/ui/button";
import { NewLinkModal } from "@/components/dashboard/links/newLink/NewLinkModal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function PaymentLinkScreen(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentLinksData, setPaymentLinksData] = useState<PaymentLinkType[]>(
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setPaymentLinksData([
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
          id: 3,
          name: "Product 3",
          sku: "SKU54321",
          price: "$50.00",
          state: "Active",
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col bg-card rounded-lg w-full p-8 mt-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Payment Links</h1>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          + New Payment
        </Button>
      </div>
      {loading ? (
        <div className="p-6">
          <LoadingSkeleton type="table" rows={5} />
        </div>
      ) : (
        <PaymentLinksTable data={paymentLinksData} />
      )}
      <NewLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}