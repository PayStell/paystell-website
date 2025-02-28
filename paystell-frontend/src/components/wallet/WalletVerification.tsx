"use client";
import React, { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Wallet,
  Key,
  Mail,
  Loader2,
  ChevronRight,
  Shield,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STAGES = {
  CONNECT: "connect",
  SIGN: "sign",
  EMAIL: "email",
  CONFIRMED: "confirmed",
  ERROR: "error",
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
    if (status === "completed") {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    return <span className="text-sm">{numberlabel}</span>;
  };

  const getStepStyle = () => {
    if (status === "completed") return "bg-green-100";
    if (currentStep === numberlabel) return "bg-[#2196f3] text-white";
    return "bg-gray-100 text-gray-400";
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
          className={`font-medium ${
            currentStep === numberlabel
              ? "text-blue-500"
              : status === "completed"
                ? "text-gray-900"
                : "text-gray-400"
          }`}
        >
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
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
    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-200 mb-3 group transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-left">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">Connect using {name}</p>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
  </button>
);

const WalletVerification = () => {
  const [stage, setStage] = useState(STAGES.CONNECT);
  const [isLoading, setIsLoading] = useState(false);
  const [, setSelectedWallet] = useState<string | null>(null);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

  const mockProcess = async (nextStage: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStage(nextStage);
    setIsLoading(false);
  };

  const selectWallet = (wallet: string) => {
    setSelectedWallet(wallet);
    setIsWalletDialogOpen(false);
    mockProcess(STAGES.SIGN);
  };

  const steps = [
    {
      numberlabel: 1,
      title: "Connect Wallet",
      description:
        "Connect your Stellar wallet to begin the verification process.",
      status: stage !== STAGES.CONNECT ? "completed" : "pending",
    },
    {
      numberlabel: 2,
      title: "Sign Message",
      description: "Sign a message to verify wallet ownership",
      status:
        stage === STAGES.EMAIL || stage === STAGES.CONFIRMED
          ? "completed"
          : "pending",
    },
    {
      numberlabel: 3,
      title: "Email Verification",
      description: "Verify your wallet through your registered email.",
      status: stage === STAGES.CONFIRMED ? "completed" : "pending",
    },
  ];

  const renderActionButton = () => {
    if (isLoading) {
      return (
        <Button disabled className="w-full">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
        </Button>
      );
    }
    switch (stage) {
      case STAGES.CONNECT:
        return (
          <>
            <Dialog
              open={isWalletDialogOpen}
              onOpenChange={setIsWalletDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Connect Your Wallet
                  </DialogTitle>
                  <p className="text-gray-500 text-sm mt-1">
                    Choose a wallet to connect with our service
                  </p>
                </DialogHeader>
                <div className="mt-6">
                  <WalletOption
                    name="Stellar Wallet"
                    icon={<Wallet className="w-5 h-5 text-blue-500" />}
                    onClick={() => selectWallet("Stellar Wallet")}
                  />
                  <WalletOption
                    name="Freighter"
                    icon={<Wallet className="w-5 h-5 text-purple-500" />}
                    onClick={() => selectWallet("Freighter")}
                  />
                  <WalletOption
                    name="LOBSTR"
                    icon={<Wallet className="w-5 h-5 text-orange-500" />}
                    onClick={() => selectWallet("LOBSTR")}
                  />
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By connecting a wallet, you agree to our Terms of Service
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </>
        );
      case STAGES.SIGN:
        return (
          <>
            <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Key className="w-4 h-4 mr-2" /> Sign Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <DialogTitle className="text-xl font-semibold">
                      Sign Message
                    </DialogTitle>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Verify ownership of your wallet by signing this message
                  </p>
                </DialogHeader>

                <div className="my-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Message to sign:
                    </h4>
                    <p className="text-sm text-gray-600 font-mono bg-white p-3 rounded border border-gray-200">
                      Verify wallet ownership for account registration at{" "}
                      {new Date().toISOString().split("T")[0]}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <p>
                      This signature request will not trigger any blockchain
                      transaction or incur any fees.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="sm:w-full"
                    onClick={() => setIsSignDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="sm:w-full"
                    onClick={() => {
                      setIsSignDialogOpen(false);
                      mockProcess(STAGES.EMAIL);
                    }}
                  >
                    Sign Message
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        );
      case STAGES.EMAIL:
        return (
          <Button
            onClick={() => mockProcess(STAGES.CONFIRMED)}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" /> Check Email
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-lg px-5 mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">
          Wallet Verification
        </CardTitle>
        <p className="text-gray-500 text-sm mt-2">
          Complete these steps to verify your wallet
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step) => (
          <VerificationStep
            key={step.numberlabel}
            currentStep={steps.findIndex((s) => s.status !== "completed") + 1}
            {...step}
          />
        ))}
        {renderActionButton()}
      </CardContent>
    </Card>
  );
};

export default WalletVerification;
