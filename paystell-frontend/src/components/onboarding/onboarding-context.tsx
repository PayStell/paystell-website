"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type OnboardingStep = "welcome" | "business-info" | "payment-details" | "complete"

export type BusinessInfo = {
  businessName: string
  description: string
  profilePicture: File | null
  businessType: string
  website?: string
  phoneNumber?: string
}

export type PaymentInfo = {
  stellarAddress: string
  acceptedAssets: string[]
  paymentTypes: string[]
}

interface OnboardingContextType {
  currentStep: OnboardingStep
  setCurrentStep: (step: OnboardingStep) => void
  businessInfo: BusinessInfo
  setBusinessInfo: (info: Partial<BusinessInfo>) => void
  paymentInfo: PaymentInfo
  setPaymentInfo: (info: Partial<PaymentInfo>) => void
  isStepComplete: (step: OnboardingStep) => boolean
  goToNextStep: () => void
  goToPreviousStep: () => void
}

const defaultBusinessInfo: BusinessInfo = {
  businessName: "",
  description: "",
  profilePicture: null,
  businessType: "",
  website: "",
  phoneNumber: "",
}

const defaultPaymentInfo: PaymentInfo = {
  stellarAddress: "",
  acceptedAssets: ["XLM"],
  paymentTypes: ["online"],
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome")
  const [businessInfo, setBusinessInfoState] = useState<BusinessInfo>(defaultBusinessInfo)
  const [paymentInfo, setPaymentInfoState] = useState<PaymentInfo>(defaultPaymentInfo)

  const setBusinessInfo = (info: Partial<BusinessInfo>) => {
    setBusinessInfoState((prev) => ({ ...prev, ...info }))
  }

  const setPaymentInfo = (info: Partial<PaymentInfo>) => {
    setPaymentInfoState((prev) => ({ ...prev, ...info }))
  }

  const isStepComplete = (step: OnboardingStep): boolean => {
    switch (step) {
      case "welcome":
        return true
      case "business-info":
        return !!businessInfo.businessName && !!businessInfo.description && !!businessInfo.businessType
      case "payment-details":
        return !!paymentInfo.stellarAddress && paymentInfo.acceptedAssets.length > 0
      case "complete":
        // Only mark complete as completed if we've actually reached that step
        return currentStep === "complete"
      default:
        return false
    }
  }

  const stepOrder: OnboardingStep[] = ["welcome", "business-info", "payment-details", "complete"]

  const goToNextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        businessInfo,
        setBusinessInfo,
        paymentInfo,
        setPaymentInfo,
        isStepComplete,
        goToNextStep,
        goToPreviousStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

