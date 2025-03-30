"use client";

export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import ProfileForm from "@/components/dashboard/settings/ProfileForm";
import WalletVerificationSection from "@/components/dashboard/settings/WalletVerificationSection";
import AppearanceSection from "@/components/dashboard/settings/AppearanceSection";

const SettingsScreen: React.FC = () => {
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const isEmailVerified = true; // Changed to constant since it's not being modified

  // Mock wallet address - replace with actual wallet address from your system
  const walletAddress = "GABC...XYZ";

  const handleProfileSubmit = (data: {
    name: string;
    logo: string | null;
    description: string;
  }) => {
    console.log("Form is valid:", data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6">
        <ProfileForm onSubmit={handleProfileSubmit} />
        <WalletVerificationSection
          walletAddress={walletAddress}
          isWalletVerified={isWalletVerified}
          isEmailVerified={isEmailVerified}
          onVerificationComplete={() => setIsWalletVerified(true)}
        />
      </div>
      <AppearanceSection />
    </div>
  );
};

export default SettingsScreen;
