"use client";

import { useState } from "react";
import WalletVerification from "@/components/wallet/WalletVerification";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdCheckCircle, MdCancel, MdAccountBalanceWallet } from "react-icons/md";

interface WalletVerificationSectionProps {
  walletAddress: string;
  isWalletVerified: boolean;
  isEmailVerified: boolean;
  onVerificationComplete?: () => void;
}

const WalletVerificationSection = ({
  walletAddress,
  isWalletVerified,
  isEmailVerified,
  onVerificationComplete,
}: WalletVerificationSectionProps) => {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg w-full p-8 mt-8">
      <h2 className="text-xl font-semibold mb-6">Wallet Verification</h2>

      <div className="space-y-6">
        {/* Wallet Address Display */}
        <div className="flex items-center justify-between p-4 bg-button rounded-lg border">
          <div className="flex items-center gap-3">
            <MdAccountBalanceWallet className="w-5 h-5" />
            <div>
              <p className="text-sm text-foreground">Wallet Address</p>
              <p className="font-mono text-sm text-muted-foreground">
                {walletAddress}
              </p>
            </div>
          </div>
          <Dialog
            open={isVerificationOpen}
            onOpenChange={(open) => {
              setIsVerificationOpen(open);
              if (!open) {
                onVerificationComplete?.();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="secondary">
                {isWalletVerified ? "Verified" : "Verify Wallet"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <WalletVerification />
            </DialogContent>
          </Dialog>
        </div>

        {/* Verification Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-button rounded-lg border">
            <div className="flex items-center gap-3">
              {isEmailVerified ? (
                <MdCheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <MdCancel className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">
                  {isEmailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-button rounded-lg border">
            <div className="flex items-center gap-3">
              {isWalletVerified ? (
                <MdCheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <MdCancel className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">Wallet Verification</p>
                <p className="text-sm text-muted-foreground">
                  {isWalletVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletVerificationSection;
