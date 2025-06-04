"use client"
import { type ReactNode, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MdCheckCircle,
  MdAccountBalanceWallet,
  MdKey,
  MdMail,
  MdOutlineSync,
  MdChevronRight,
  MdShield,
  MdWarning,
  MdError,
} from "react-icons/md"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useWallet } from "@/providers/useWalletProvider"
import { toast } from "sonner"
import { formatAddress } from "@/lib/utils"

const STAGES = {
  CONNECT: "connect",
  SIGN: "sign",
  EMAIL: "email",
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
}

const WalletVerification = ({ onVerificationComplete, onVerificationError }: WalletVerificationProps) => {
  const { state, connectWallet, signTransaction } = useWallet()
  const { publicKey, connecting, isConnected } = state

  const [stage, setStage] = useState(STAGES.CONNECT)
  const [isLoading, setIsLoading] = useState(false)
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [signedMessage, setSignedMessage] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Generate verification message
  useEffect(() => {
    const message = `Verify wallet ownership for PayStell account registration at ${new Date().toISOString().split("T")[0]} - Nonce: ${Math.random().toString(36).substring(7)}`
    setVerificationMessage(message)
  }, [])

  // Update stage based on wallet connection
  useEffect(() => {
    if (isConnected && publicKey && stage === STAGES.CONNECT) {
      setStage(STAGES.SIGN)
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

  const handleSignMessage = async () => {
    if (!publicKey || !verificationMessage) {
      toast.error("Error", { description: "Wallet not connected or message not generated" })
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Create a simple transaction for signing (this is a placeholder - you might need to adjust based on your backend requirements)
      // For now, we'll simulate the signing process
      const messageToSign = Buffer.from(verificationMessage).toString("base64")

      // In a real implementation, you might need to create a proper Stellar transaction
      // For demonstration, we'll use a mock signed message
      const mockSignedMessage = `signed_${messageToSign}_${Date.now()}`

      setSignedMessage(mockSignedMessage)
      setIsSignDialogOpen(false)
      setStage(STAGES.EMAIL)

      toast.success("Message Signed", {
        description: "Successfully signed verification message",
      })

      // Here you would typically send the signed message to your backend
      // await sendVerificationToBackend(publicKey, mockSignedMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign message"
      setError(errorMessage)
      onVerificationError?.(errorMessage)
      toast.error("Signing Failed", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerification = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate email verification process
      // In real implementation, this would call your backend API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStage(STAGES.CONFIRMED)
      onVerificationComplete?.(publicKey!)

      toast.success("Verification Complete", {
        description: "Wallet successfully verified!",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Email verification failed"
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
      case STAGES.SIGN:
        return 2
      case STAGES.EMAIL:
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
      title: "Sign Message",
      description: "Sign a message to verify wallet ownership",
      status: signedMessage ? "completed" : stage === STAGES.SIGN ? "pending" : "pending",
    },
    {
      numberlabel: 3,
      title: "Email Verification",
      description: "Verify your wallet through your registered email.",
      status: stage === STAGES.CONFIRMED ? "completed" : stage === STAGES.EMAIL ? "pending" : "pending",
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

      case STAGES.SIGN:
        return (
          <>
            <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <MdKey className="w-4 h-4 mr-2" /> Sign Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <MdShield className="w-5 h-5 text-blue-500" />
                    <DialogTitle className="text-xl font-semibold">Sign Message</DialogTitle>
                  </div>
                  <p className="text-card-foreground text-sm mt-1">
                    Verify ownership of your wallet by signing this message
                  </p>
                </DialogHeader>

                <div className="my-6 space-y-4">
                  <div className="bg-muted p-4 rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Connected Wallet:</h4>
                    <p className="text-sm font-mono text-foreground">
                      {publicKey ? formatAddress(publicKey) : "Not connected"}
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Message to sign:</h4>
                    <p className="text-sm text-card-foreground font-mono bg-card p-3 rounded border border-border break-all">
                      {verificationMessage}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300 p-3 rounded-lg">
                    <MdWarning className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>This signature request will not trigger any blockchain transaction or incur any fees.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="sm:w-full" onClick={() => setIsSignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="sm:w-full" onClick={handleSignMessage} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <MdOutlineSync className="w-4 h-4 mr-2 animate-spin" />
                        Signing...
                      </>
                    ) : (
                      "Sign Message"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )

      case STAGES.EMAIL:
        return (
          <Button onClick={handleEmailVerification} className="w-full" disabled={isLoading}>
            <MdMail className="w-4 h-4 mr-2" />
            {isLoading ? "Verifying..." : "Complete Verification"}
          </Button>
        )

      case STAGES.CONFIRMED:
        return (
          <Button className="w-full" variant="outline" disabled>
            <MdCheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Verification Complete
          </Button>
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
