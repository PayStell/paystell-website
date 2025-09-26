'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaLock } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { Button } from '@/components/ui/button';
import { createPaymentTransaction } from '@/lib/wallet/stellar-service';
import { useWalletStore } from '@/lib/wallet/wallet-store';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentDetails } from './payment-details';
import { WalletConnection } from './wallet-connection';
import { QRCodeDisplay } from './qr-code-display';
import { PaymentProgress } from './payment-progress';
import type { PaymentRequest, PaymentState, PaymentError } from '@/lib/types/payment';
import { toast } from 'sonner';
import { ProductService, type ProductData } from '@/services/product.service';

interface PaymentPreviewProps {
  paymentId: string;
  merchantWalletAddress?: string | null;
}

export default function PaymentPreview({ paymentId, merchantWalletAddress }: PaymentPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [error, setError] = useState<PaymentError | null>(null);
  const [payment, setPayment] = useState<PaymentRequest | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>('INITIAL');
  const [walletConnected, setWalletConnected] = useState(false);
  const { isConnected, publicKey, signTransaction } = useWalletStore();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setIsLoading(true);

        // Fetch product data
        const productData = ProductService.getMockProductData(
          paymentId,
          String(merchantWalletAddress),
        );
        setProduct(productData);

        const total = productData.price + productData.serviceFee;
        const destination = merchantWalletAddress || productData.merchantWalletAddress;

        // Create payment request
        const mockPayment: PaymentRequest = {
          id: paymentId,
          amount: total.toString(),
          asset: 'native',
          destination,
          memo: `Payment for ${productData.sku}`,
          status: 'INITIAL',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };

        setPayment(mockPayment);
        setPaymentState(mockPayment.status);
      } catch (err) {
        setError({
          type: 'VERIFICATION_ERROR',
          code: 'FETCH_FAILED',
          message: `"Failed to load payment details, ${err instanceof Error ? err.message : 'unknown error'}"`,
          recoverable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [paymentId, merchantWalletAddress]);

  const processPayment = async () => {
    if (!payment || !isConnected || !publicKey) return;

    try {
      setPaymentState('PREPARING');
      setError(null);

      // Build transaction
      const { transaction: xdr, network_passphrase } = await createPaymentTransaction({
        source: publicKey,
        destination: payment.destination,
        amount: payment.amount,
        memo: payment.memo,
      });

      setPaymentState('SIGNING');

      // Sign transaction
      await signTransaction(xdr, {
        networkPassphrase: network_passphrase,
      });

      setPaymentState('SUBMITTING');

      // Mock network submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentState('VERIFYING');

      // Mock backend verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPaymentState('COMPLETED');
      toast('Payment completed successfully!');
    } catch (err) {
      setPaymentState('FAILED');

      let errorType: PaymentError['type'] = 'TRANSACTION_ERROR';
      let recoverable = true;

      if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as Error).message === 'string'
      ) {
        if ((err as Error).message.includes('User rejected')) {
          errorType = 'WALLET_ERROR';
          recoverable = true;
        } else if ((err as Error).message.includes('insufficient funds')) {
          errorType = 'TRANSACTION_ERROR';
          recoverable = false;
        } else if ((err as Error).message.includes('verification')) {
          errorType = 'VERIFICATION_ERROR';
          recoverable = true;
        }
      }

      setError({
        type: errorType,
        code:
          typeof err === 'object' && err !== null && 'code' in err
            ? (err as Error & { code?: string }).code || 'UNKNOWN_ERROR'
            : 'UNKNOWN_ERROR',
        message:
          typeof err === 'object' && err !== null && 'message' in err
            ? (err as Error).message
            : 'An unexpected error occurred',
        recoverable,
      });
    }
  };

  const canProceed = walletConnected && paymentState === 'INITIAL';
  const isProcessing = ['PREPARING', 'SIGNING', 'SUBMITTING', 'VERIFYING'].includes(paymentState);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <CgSpinner className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!payment || !product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Payment not found or has expired.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-balance">Complete Your Payment</h1>
        <p className="text-muted-foreground">
          Review the payment details and connect your wallet to proceed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PaymentDetails payment={payment} />
          <QRCodeDisplay payment={payment} />
        </div>

        <div className="space-y-6">
          <WalletConnection onConnectionChange={setWalletConnected} error={error} />

          <PaymentProgress currentState={paymentState} />

          {paymentState === 'COMPLETED' ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Payment Successful!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your payment has been processed successfully.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={processPayment}
                  disabled={!canProceed || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Payment'
                  )}
                </Button>

                {error && error.recoverable && paymentState === 'FAILED' && (
                  <Button
                    variant="outline"
                    onClick={processPayment}
                    className="w-full mt-2 bg-transparent"
                  >
                    Try Again
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {error && !error.recoverable && paymentState === 'FAILED' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-center text-gray-500 text-sm mb-6">
        <FaLock className="h-4 w-4 mr-1" /> Secure payment powered by PayStell
      </div>

      <div className="text-center text-gray-500 text-sm">
        By completing this purchase, you agree to our{' '}
        <Link href="/terms" className="text-gray-500 hover:text-gray-700">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-gray-500 hover:text-gray-700">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
