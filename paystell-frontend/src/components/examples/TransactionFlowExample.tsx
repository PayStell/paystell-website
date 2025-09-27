'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Wallet,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  User,
} from 'lucide-react';

// Import our stepper components
import { StepperProvider, useStepper } from '@/hooks/useStepper';
import { Stepper } from '@/components/stepper/Stepper';
import { StepContent } from '@/components/stepper/StepContent';
import { StepNavigation } from '@/components/stepper/StepNavigation';
import type { StepConfig } from '@/types/stepper';

// Import transaction components
import { AmountInput } from '@/components/transaction/AmountInput';
import { AddressInput } from '@/components/transaction/AddressInput';
import { TransactionSummary } from '@/components/transaction/TransactionSummary';

// Import transaction utilities
import { handleTransactionError } from '@/lib/transaction/errors';

/**
 * Step 1: Amount Entry
 */
const AmountStep: React.FC = () => {
  // Form is not actually used in this simple example step

  const [amount, setAmount] = useState('');
  const [isValid, setIsValid] = useState(false);

  return (
    <StepContent>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Enter Amount</h2>
          <p className="text-muted-foreground mt-2">
            How much XLM would you like to send?
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <AmountInput
            value={amount}
            onChange={(value) => {
              setAmount(value);
              setIsValid(!!value && Number(value) > 0);
            }}
            xlmPrice={0.12}
            xlmBalance={1000.5}
            placeholder="0.00"
            className="text-center"
            inputClassName="text-2xl"
          />
        </div>

        <div className="text-center">
          <Badge variant={isValid ? 'default' : 'secondary'}>
            {isValid ? 'Valid Amount' : 'Enter Amount'}
          </Badge>
        </div>
      </div>
    </StepContent>
  );
};

/**
 * Step 2: Destination Address
 */
const DestinationStep: React.FC = () => {
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState(false);

  return (
    <StepContent>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Destination Address</h2>
          <p className="text-muted-foreground mt-2">
            Who are you sending XLM to?
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <AddressInput
            value={address}
            onChange={setAddress}
            onValidationChange={(valid) => setIsValid(valid)}
            placeholder="G... or name*domain.com"
          />
        </div>

        <div className="text-center">
          <Badge variant={isValid ? 'default' : 'secondary'}>
            {isValid ? 'Valid Address' : 'Enter Address'}
          </Badge>
        </div>
      </div>
    </StepContent>
  );
};

/**
 * Step 3: Optional Memo
 */
const MemoStep: React.FC = () => {
  const [memo, setMemo] = useState('');

  return (
    <StepContent>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Add a Memo</h2>
          <p className="text-muted-foreground mt-2">
            Optional: Add a note to your transaction
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Memo</label>
            <Textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Payment for services..."
              maxLength={28}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {memo.length}/28
            </div>
          </div>
        </div>

        <div className="text-center">
          <Badge variant="secondary">
            {memo ? 'Memo Added' : 'No Memo (Optional)'}
          </Badge>
        </div>
      </div>
    </StepContent>
  );
};

/**
 * Step 4: Review Transaction
 */
const ReviewStep: React.FC = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock transaction data - in real app this would come from form state
  const transactionData = {
    sourceAddress: 'GCKFBEIYTKP74Q7PI54HDBLYCAUVKNUIOHOJ7YBQGGP7FVPWHRKL2WNN',
    destinationAddress: 'GDWNY2POLGK65VVKIH5KQSH7VWLKRTQ5M6ADLJAYC2UEHEBEARCZJWWI',
    amount: '250.75',
    currency: 'XLM' as const,
    memo: 'Payment for services',
    network: 'testnet' as const,
  };

  const handleConfirm = async () => {
    setIsConfirming(true);

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsCompleted(true);
    } catch (error) {
      handleTransactionError(error);
    } finally {
      setIsConfirming(false);
    }
  };

  if (isCompleted) {
    return (
      <StepContent>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-green-600">Transaction Sent!</h2>
            <p className="text-muted-foreground mt-2">
              Your payment has been successfully submitted to the Stellar network.
            </p>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Transaction ID: 1234567890abcdef... (truncated for demo)
            </AlertDescription>
          </Alert>
          <Button variant="outline" className="mt-4">
            View on Explorer
          </Button>
        </div>
      </StepContent>
    );
  }

  return (
    <StepContent>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Review Transaction</h2>
          <p className="text-muted-foreground mt-2">
            Please review the details before sending
          </p>
        </div>

        <TransactionSummary
          transaction={transactionData}
          xlmPrice={0.12}
          variant="confirmation"
          showConfirmation={true}
          isConfirming={isConfirming}
          onConfirm={handleConfirm}
          onCancel={() => console.log('Transaction cancelled')}
        />
      </div>
    </StepContent>
  );
};

