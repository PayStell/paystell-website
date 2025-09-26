'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatAddress } from '@/lib/utils';
import { Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ConfirmTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  destination: string;
  amount: string;
  memo?: string;
  usdEquivalent: string | null;
  isSubmitting: boolean;
  sourceAddress: string;
  transactionFee?: string;
  transactionXdr?: string;
}

export function ConfirmTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  destination,
  amount,
  memo,
  usdEquivalent,
  isSubmitting,
  sourceAddress,
  transactionFee,
  transactionXdr,
}: ConfirmTransactionModalProps) {
  const [hasConfirmedTrust, setHasConfirmedTrust] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Confirm Transaction
          </DialogTitle>
          <DialogDescription>
            Please verify all details before confirming this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Sending</span>
              <div className="text-right">
                <p className="font-bold">{amount} XLM</p>
                {usdEquivalent && (
                  <p className="text-xs text-muted-foreground flex items-center justify-end">
                    <Wallet className="h-3 w-3 mr-1" />
                    {usdEquivalent} USD
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">From</span>
              <div className="text-right">
                <p className="font-medium break-all text-sm">{formatAddress(sourceAddress)}</p>
                <p className="text-xs text-muted-foreground">Your Address</p>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">To</span>
              <div className="text-right">
                <p className="font-medium break-all text-sm">{formatAddress(destination)}</p>
                <p className="text-xs text-muted-foreground">Recipient Address</p>
              </div>
            </div>

            {memo && (
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">Memo</span>
                <div className="text-right">
                  <p className="font-medium break-all text-sm">{memo}</p>
                </div>
              </div>
            )}

            {transactionFee && (
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">Network Fee</span>
                <div className="text-right">
                  <p className="font-medium text-sm">{transactionFee} XLM</p>
                  <p className="text-xs text-muted-foreground">Fixed Stellar Fee</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">Network</span>
              <div className="text-right">
                <p className="font-medium text-sm">Stellar Testnet</p>
              </div>
            </div>
          </div>

          {transactionXdr && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Transaction XDR</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(transactionXdr);
                    toast.success('XDR copied to clipboard');
                  }}
                >
                  Copy
                </Button>
              </div>
              <div className="bg-muted/70 p-3 rounded-md">
                <p className="text-xs break-all font-mono overflow-x-auto max-h-24 overflow-y-auto">
                  {transactionXdr}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This is the encoded transaction data that will be signed
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <div className="mt-1">
              <input
                type="checkbox"
                id="trust-confirmation"
                className="rounded text-primary focus:ring-primary"
                checked={hasConfirmedTrust}
                onChange={() => setHasConfirmedTrust(!hasConfirmedTrust)}
              />
            </div>
            <label htmlFor="trust-confirmation" className="text-sm">
              I confirm that I trust this recipient and understand that this transaction cannot be
              reversed once submitted.
            </label>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-full">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!hasConfirmedTrust || isSubmitting}
            className="sm:w-full"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Confirm Transaction
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
