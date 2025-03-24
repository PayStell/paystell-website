"use client"
import { OnboardingProvider } from "@/components/onboarding/onboarding-context"
import OnboardingFlow from "@/components/onboarding/onboarding-flow"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
      <OnboardingProvider>
        <OnboardingFlow />
      </OnboardingProvider>
    </div>
  )
}

