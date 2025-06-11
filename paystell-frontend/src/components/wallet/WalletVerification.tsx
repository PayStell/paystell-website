"use client"
import { type ReactNode, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  MdCheckCircle,
  MdAccountBalanceWallet,
  MdKey,
  MdMail,
  MdOutlineSync,
  MdChevronRight,
  MdShield,
  MdError,
  MdInfo,
  MdRefresh,
} from "react-icons/md"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useWallet } from "@/providers/useWalletProvider"
import { toast } from "sonner"
import { formatAddress } from "@/lib/utils"
import { walletVerificationAPI } from "@/services/wallet-verification"

const STAGES = {
  CONNECT: "connect",
  INITIATE: "initiate",
  VERIFY: "verify",
  CONFIRMED: "confirmed",
  ERROR: "error",
}

interface VerificationStepProps {
  numberlabel: number
  title: string
  description: string
  status: string
  currentStep: number
}

const VerificationStep = ({ numberlabel, title, description, status, currentStep }: VerificationStepProps) => {
  const getStepIcon = () => {
    if (status === "completed") {
      return <MdCheckCircle className="w-4 h-4 text-green-500" />
    }
    if (status === "error") {
      return <MdError className="w-4 h-4 text-red-500" />
    }
    return <span className="text-sm">{numberlabel}</span>
  }

  const getStepStyle = () => {
    if (status === "completed") return "bg-green-500 text-white"
    if (status === "error") return "bg-red-500 text-white"
    if (currentStep === numberlabel) return "bg-blue-500 text-white"
    return "bg-secondary text-secondary-foreground"
  }

  return (
    <div className="flex items-start w-full gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${getStepStyle()}`}>
        {getStepIcon()}
      </div>
      <div className="flex-1">
        <h3
          className={`font-medium ${
            currentStep === numberlabel
              ? "text-blue-500"
              : status === "completed"
                ? "text-foreground"
                : status === "error"
                  ? "text-red-500"
                  : "text-secondary-foreground"
          }`}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
    </div>
  )
}

