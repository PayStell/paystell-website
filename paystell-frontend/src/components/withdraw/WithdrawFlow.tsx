'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Coins,
  Lock,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { StepperProvider, useStepper, type StepConfig } from '@/hooks/useStepper';
import { Stepper } from '@/components/stepper/Stepper';
import { StepContent, StepSection } from '@/components/stepper/StepContent';
import { StepNavigation } from '@/components/stepper/StepNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createPaymentTransaction, networkPassphrase } from '@/lib/wallet/stellar-service';
import { useWalletStore } from '@/lib/wallet/wallet-store';
import type {
  WithdrawAssetCode,
  WithdrawFeePriority,
  WithdrawFormData,
  WithdrawMemoType,
  WithdrawTransactionResult,
} from '@/lib/types/withdraw';
import {
  calculateWithdrawFee,
  formatShortStellarAddress,
  STELLAR_MIN_RESERVE_XLM,
  validateStellarDestination,
  validateTwoFactorCode,
  validateWithdrawAmount,
  validateWithdrawMemo,
} from '@/lib/withdraw/withdraw-utils';

export interface WithdrawFlowProps {
  className?: string;
  initialBalances?: Record<WithdrawAssetCode, number>;
  requireTwoFactor?: boolean;
  onWithdrawSuccess?: (tx: WithdrawTransactionResult) => void;
}

const DEFAULT_BALANCES: Record<WithdrawAssetCode, number> = {
  XLM: 1250.5,
  USDC: 540.0,
  EURC: 210.0,
};

const EmptyStepComponent: React.FC = () => null;

interface WithdrawFlowInnerProps {
  formData: WithdrawFormData;
  setFormData: React.Dispatch<React.SetStateAction<WithdrawFormData>>;
  balances: Record<WithdrawAssetCode, number>;
  requireTwoFactor: boolean;
  onOpenConfirmDialog: () => void;
  lastTransaction: WithdrawTransactionResult | null;
  onResetFlow: () => void;
}