/**
 * Main Transaction Flow Component
 */
const TransactionFlowContent: React.FC = () => {
  const {
    currentStepIndex,
    totalSteps,
    canGoNext,
    canGoPrevious,
    nextStep,
    currentStep,
  } = useStepper();

  const handleNext = async () => {
    try {
      await nextStep();
    } catch (error) {
      handleTransactionError(error);
    }
  };

  // Previous step handler removed as it was unused

  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Send XLM Payment</h1>
        <p className="text-muted-foreground mt-2">
          Complete transaction flow with validation and error handling
        </p>
      </div>

      {/* Stepper Progress */}
      <Stepper />

      {/* Current Step Content */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              {currentStepIndex + 1}
            </span>
            <span>{currentStep?.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step content is rendered by the step component itself */}
        </CardContent>
      </Card>

      {/* Navigation */}
      <StepNavigation
        showBackButton={canGoPrevious}
        showNextButton={canGoNext || isLastStep}
        nextLabel={isLastStep ? 'Complete' : 'Continue'}
        onCustomAction={isLastStep ? undefined : handleNext}
        customActionLabel={isLastStep ? undefined : 'Continue'}
        customActionVariant="default"
      />

      {/* Progress Stats */}
      <div className="text-center">
        <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
          <span>Step {currentStepIndex + 1} of {totalSteps}</span>
          <span>•</span>
          <span>{Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% Complete</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Example Transaction Flow with Demo Controls
 */
export const TransactionFlowExample: React.FC = () => {
  const [isFlowActive, setIsFlowActive] = useState(false);
  const [demoMode, setDemoMode] = useState<'normal' | 'mobile' | 'error'>('normal');

  // Step configuration
  const transactionSteps: StepConfig[] = [
    {
      id: 'amount',
      title: 'Amount',
      description: 'Enter the amount to send',
      component: AmountStep as React.ComponentType<unknown>,
      icon: Wallet,
      validate: async () => {
        // Mock validation
        return true;
      },
    },
    {
      id: 'destination',
      title: 'Destination',
      description: 'Enter recipient address',
      component: DestinationStep as React.ComponentType<unknown>,
      icon: User,
      validate: async () => {
        // Mock validation
        return true;
      },
    },
    {
      id: 'memo',
      title: 'Memo',
      description: 'Add optional memo',
      component: MemoStep as React.ComponentType<unknown>,
      icon: AlertCircle,
      canSkip: true,
      isOptional: true,
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Confirm transaction details',
      component: ReviewStep as React.ComponentType<unknown>,
      icon: CheckCircle,
    },
  ];

  if (!isFlowActive) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-6 h-6" />
              <span>Transaction Flow Demo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              This example demonstrates a complete transaction flow using the stepper
              components with validation, error handling, and mobile responsiveness.
            </p>

            <div className="space-y-4">
              <h3 className="font-medium">Features Demonstrated:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Multi-step transaction flow with validation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Amount input with USD conversion and balance checking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Address input with validation and address book</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Transaction summary with fee calculation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Error handling and recovery suggestions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Mobile-responsive design</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Demo Options:</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setDemoMode('normal');
                    setIsFlowActive(true);
                  }}
                >
                  Start Normal Flow
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDemoMode('mobile');
                    setIsFlowActive(true);
                  }}
                >
                  Mobile View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDemoMode('error');
                    setIsFlowActive(true);
                  }}
                >
                  Error Scenarios
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={demoMode === 'mobile' ? 'max-w-sm mx-auto' : ''}>
      <StepperProvider
        steps={transactionSteps}
        onComplete={(data) => {
          console.log('Transaction completed with data:', data);
          setIsFlowActive(false);
        }}
      >
        <TransactionFlowContent />

        {/* Demo Controls */}
        <div className="max-w-2xl mx-auto p-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Demo Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFlowActive(false)}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Back to Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Flow
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Mode: <Badge variant="secondary">{demoMode}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </StepperProvider>
    </div>
  );
};

export default TransactionFlowExample;