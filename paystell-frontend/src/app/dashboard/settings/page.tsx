"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useState } from "react"
import ProfileForm from "@/components/dashboard/settings/ProfileForm"
import WalletVerificationSection from "@/components/dashboard/settings/WalletVerificationSection"
import AppearanceSection from "@/components/dashboard/settings/AppearanceSection"
import { useWallet } from "@/providers/useWalletProvider"

const SettingsScreen: React.FC = () => {
  const { state } = useWallet()
  const { publicKey } = state

  const [isWalletVerified, setIsWalletVerified] = useState(false)
  const [verifiedWalletAddress, setVerifiedWalletAddress] = useState<string | null>(null)
  const isEmailVerified = true //user state/API

  const handleProfileSubmit = (data: {
    name: string
    logo: string | null
    description: string
  }) => {
    console.log("Form is valid:", data)
  }

  const handleVerificationComplete = (walletAddress: string) => {
    setIsWalletVerified(true)
    setVerifiedWalletAddress(walletAddress)
    console.log("Wallet verified:", walletAddress)
    //Update your user state or call an API
  }

  const handleVerificationError = (error: string) => {
    console.error("Verification error:", error)
    // Handle verification error (maybe show a notification)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6">
        <ProfileForm onSubmit={handleProfileSubmit} />
        <WalletVerificationSection
          isWalletVerified={isWalletVerified}
          isEmailVerified={isEmailVerified}
          onVerificationComplete={handleVerificationComplete}
          onVerificationError={handleVerificationError}
        />
      </div>
      <AppearanceSection />
    </div>
  )
}

export default SettingsScreen