const WalletOption = ({
  name,
  icon,
  onClick,
  disabled = false,
}: {
  name: string
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between p-4 bg-transparent text-secondary-foreground hover:bg-secondary/50 rounded-lg border border-border mb-3 group transition-colors ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-muted border-border flex items-center justify-center">{icon}</div>
      <div className="text-left">
        <h3 className="font-medium text-foreground">{name}</h3>
        <p className="text-sm text-card-foreground">Connect using {name}</p>
      </div>
    </div>
    <MdChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-muted-foreground/50 transition-colors" />
  </button>
)

interface WalletVerificationProps {
  onVerificationComplete?: (walletAddress: string) => void
  onVerificationError?: (error: string) => void
  userId: number
}

const WalletVerification = ({ onVerificationComplete, onVerificationError, userId }: WalletVerificationProps) => {
  const { state, connectWallet } = useWallet()
  const { publicKey, connecting, isConnected } = state

  const [stage, setStage] = useState(STAGES.CONNECT)
  const [isLoading, setIsLoading] = useState(false)
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationToken, setVerificationToken] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationData, setVerificationData] = useState<any>(null)

  // Update stage based on wallet connection
  useEffect(() => {
    if (isConnected && publicKey && stage === STAGES.CONNECT) {
      setStage(STAGES.INITIATE)
      toast.success("Wallet Connected", {
        description: `Connected to ${formatAddress(publicKey)}`,
      })
    }
  }, [isConnected, publicKey, stage])

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await connectWallet()
      setIsWalletDialogOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
      setError(errorMessage)
      onVerificationError?.(errorMessage)
      toast.error("Connection Failed", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitiateVerification = async () => {
    if (!publicKey) {
      toast.error("Error", { description: "Wallet not connected" })
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await walletVerificationAPI.initiateVerification({
        userId,
        walletAddress: publicKey,
      })

      setVerificationData(response)
      setVerificationToken(response.verificationToken)
      setStage(STAGES.VERIFY)

      toast.success("Verification Initiated", {
        description: "Check your email for the verification code!",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initiate verification"
      setError(errorMessage)
      onVerificationError?.(errorMessage)
      toast.error("Initiation Failed", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyWallet = async () => {
    if (!verificationToken || !verificationCode.trim()) {
      toast.error("Error", { description: "Please enter the verification code" })
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await walletVerificationAPI.verifyWallet({
        token: verificationToken,
        code: verificationCode,
      })

      if (response.success) {
        setStage(STAGES.CONFIRMED)
        onVerificationComplete?.(publicKey!)

        toast.success("Verification Complete", {
          description: "Wallet successfully verified!",
        })
      } else {
        throw new Error("Verification failed")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Verification failed"
      setError(errorMessage)
      onVerificationError?.(errorMessage)
      toast.error("Verification Failed", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentStep = () => {
    switch (stage) {
      case STAGES.CONNECT:
        return 1
      case STAGES.INITIATE:
        return 2
      case STAGES.VERIFY:
        return 3
      case STAGES.CONFIRMED:
        return 4
      default:
        return 1
    }
  }

  const steps = [
    {
      numberlabel: 1,
      title: "Connect Wallet",
      description: "Connect your Stellar wallet to begin the verification process.",
      status: isConnected ? "completed" : stage === STAGES.CONNECT ? "pending" : "pending",
    },
    {
      numberlabel: 2,
      title: "Initiate Verification",
      description: "Start the verification process and receive an email with verification code.",
      status: verificationToken ? "completed" : stage === STAGES.INITIATE ? "pending" : "pending",
    },
    {
      numberlabel: 3,
      title: "Enter Verification Code",
      description: "Enter the verification code sent to your email.",
      status: stage === STAGES.CONFIRMED ? "completed" : stage === STAGES.VERIFY ? "pending" : "pending",
    },
  ]

  const renderActionButton = () => {
    if (isLoading || connecting) {
      return (
        <Button disabled className="w-full">
          <MdOutlineSync className="w-4 h-4 mr-2 animate-spin" />
          {connecting ? "Connecting..." : "Processing..."}
        </Button>
      )
    }

    switch (stage) {
      case STAGES.CONNECT:
        return (
          <>
            <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <MdAccountBalanceWallet className="w-4 h-4 mr-2" /> Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Connect Your Wallet</DialogTitle>
                  <p className="text-card-foreground text-sm mt-1">Choose a wallet to connect with our service</p>
                </DialogHeader>
                <div className="mt-6">
                  <WalletOption
                    name="Stellar Wallet"
                    icon={<MdAccountBalanceWallet className="w-5 h-5 text-blue-500" />}
                    onClick={handleConnectWallet}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By connecting a wallet, you agree to our Terms of Service
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )

      case STAGES.INITIATE:
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
              <MdInfo className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Ready to Verify</p>
                <p className="text-sm mt-1">
                  Your wallet {formatAddress(publicKey!)} is connected. Click below to start verification.
                </p>
              </div>
            </div>
            <Button onClick={handleInitiateVerification} className="w-full" disabled={isLoading}>
              <MdKey className="w-4 h-4 mr-2" />
              {isLoading ? "Initiating..." : "Start Verification"}
            </Button>
          </div>
        )

      case STAGES.VERIFY:
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-4 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
              <MdMail className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Email Sent!</p>
                <p className="text-sm mt-1">Check your email for the verification code and enter it below.</p>
              </div>
            </div>

            {verificationData && (
              <div className="bg-muted p-4 rounded-lg border border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Verification Details:</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Wallet:</span> {formatAddress(verificationData.walletAddress)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {verificationData.status}
                  </p>
                  <p>
                    <span className="font-medium">Expires:</span>{" "}
                    {new Date(verificationData.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code from email"
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">Enter the 6-digit verification code sent to your email.</p>
            </div>

            <Button
              onClick={handleVerifyWallet}
              className="w-full"
              disabled={isLoading || !verificationCode.trim() || verificationCode.length !== 6}
            >
              <MdShield className="w-4 h-4 mr-2" />
              {isLoading ? "Verifying..." : "Verify Wallet"}
            </Button>
          </div>
        )

      case STAGES.CONFIRMED:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
              <MdCheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Verification Successful!</p>
                <p className="text-sm mt-1">Your wallet has been verified and linked to your account.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="sm:w-full" variant="outline" disabled>
                <MdCheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Verification Complete
              </Button>
              <Button className="sm:w-full" onClick={() => window.location.reload()}>
                <MdRefresh className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-lg px-5 mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Wallet Verification</CardTitle>
        <p className="text-card-foreground text-sm mt-2">Complete these steps to verify your wallet</p>
        {publicKey && (
          <div className="mt-2 p-2 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Connected Wallet:</p>
            <p className="text-sm font-mono">{formatAddress(publicKey)}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
            <MdError className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {steps.map((step) => (
          <VerificationStep key={step.numberlabel} currentStep={getCurrentStep()} {...step} />
        ))}

        {renderActionButton()}
      </CardContent>
    </Card>
  )
}

export default WalletVerification