function WithdrawFlowInner({
  formData,
  setFormData,
  balances,
  requireTwoFactor,
  onOpenConfirmDialog,
  lastTransaction,
  onResetFlow,
}: WithdrawFlowInnerProps) {
  const { currentStep } = useStepper();
  const { isConnected, publicKey, connectWallet, connecting } = useWalletStore();

  const availableBalance = balances[formData.asset] ?? 0;
  const feeEstimate = useMemo(
    () => calculateWithdrawFee(formData.amount, formData.asset, formData.feePriority),
    [formData.amount, formData.asset, formData.feePriority],
  );

  const maxSpendable = useMemo(() => {
    const reserve =
      formData.asset === 'XLM' ? STELLAR_MIN_RESERVE_XLM + feeEstimate.networkFeeXlm : 0;
    return Math.max(0, Number((availableBalance - reserve).toFixed(7)));
  }, [availableBalance, formData.asset, feeEstimate.networkFeeXlm]);

  const handleSelectMax = () => {
    setFormData((prev) => ({
      ...prev,
      amount: maxSpendable > 0 ? String(maxSpendable) : '0',
    }));
  };

  if (lastTransaction) {
    return (
      <Card className="border-green-500/40 bg-green-500/5">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <CardTitle>Withdrawal Submitted Successfully</CardTitle>
              <CardDescription>
                Your Stellar transaction has been signed and submitted to the network.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-background p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Sent</span>
              <span className="font-semibold">
                {lastTransaction.amount} {lastTransaction.asset}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destination</span>
              <span className="font-mono">
                {formatShortStellarAddress(lastTransaction.destination)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network Fee</span>
              <span>{lastTransaction.feeXlm} XLM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction Hash</span>
              <span className="font-mono text-xs">{lastTransaction.hash}</span>
            </div>
          </div>
          <Button onClick={onResetFlow} className="w-full">
            Make Another Withdrawal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!isConnected && (
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Connect your Stellar wallet to sign and submit withdrawal transactions.</span>
            <Button size="sm" variant="outline" onClick={connectWallet} disabled={connecting}>
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Stepper showProgress showStepNumbers />

      <Card>
        <CardContent className="pt-6">
          <StepContent>
            {currentStep?.id === 'amount' && (
              <StepSection
                title="Step 1: Select Asset & Withdrawal Amount"
                description="Choose the asset you want to withdraw and enter a valid amount within your spendable balance."
                required
              >
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {(['XLM', 'USDC', 'EURC'] as WithdrawAssetCode[]).map((assetCode) => (
                    <Button
                      key={assetCode}
                      type="button"
                      variant={formData.asset === assetCode ? 'default' : 'outline'}
                      onClick={() => setFormData((prev) => ({ ...prev, asset: assetCode }))}
                      className="flex flex-col items-center py-6 h-auto"
                    >
                      <span className="font-bold">{assetCode}</span>
                      <span className="text-xs opacity-80">
                        {balances[assetCode]?.toFixed(2)} available
                      </span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="withdraw-amount">Withdrawal Amount ({formData.asset})</Label>
                    <button
                      type="button"
                      onClick={handleSelectMax}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Max Spendable: {maxSpendable.toFixed(4)} {formData.asset}
                    </button>
                  </div>
                  <Input
                    id="withdraw-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder={`0.00 ${formData.asset}`}
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  />
                  {formData.asset === 'XLM' && (
                    <p className="text-xs text-muted-foreground">
                      Note: {STELLAR_MIN_RESERVE_XLM.toFixed(1)} XLM minimum Stellar account reserve
                      is automatically protected.
                    </p>
                  )}
                </div>
              </StepSection>
            )}

            {currentStep?.id === 'destination' && (
              <StepSection
                title="Step 2: Destination Account & Memo"
                description="Enter the recipient Stellar public key (G...) and optional memo required by exchanges."
                required
              >
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-destination">Destination Stellar Address</Label>
                    <Input
                      id="withdraw-destination"
                      placeholder="G..."
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, destination: e.target.value }))
                      }
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Memo Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['none', 'text', 'id'] as WithdrawMemoType[]).map((mType) => (
                        <Button
                          key={mType}
                          type="button"
                          variant={formData.memoType === mType ? 'default' : 'outline'}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              memoType: mType,
                              memo: mType === 'none' ? '' : prev.memo,
                            }))
                          }
                        >
                          {mType.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {formData.memoType !== 'none' && (
                    <div className="space-y-2">
                      <Label htmlFor="withdraw-memo">
                        Memo ({formData.memoType === 'text' ? 'Max 28 bytes' : 'Numeric ID'})
                      </Label>
                      <Input
                        id="withdraw-memo"
                        placeholder={
                          formData.memoType === 'text' ? 'Enter text memo' : 'Enter numeric memo ID'
                        }
                        value={formData.memo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, memo: e.target.value }))}
                      />
                    </div>
                  )}
                </div>
              </StepSection>
            )}

            {currentStep?.id === 'fee' && (
              <StepSection
                title="Step 3: Network Fee & Speed Selection"
                description="Select your preferred Stellar ledger inclusion priority and review the total deduction."
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {(
                    [
                      { id: 'standard', label: 'Standard', desc: '~5s confirmation (1x base fee)' },
                      { id: 'fast', label: 'Fast', desc: '~3s confirmation (10x base fee)' },
                      { id: 'instant', label: 'Instant', desc: '~2s priority (50x base fee)' },
                    ] as { id: WithdrawFeePriority; label: string; desc: string }[]
                  ).map((tier) => (
                    <Button
                      key={tier.id}
                      type="button"
                      variant={formData.feePriority === tier.id ? 'default' : 'outline'}
                      onClick={() => setFormData((prev) => ({ ...prev, feePriority: tier.id }))}
                      className="flex flex-col items-start p-4 h-auto text-left"
                    >
                      <span className="font-semibold">{tier.label}</span>
                      <span className="text-xs opacity-80">{tier.desc}</span>
                    </Button>
                  ))}
                </div>

                <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-sm mt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Withdrawal Amount</span>
                    <span>
                      {Number(formData.amount || 0).toFixed(4)} {formData.asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stellar Network Fee</span>
                    <span>{feeEstimate.networkFeeXlm.toFixed(7)} XLM</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Deduction</span>
                    <span>
                      {feeEstimate.totalAssetDeduction.toFixed(7)} {formData.asset}
                    </span>
                  </div>
                </div>
              </StepSection>
            )}

            {currentStep?.id === 'confirm' && (
              <StepSection
                title="Step 4: Security Verification & Final Review"
                description="Verify all withdrawal details before authorizing the transaction."
              >
                <div className="rounded-lg border p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source Wallet</span>
                    <span className="font-mono">
                      {publicKey ? formatShortStellarAddress(publicKey) : 'Wallet Not Connected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destination Address</span>
                    <span className="font-mono">
                      {formatShortStellarAddress(formData.destination)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Memo</span>
                    <span>
                      {formData.memoType === 'none'
                        ? 'None'
                        : `${formData.memoType.toUpperCase()}: ${formData.memo}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipient Receives</span>
                    <span className="font-semibold text-base">
                      {feeEstimate.estimatedReceiveAmount} {formData.asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span>{feeEstimate.networkFeeXlm} XLM</span>
                  </div>
                </div>

                {requireTwoFactor && (
                  <div className="space-y-2 pt-3">
                    <Label htmlFor="withdraw-2fa" className="flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" /> 2FA Security Code
                    </Label>
                    <Input
                      id="withdraw-2fa"
                      maxLength={6}
                      placeholder="Enter 6-digit authenticator code"
                      value={formData.twoFactorCode}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, twoFactorCode: e.target.value }))
                      }
                    />
                  </div>
                )}

                <div className="pt-3">
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmedTerms}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, confirmedTerms: e.target.checked }))
                      }
                      className="rounded border-input"
                    />
                    <span>
                      I confirm that the Stellar destination address and memo are accurate and
                      understand that blockchain transactions are irreversible.
                    </span>
                  </label>
                </div>
              </StepSection>
            )}
          </StepContent>

          <div className="mt-6 pt-4 border-t">
            {currentStep?.id === 'confirm' ? (
              <div className="flex justify-between">
                <StepNavigation showNextButton={false} />
                <Button onClick={onOpenConfirmDialog} className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Confirm & Submit Withdrawal
                </Button>
              </div>
            ) : (
              <StepNavigation />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function WithdrawFlow({
  className,
  initialBalances = DEFAULT_BALANCES,
  requireTwoFactor = false,
  onWithdrawSuccess,
}: WithdrawFlowProps) {
  const { isConnected, publicKey, signTransaction } = useWalletStore();
  const [flowKey, setFlowKey] = useState(0);
  const [balances, setBalances] = useState<Record<WithdrawAssetCode, number>>(initialBalances);
  const [formData, setFormData] = useState<WithdrawFormData>({
    asset: 'XLM',
    amount: '',
    destination: '',
    memoType: 'none',
    memo: '',
    feePriority: 'standard',
    twoFactorCode: '',
    confirmedTerms: false,
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<WithdrawTransactionResult | null>(null);

  const feeEstimate = useMemo(
    () => calculateWithdrawFee(formData.amount, formData.asset, formData.feePriority),
    [formData.amount, formData.asset, formData.feePriority],
  );

  const steps: StepConfig<WithdrawFormData>[] = useMemo(
    () => [
      {
        id: 'amount',
        title: 'Amount',
        description: 'Select asset and withdrawal amount',
        component: EmptyStepComponent,
        icon: Coins,
        validate: () => {
          const check = validateWithdrawAmount(
            formData.amount,
            balances[formData.asset] ?? 0,
            formData.asset,
            feeEstimate.networkFeeXlm,
          );
          if (!check.isValid) {
            toast.error(check.error);
            return false;
          }
          return true;
        },
      },
      {
        id: 'destination',
        title: 'Destination',
        description: 'Recipient Stellar address & memo',
        component: EmptyStepComponent,
        icon: ArrowUpRight,
        validate: () => {
          const addrCheck = validateStellarDestination(formData.destination, publicKey);
          if (!addrCheck.isValid) {
            toast.error(addrCheck.error);
            return false;
          }
          const memoCheck = validateWithdrawMemo(formData.memoType, formData.memo);
          if (!memoCheck.isValid) {
            toast.error(memoCheck.error);
            return false;
          }
          return true;
        },
      },
      {
        id: 'fee',
        title: 'Network Fee',
        description: 'Review fee & speed',
        component: EmptyStepComponent,
        validate: () => true,
      },
      {
        id: 'confirm',
        title: 'Confirm',
        description: 'Security verification & submit',
        component: EmptyStepComponent,
        icon: ShieldCheck,
        validate: () => {
          const twoFaCheck = validateTwoFactorCode(formData.twoFactorCode, requireTwoFactor);
          if (!twoFaCheck.isValid) {
            toast.error(twoFaCheck.error);
            return false;
          }
          if (!formData.confirmedTerms) {
            toast.error('Please confirm the transaction accuracy checkbox before proceeding');
            return false;
          }
          return true;
        },
      },
    ],
    [formData, balances, feeEstimate.networkFeeXlm, publicKey, requireTwoFactor],
  );

  const handleOpenConfirmDialog = useCallback(() => {
    for (const step of steps) {
      if (step.validate && !step.validate(formData)) {
        return;
      }
    }
    setSubmissionError(null);
    setIsConfirmModalOpen(true);
  }, [steps, formData]);

  const handleExecuteWithdrawal = async () => {
    for (const step of steps) {
      if (step.validate && !step.validate(formData)) {
        return;
      }
    }

    if (!isConnected || !publicKey) {
      const msg = 'Please connect your Stellar wallet before signing and submitting a withdrawal.';
      setSubmissionError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const memoText = formData.memoType === 'none' ? undefined : formData.memo.trim();
      const { transaction, network_passphrase } = await createPaymentTransaction({
        source: publicKey,
        destination: formData.destination.trim(),
        amount: formData.amount.trim(),
        memo: memoText,
      });

      const passphraseString =
        typeof network_passphrase === 'string' ? network_passphrase : networkPassphrase;

      const signedTxXdr = await signTransaction(transaction, {
        networkPassphrase: passphraseString,
      });

      const response = await fetch('/api/wallet/submit-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signedXdr: signedTxXdr,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`API error: Received ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (!response.ok || !result.hash) {
        const errorMessage = result.error || result.message || 'Transaction submission failed';
        throw new Error(errorMessage);
      }

      const txResult: WithdrawTransactionResult = {
        id: `wd_${result.hash.slice(0, 12)}`,
        hash: result.hash,
        asset: formData.asset,
        amount: formData.amount.trim(),
        destination: formData.destination.trim(),
        feeXlm: feeEstimate.networkFeeXlm.toFixed(7),
        memo: memoText,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };

      setBalances((prev) => ({
        ...prev,
        [formData.asset]: Math.max(
          0,
          Number(((prev[formData.asset] ?? 0) - feeEstimate.totalAssetDeduction).toFixed(7)),
        ),
      }));

      setIsConfirmModalOpen(false);
      setLastTransaction(txResult);
      toast.success(`Successfully withdrew ${formData.amount.trim()} ${formData.asset}`);
      onWithdrawSuccess?.(txResult);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to submit Stellar withdrawal';
      setSubmissionError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetFlow = () => {
    setLastTransaction(null);
    setFlowKey((k) => k + 1);
    setFormData((prev) => ({
      ...prev,
      amount: '',
      destination: '',
      memoType: 'none',
      memo: '',
      twoFactorCode: '',
      confirmedTerms: false,
    }));
  };

  return (
    <div className={className}>
      <StepperProvider key={flowKey} steps={steps} formData={formData}>
        <WithdrawFlowInner
          formData={formData}
          setFormData={setFormData}
          balances={balances}
          requireTwoFactor={requireTwoFactor}
          onOpenConfirmDialog={handleOpenConfirmDialog}
          lastTransaction={lastTransaction}
          onResetFlow={handleResetFlow}
        />
      </StepperProvider>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stellar Withdrawal</DialogTitle>
            <DialogDescription>
              Please verify the final transaction parameters before signing with your Stellar
              wallet.
            </DialogDescription>
          </DialogHeader>

          {submissionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">
                {formData.amount} {formData.asset}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destination</span>
              <span className="font-mono">{formatShortStellarAddress(formData.destination)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network Fee</span>
              <span>{feeEstimate.networkFeeXlm} XLM</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Deduction</span>
              <span>
                {feeEstimate.totalAssetDeduction} {formData.asset}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleExecuteWithdrawal} disabled={isSubmitting}>
              {isSubmitting ? 'Signing & Submitting...' : 'Sign & Submit Withdrawal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
