"use client";
import React from "react";
import  ProfileForm  from "@/components/dashboard/settings/ProfileForm";

const SettingsScreen: React.FC = () => {
  const handleProfileSubmit = (data: { name: string; logo: string | null; description: string }) => {
    console.log("Form is valid:", data);
  };

  return (
    <div className="flex min-h-screen flex-col p-8">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="flex min-h-screen flex-col p-8">
        <div className="bg-white rounded-lg w-full p-8">
          <ProfileForm onSubmit={handleProfileSubmit} />
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;