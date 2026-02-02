'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MdCheckCircle,
  MdAccountBalanceWallet,
  MdKey,
  MdMail,
  MdOutlineSync,
  MdChevronRight,
  MdShield,
  MdWarning,
} from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWallet } from '@/providers/useWalletProvider';
import { walletVerificationAPI } from '@/services/wallet-verification';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const STAGES = {
  CONNECT: 'connect',
  INITIATING: 'initiating',
  OTP: 'otp',
  CONFIRMED: 'confirmed',
  ERROR: 'error',
};

interface verificationStepProps {
  numberlabel: number;
  title: string;
  description: string;
  status: string;
  currentStep: number;
}

const VerificationStep = ({
  numberlabel,
  title,
  description,
  status,
  currentStep,
}: verificationStepProps) => {
  const getStepIcon = () => {
    if (status === 'completed') {
      return <MdCheckCircle className="w-4 h-4 text-green-foreground" />;
    }
    return <span className="text-sm">{numberlabel}</span>;
  };

  const getStepStyle = () => {
    if (status === 'completed') return 'bg-green';
    if (currentStep === numberlabel) return 'bg-[#2196f3] text-white';
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <div className="flex items-start w-[max-content] gap-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${getStepStyle()}`}
      >
        {getStepIcon()}
      </div>
      <div className="flex-1">
        <h3
          className={`font-medium ${currentStep === numberlabel
            ? 'text-blue-500'
            : status === 'completed'
              ? 'text-foreground'
              : 'text-secondary-foreground'
            }`}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

const WalletOption = ({
  name,
  icon,
  onClick,
}: {
  name: string;
  icon: ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-transparent text-secondary-foreground hover:bg-secondary/50 rounded-lg border border-border mb-3 group transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-muted border-border flex items-center justify-center">
        {icon}
      </div>
      <div className="text-left">
        <h3 className="font-medium text-foreground">{name}</h3>
        <p className="text-sm text-card-foreground">Connect using {name}</p>
      </div>
    </div>
    <MdChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-muted-foreground/50 transition-colors" />
  </button>
);

interface WalletVerificationProps {
  onVerificationComplete?: (walletAddress: string) => void;
  onVerificationError?: (error: string) => void;
  userId?: number;
  showCard?: boolean;
}

const WalletVerification = ({
  onVerificationComplete,
  onVerificationError,
  userId,
  showCard = true,
}: WalletVerificationProps) => {
  const { state, connectWallet } = useWallet();
  const { isConnected, publicKey } = state;

  const [stage, setStage] = useState(STAGES.CONNECT);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stage === STAGES.CONNECT && isConnected && publicKey) {
    }
  }, [isConnected, publicKey, stage]);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await connectWallet();
      setIsWalletDialogOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiate = async () => {
    if (!publicKey || !userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await walletVerificationAPI.initiateVerification({
        userId,
        walletAddress: publicKey,
      });
      setVerificationToken(response.verificationToken);
      localStorage.setItem('wallet_verification_token', response.verificationToken);
      setStage(STAGES.OTP);
      toast.success('Verification code sent to your email');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to initiate verification';
      setError(msg);
      toast.error(msg);
      onVerificationError?.(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationToken || !code) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await walletVerificationAPI.verifyWallet({
        token: verificationToken,
        code,
      });
      if (response.success) {
        setStage(STAGES.CONFIRMED);
        onVerificationComplete?.(publicKey || '');
        localStorage.removeItem('wallet_verification_token');
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to verify wallet';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      numberlabel: 1,
      title: 'Connect Wallet',
      description: 'Connect your Stellar wallet to begin the verification process.',
      status: isConnected ? 'completed' : 'pending',
    },
    {
      numberlabel: 2,
      title: 'Initiate Verification',
      description: 'Request a verification code to be sent to your email.',
      status: stage === STAGES.OTP || stage === STAGES.CONFIRMED ? 'completed' : 'pending',
    },
    {
      numberlabel: 3,
      title: 'Email Verification',
      description: 'Enter the code sent to your registered email.',
      status: stage === STAGES.CONFIRMED ? 'completed' : 'pending',
    },
  ];

  const renderActionButton = () => {
    if (isLoading) {
      return (
        <Button disabled className="w-full">
          <MdOutlineSync className="w-4 h-4 mr-2 animate-spin" /> Processing...
        </Button>
      );
    }

    if (!isConnected) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-center text-muted-foreground mb-4">
            A Stellar wallet connection is required to proceed.
          </p>
          <Button className="w-full" onClick={handleConnect}>
            <MdAccountBalanceWallet className="w-4 h-4 mr-2" /> Connect Wallet
          </Button>
        </div>
      );
    }

    if (stage === STAGES.CONNECT) {
      return (
        <Button className="w-full" onClick={handleInitiate}>
          <MdShield className="w-4 h-4 mr-2" /> Verify Wallet Ownership
        </Button>
      );
    }

    if (stage === STAGES.OTP) {
      return (
        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center tracking-widest text-lg font-bold"
              maxLength={6}
            />
          </div>
          <Button className="w-full" onClick={handleVerify} disabled={code.length < 6}>
            <MdCheckCircle className="w-4 h-4 mr-2" /> Verify Code
          </Button>
          <Button variant="ghost" className="w-full text-xs" onClick={() => setStage(STAGES.CONNECT)}>
            Change Wallet or Restart
          </Button>
        </div>
      );
    }

    if (stage === STAGES.CONFIRMED) {
      return (
        <div className="text-center p-4 bg-green/10 rounded-lg border border-green/20">
          <MdCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-700">Wallet Verified!</h3>
          <p className="text-sm text-green-600">Your wallet has been successfully linked.</p>
        </div>
      );
    }

    return null;
  };

  const content = (
    <>
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-center gap-2">
          <MdWarning className="w-4 h-4" />
          {error}
        </div>
      )}
      <div className="space-y-6">
        {steps.map((step) => (
          <VerificationStep
            key={step.numberlabel}
            currentStep={stage === STAGES.OTP ? 3 : isConnected ? 2 : 1}
            {...step}
          />
        ))}
      </div>
      <div className="mt-6">{renderActionButton()}</div>
    </>
  );

  if (!showCard) {
    return <div className="w-full space-y-6">{content}</div>;
  }

  return (
    <Card className="w-full max-w-lg px-5 mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Wallet Verification</CardTitle>
        <p className="text-card-foreground text-sm mt-2">
          Complete these steps to verify your wallet
        </p>
      </CardHeader>
      <CardContent className="space-y-6">{content}</CardContent>
    </Card>
  );
};

export default WalletVerification;
