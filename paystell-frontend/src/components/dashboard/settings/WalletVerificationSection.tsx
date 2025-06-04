"use client"

import { useState } from "react"
import WalletVerification from "@/components/wallet/WalletVerification"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MdCheckCircle, MdCancel, MdAccountBalanceWallet, MdWarning } from "react-icons/md"
import { useWallet } from "@/providers/useWalletProvider"
import { formatAddress } from "@/lib/utils"
import { toast } from "sonner"

interface WalletVerificationSectionProps {
  isWalletVerified: boolean
  isEmailVerified: boolean
  onVerificationComplete?: (walletAddress: string) => void
  onVerificationError?: (error: string) => void
}

const WalletVerificationSection = ({
  isWalletVerified,
  isEmailVerified,
  onVerificationComplete,
  onVerificationError,
}: WalletVerificationSectionProps) => {
  const { state } = useWallet()
  const { publicKey, isConnected } = state
  const [isVerificationOpen, setIsVerificationOpen] = useState(false)

  const handleVerificationComplete = (walletAddress: string) => {
    setIsVerificationOpen(false)
    onVerificationComplete?.(walletAddress)
    toast.success("Wallet Verified", {
      description: "Your wallet has been successfully verified!",
    })
  }

  const handleVerificationError = (error: string) => {
    onVerificationError?.(error)
    toast.error("Verification Failed", {
      description: error,
    })
  }

  return (
    <div className="bg-card rounded-lg w-full p-8 mt-8">
      <h2 className="text-xl font-semibold mb-6">Wallet Verification</h2>

      <div className="space-y-6">
        {/* Wallet Connection Status */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
          <div className="flex items-center gap-3">
            <MdAccountBalanceWallet className="w-5 h-5" />
            <div>
              <p className="text-sm text-foreground font-medium">Wallet Connection</p>
              {isConnected && publicKey ? (
                <p className="font-mono text-sm text-muted-foreground">{formatAddress(publicKey)}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No wallet connected</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <MdCheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <MdCancel className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        {/* Wallet Verification */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
          <div className="flex items-center gap-3">
            <MdAccountBalanceWallet className="w-5 h-5" />
            <div>
              <p className="text-sm text-foreground font-medium">Wallet Verification</p>
              <p className="text-sm text-muted-foreground">
                {isWalletVerified ? "Wallet ownership verified" : "Verify wallet ownership"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isWalletVerified ? (
              <MdCheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    {isConnected ? "Verify Wallet" : "Connect & Verify"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <WalletVerification
                    onVerificationComplete={handleVerificationComplete}
                    onVerificationError={handleVerificationError}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Email Verification Status */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
          <div className="flex items-center gap-3">
            {isEmailVerified ? (
              <MdCheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <MdCancel className="w-5 h-5 text-red-500" />
            )}
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-muted-foreground">
                {isEmailVerified ? "Email address verified" : "Email verification required"}
              </p>
            </div>
          </div>
        </div>

        {/* Warning for incomplete verification */}
        {(!isWalletVerified || !isEmailVerified) && (
          <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
            <MdWarning className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Verification Required</p>
              <p className="text-sm mt-1">Complete wallet and email verification to access all features.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletVerificationSection
