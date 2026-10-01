import React, { useState, useEffect } from 'react';
import { Stepper, Step } from '../ui/Stepper';
import { Input, Button, Modal, Alert, Card } from '../ui/common';
import { useWallet } from '@creit.tech/stellar-wallets-kit';
import { StellarSdk } from '@stellar/stellar-sdk';

interface WithdrawFlowProps {
  onClose: () => void;
}

export const WithdrawFlow: React.FC<WithdrawFlowProps> = ({ onClose }) => {
  const { wallet, balance, signTransaction } = useWallet();
  const [currentStep, setCurrentStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [fee, setFee] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const steps = [
    { title: 'Amount', content: <AmountStep balance={balance} amount={amount} setAmount={setAmount} /> },
    { title: 'Destination', content: <DestinationStep destination={destination} setDestination={setDestination} /> },
    { title: 'Review', content: <ReviewStep amount={amount} destination={destination} fee={fee} /> },
    { title: 'Confirm', content: <ConfirmationStep /> },
  ];

  const handleNext = async () => {
    if (currentStep === 1) {
      await calculateFee();
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const calculateFee = async () => {
    try {
      // Simplified fee estimation for Stellar
      setFee('0.00001'); 
    } catch (e) {
      setStatus({ type: 'error', message: 'Failed to calculate network fee' });
    }
  };

  const processWithdraw = async () => {
    setIsProcessing(true);
    setStatus(null);
    try {
      if (!wallet) throw new Error('Wallet not connected');
      
      // Stellar Transaction Logic
      const transaction = await signTransaction({
        type: 'payment',
        destination: destination,
        amount: amount,
      });

      await transaction.submit();
      setStatus({ type: 'success', message: 'Withdrawal successful!' });
      setTimeout(onClose, 3000);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Transaction failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="withdraw-flow-container">
      <Stepper activeStep={currentStep}>
        {steps.map((step, index) => (
          <Step key={index}>{step.title}</Step>
        ))}
      </Stepper>

      <div className="step-content mt-6">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={handlePrev} disabled={currentStep === 0}>
          Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} disabled={currentStep === 0 && !amount}>
            Next
          </Button>
        ) : (
          <Button onClick={processWithdraw} loading={isProcessing} variant="primary">
            Confirm & Send
          </Button>
        )}
      </div>

      {status && (
        <Alert type={status.type} className="mt-4">
          {status.message}
        </Alert>
      )}
    </Card>
  );
};

const AmountStep = ({ balance, amount, setAmount }: any) => (
  <div className="flex flex-col gap-4">
    <label className="text-sm font-medium">Enter Amount to Withdraw</label>
    <Input 
      type="number" 
      placeholder="0.00" 
      value={amount} 
      onChange={(e) => setAmount(e.target.value)} 
    />
    <p className="text-xs text-gray-500">Available Balance: {balance} XLM</p>
    {parseFloat(amount) > parseFloat(balance) && (
      <span className="text-red-500 text-xs">Insufficient funds</span>
    )}
  </div>
);

const DestinationStep = ({ destination, setDestination }: any) => (
  <div className="flex flex-col gap-4">
    <label className="text-sm font-medium">Destination Stellar Address</label>
    <Input 
      placeholder="G..." 
      value={destination} 
      onChange={(e) => setDestination(e.target.value)} 
    />
    <p className="text-xs text-gray-500">Ensure the address is correct. Transactions cannot be reversed.</p>
  </div>
);

const ReviewStep = ({ amount, destination, fee }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between py-2 border-b">
      <span>Amount:</span> <span className="font-bold">{amount} XLM</span>
    </div>
    <div className="flex justify-between py-2 border-b">
      <span>Destination:</span> <span className="font-mono text-xs">{destination}</span>
    </div>
    <div className="flex justify-between py-2 border-b">
      <span>Network Fee:</span> <span className="font-bold">{fee} XLM</span>
    </div>
    <div className="flex justify-between py-2 text-lg font-bold">
      <span>Total:</span> <span>{(parseFloat(amount) + parseFloat(fee)).toFixed(7)} XLM</span>
    </div>
  </div>
);

const ConfirmationStep = () => (
  <div className="text-center py-4">
    <h3 className="text-lg font-semibold">Final Verification</h3>
    <p className="text-sm text-gray-600">Please review all details. By clicking confirm, you authorize the transfer of funds from your wallet.</p>
  </div>
);
