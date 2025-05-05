"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from "react";
import {
  PaymentLinkType,
  PaymentLinksTable,
} from "@/components/dashboard/links/PaymentLinksTable";
import { Button } from "@/components/ui/button";
import { NewLinkModal } from "@/components/dashboard/links/newLink/NewLinkModal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import { getPaymentLinks, type PaymentLink } from "@/services/paymentLink.service";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function PaymentLinkScreen(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentLinksData, setPaymentLinksData] = useState<PaymentLinkType[]>([]);
  const router = useRouter();

  const fetchPaymentLinks = useCallback(async () => {
    try {
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No auth token found, redirecting to login');
        router.push('/login');
        return;
      }

      const response = await getPaymentLinks();
      console.log('Payment links response:', response); // Debug log
      
      // Map the items from the paginated response
      setPaymentLinksData(response.items.map((link: PaymentLink) => ({
        id: link.id,
        name: link.name,
        sku: link.sku || '',
        price: `${link.amount} ${link.currency}`,
        state: link.status.charAt(0).toUpperCase() + link.status.slice(1), // Capitalize status
      })));
    } catch (error) {
      console.error('Failed to fetch payment links:', error);
      if ((error as AxiosError)?.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPaymentLinks();
  }, [router, fetchPaymentLinks]);

  const handleUpdate = async () => {
    await fetchPaymentLinks(); // Refresh the list after update
  };

  const handleDelete = async () => {
    await fetchPaymentLinks(); // Refresh the list after deletion
  };

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
        <PaymentLinksTable 
          data={paymentLinksData} 
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      <NewLinkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchPaymentLinks(); // Refresh the list after creating a new link
        }}
      />
      <Toaster />
    </div>
  );
}
