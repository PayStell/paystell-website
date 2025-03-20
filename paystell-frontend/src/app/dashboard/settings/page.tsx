"use client";
import React, { useState } from "react";
import ProfileForm from "@/components/dashboard/settings/ProfileForm";
import WalletVerificationSection from "@/components/dashboard/settings/WalletVerificationSection";

const SettingsScreen: React.FC = () => {
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  
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
    <div className="flex min-h-screen flex-col p-8">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="flex min-h-screen flex-col p-8">
        <div className="bg-white rounded-lg w-full p-8">
          <ProfileForm onSubmit={handleProfileSubmit} />
        </div>
        
        <WalletVerificationSection
          walletAddress={walletAddress}
          isWalletVerified={isWalletVerified}
          isEmailVerified={isEmailVerified}
        />
      </div>
    </div>
  );
};

export default SettingsScreen;
