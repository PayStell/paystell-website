"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useState, useEffect } from "react"
import ProfileForm from "@/components/dashboard/settings/ProfileForm"
import WalletVerificationSection from "@/components/dashboard/settings/WalletVerificationSection"
import AppearanceSection from "@/components/dashboard/settings/AppearanceSection"
import { useWallet } from "@/providers/useWalletProvider"
import { useAuth } from "@/providers/AuthProvider"
import { toast } from "sonner"

const SettingsScreen: React.FC = () => {
  const { state } = useWallet()
  const { publicKey } = state
  const { user: userData } = useAuth()

  // Use auth data for verification status, with local state as fallback
  const [localWalletVerified, setLocalWalletVerified] = useState(false)
  // const [verifiedWalletAddress, setVerifiedWalletAddress] = useState<string | null>(null)

  const isEmailVerified = userData?.isEmailVerified ?? false
  const isWalletVerified = userData?.isWalletVerified ?? localWalletVerified
  const userId = userData?.id
  useEffect(() => {
    if (userData?.isWalletVerified) {
      setLocalWalletVerified(userData.isWalletVerified)
      // setVerifiedWalletAddress(publicKey || null)
    }
  }, [userData, publicKey])

  const handleProfileSubmit = (data: {
    name: string
    logo: string | null
    description: string
  }) => {
    console.log("Form is valid:", data)
  }

  const handleVerificationComplete = async (/*walletAddress: string*/) => {
    setLocalWalletVerified(true)
    // setVerifiedWalletAddress(walletAddress)

    toast.success("Wallet Verified", {
      description: "Your wallet has been successfully verified! Please refresh the page to see updated status.",
    })

    setTimeout(() => {
      toast.info("Refresh Needed", {
        description: "Please refresh the page to see your updated verification status.",
        action: {
          label: "Refresh",
          onClick: () => window.location.reload(),
        },
      })
    }, 3000)
  }

  const handleVerificationError = (error: string) => {
    console.error("Verification error:", error)
  }

  if (!userData || !userId) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading user data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6">
        <ProfileForm onSubmit={handleProfileSubmit} />
        <WalletVerificationSection
          isWalletVerified={isWalletVerified}
          isEmailVerified={isEmailVerified}
          userId={userId}
          onVerificationComplete={handleVerificationComplete}
          onVerificationError={handleVerificationError}
        />
      </div>
      <AppearanceSection />
    </div>
  )
}

export default SettingsScreen
