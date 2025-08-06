"use client";

export const dynamic = "force-dynamic";
import { useWalletStore } from "@/lib/wallet/wallet-store";
import PaymentPreview, {
  type ProductData,
} from "@/components/PaymentLinkPreview/payment-link-preview";
import Image from "next/image";
import { ProductService } from "@/services/product.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function PaymentPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const { publicKey } = useWalletStore();
  const searchParams = useSearchParams();
  const merchantWalletAddress = searchParams.get("merchant");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await ProductService.getProductData(
          params.id,
          merchantWalletAddress
        );
        setProductData(data);
      } catch (err) {
        setError("Failed to load product data");
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id, merchantWalletAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The requested product could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <PaymentPreview product={productData} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
