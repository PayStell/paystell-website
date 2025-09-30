'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  Clock,
  Copy,
  Check,
  Info,
  Wallet,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { cn, formatAddress, formatAmount } from '@/lib/utils';
import { formatFee, estimatePaymentFee, type FeeEstimation } from '@/lib/transaction/fees';
import { AddressDisplay } from './AddressInput';
import { AmountDisplay } from './AmountInput';
import { toast } from 'sonner';

// DollarSign icon component
const DollarSign = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export interface TransactionData {
  sourceAddress: string;
  destinationAddress: string;
  amount: string;
  currency?: string;
  memo?: string;
  fee?: string;
  network?: 'testnet' | 'mainnet' | 'public';
}

interface TransactionSummaryProps {
  transaction: TransactionData;
  xlmPrice?: number;
  showConfirmation?: boolean;
  showFeeDetails?: boolean;
  showNetworkInfo?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  isConfirming?: boolean;
  className?: string;
  variant?: 'default' | 'confirmation' | 'preview';
  network?: string;
}

export function TransactionSummary({
  transaction,
  xlmPrice,
  showConfirmation = false,
  showFeeDetails = true,
  showNetworkInfo = true,
  onConfirm,
  onCancel,
  isConfirming = false,
  className,
  variant = 'default',
  network = 'testnet',
}: TransactionSummaryProps) {
  const [feeEstimation, setFeeEstimation] = useState<FeeEstimation | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    sourceAddress,
    destinationAddress,
    amount,
    currency = 'XLM',
    memo,
    fee,
    network: transactionNetwork = 'testnet',
  } = transaction;

  const resolvedNetwork = transactionNetwork ?? network;

  // Calculate USD values
  const amountUsd = xlmPrice ? (Number(amount) * xlmPrice).toFixed(2) : null;
  const totalAmount = fee ? (Number(amount) + Number(fee) / 10_000_000).toString() : amount;
  const totalUsd = xlmPrice ? (Number(totalAmount) * xlmPrice).toFixed(2) : null;

  // Fetch fee estimation
  useEffect(() => {
    const fetchFeeEstimation = async () => {
      try {
        const estimation = await estimatePaymentFee(xlmPrice);
        setFeeEstimation(estimation);
      } catch (error) {
        console.error('Failed to fetch fee estimation:', error);
      }
    };

    if (showFeeDetails && !fee) {
      fetchFeeEstimation();
    }
  }, [xlmPrice, showFeeDetails, fee]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error(`Failed to copy ${label}`);
    }
  };

  const getCardVariant = () => {
    switch (variant) {
      case 'confirmation':
        return 'border border-primary bg-primary/5';
      case 'preview':
        return 'border-dashed border-2 border-muted-foreground';
      default:
        return '';
    }
  };

  const finalFee = fee || feeEstimation?.totalFee || '100000';
  const finalFeeXlm = formatFee(finalFee, { precision: 7 });
  const finalFeeUsd = xlmPrice ? formatFee(finalFee, { inUsd: true, xlmPrice }) : null;

  return (
    <Card className={cn(getCardVariant(), className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5" />
          <span>Transaction Summary</span>
          {variant === 'confirmation' && (
            <Badge variant="default" className="ml-auto">
              Ready to Sign
            </Badge>
          )}
          {variant === 'preview' && (
            <Badge variant="secondary" className="ml-auto">
              Preview
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Transaction Flow */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">From</h4>
              <AddressDisplay
                address={sourceAddress}
                name="Your Wallet"
                showCopy={true}
                showExplorer={true}
                size="sm"
                network={resolvedNetwork}
              />
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

            <div className="flex-1">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">To</h4>
              <AddressDisplay
                address={destinationAddress}
                showCopy={true}
                showExplorer={true}
                size="sm"
                network={resolvedNetwork}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Amount Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
              <AmountDisplay
                amount={amount}
                currency={currency}
                usdValue={amountUsd}
                showUsd={!!xlmPrice}
                size="lg"
              />
            </div>
          </div>

          {memo && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Memo</h4>
              <div className="flex items-center space-x-2">
                <p className="text-sm bg-muted p-2 rounded border flex-1 font-mono">{memo}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(memo, 'Memo')}
                  className="h-8 w-8 p-0"
                  aria-label={copied ? 'Memo copied' : 'Copy memo'}
                  title={copied ? 'Memo copied' : 'Copy memo'}
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Fee Details */}
        {showFeeDetails && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Network Fee</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 rounded-full border"
                    aria-label="View fee details"
                    title="View fee details"
                  >
                    <Info className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-destructive">{finalFeeXlm}</p>
                  {finalFeeUsd && <p className="text-xs text-muted-foreground">≈ {finalFeeUsd}</p>}
                </div>
              </div>

              {feeEstimation && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>Est. confirmation: {feeEstimation.estimatedConfirmationTime}s</span>
                  </div>
                  <Badge
                    variant={
                      feeEstimation.congestionLevel === 'low'
                        ? 'default'
                        : feeEstimation.congestionLevel === 'medium'
                          ? 'secondary'
                          : 'destructive'
                    }
                    className="text-xs"
                  >
                    {feeEstimation.congestionLevel} congestion
                  </Badge>
                </div>
              )}
            </div>
          </>
        )}

        {/* Total Amount */}
        <Separator />
        <div className="bg-muted p-4 rounded-lg border">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Total Amount</h3>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {formatAmount(totalAmount, 7)} {currency}
              </p>
              {totalUsd && (
                <p className="text-sm text-muted-foreground flex items-center justify-end">
                  <DollarSign className="h-3 w-3 mr-1" />≈ ${totalUsd} USD
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Network Information */}
        {showNetworkInfo && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Network</span>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    resolvedNetwork === 'mainnet' || resolvedNetwork === 'public'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {resolvedNetwork === 'mainnet' || resolvedNetwork === 'public'
                    ? 'Mainnet'
                    : 'Testnet'}
                </Badge>
                {resolvedNetwork === 'testnet' && (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-xs">Test Network</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Important Notice for Large Amounts */}
        {Number(amount) >= 1000 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-800 font-medium">Large Transaction</p>
              <p className="text-yellow-700">
                Please double-check the recipient address before confirming this transaction.
              </p>
            </div>
          </div>
        )}

        {/* Confirmation Buttons */}
        {showConfirmation && (
          <>
            <Separator />
            <div className="flex space-x-3">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isConfirming}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              {onConfirm && (
                <Button onClick={onConfirm} disabled={isConfirming} className="flex-1">
                  {isConfirming ? 'Confirming...' : 'Confirm Transaction'}
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickSummaryProps {
  amount: string;
  currency?: string;
  destinationAddress: string;
  usdValue?: string | null;
  className?: string;
}

export function QuickSummary({
  amount,
  currency = 'XLM',
  destinationAddress,
  usdValue,
  className,
}: QuickSummaryProps) {
  return (
    <div className={cn('flex items-center justify-between p-3 bg-muted rounded-lg', className)}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <ArrowRight className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="font-medium">
            {formatAmount(amount, 2)} {currency}
          </p>
          {usdValue && <p className="text-xs text-muted-foreground">≈ ${usdValue} USD</p>}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">To</p>
        <p className="font-mono text-sm">{formatAddress(destinationAddress)}</p>
      </div>
    </div>
  );
}

export default TransactionSummary;
