"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCheck, FaCreditCard, FaLock } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { SuccessMessage } from "./success-message";
import { createPaymentTransaction } from "@/lib/wallet/stellar-service";
import { useWalletStore } from "@/lib/wallet/wallet-store";

export interface ProductData {
  name: string;
  sku: string;
  price: number;
  serviceFee: number;
  features: string[];
  imageUrl?: string;
  merchantWalletAddress: string;
}

interface PaymentPreviewProps {
  product: ProductData;
}

export default function PaymentPreview({ product }: PaymentPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, publicKey, connectWallet, signTransaction } =
    useWalletStore();
  const total = product.price + product.serviceFee;

  const handlePayment = async () => {
    if (!isConnected || !publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Create the payment transaction
      const { transaction: xdr, network_passphrase } =
        await createPaymentTransaction({
          source: publicKey,
          destination: product.merchantWalletAddress,
          amount: total.toString(),
          memo: `Payment for ${product.sku}`,
        });

      // 2. Sign the transaction with the wallet
      const signedXdr = await signTransaction(xdr, {
        networkPassphrase: network_passphrase,
      });

      // 3. Submit to the network
      const response = await fetch("/api/stellar/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signedTransaction: signedXdr,
          productId: product.sku,
          amount: total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Payment failed");
      }

      // setTxId(result.transactionId);
      setIsSuccess(true);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-gray-200 rounded-lg p-6">
      {isSuccess ? (
        <SuccessMessage productName={product.name} />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-center mb-6">
            Complete Your Purchase
          </h1>

          <div className="flex gap-4 mb-4">
            <div className="w-28 h-28 p-4 flex-shrink-0 rounded">
              <Image
                src={product.imageUrl || "/favicon.ico"}
                alt={product.name}
                width={112}
                height={112}
                className="object-cover w-full h-full rounded"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h2>
              <p className="text-gray-400">SKU: {product.sku}</p>
              <p className="text-lg font-medium mt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-gray-700 font-medium mb-2">
              Product Features:
            </h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-700">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Service fee</span>
              <span className="text-gray-700">
                ${product.serviceFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {!isConnected ? (
            <Button
              className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 mb-2"
              onClick={connectWallet}
            >
              Connect Stellar Wallet
            </Button>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Paying with wallet:</p>
                <p className="font-mono text-sm break-all">{publicKey}</p>
              </div>

              <Button
                className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 mb-2"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CgSpinner className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="mr-2 h-5 w-5" /> Pay $
                    {total.toFixed(2)}
                  </>
                )}
              </Button>
            </>
          )}

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <div className="flex items-center justify-center text-gray-500 text-sm mb-6">
            <FaLock className="h-4 w-4 mr-1" /> Secure payment powered by
            PayStell
          </div>

          <div className="text-center text-gray-500 text-sm">
            By completing this purchase, you agree to our{" "}
            <Link href="/terms" className="text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
            .
          </div>
        </>
      )}
    </div>
  );
}
