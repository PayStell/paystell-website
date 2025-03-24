"use client"

import { useOnboarding } from "./onboarding-context"
import { Card, CardContent } from "@/components/ui/card"
import OnboardingProgress from "./onboarding-progress"
import WelcomeStep from "./steps/WelcomeStep"
import BusinessInfoStep from "./steps/BusinessInfoStep"
import PaymentDetailsStep from "./steps/PaymentDetailsStep"
import CompleteStep from "./steps/CompleteStep"
import { AnimatePresence, motion } from "framer-motion"

export default function OnboardingFlow() {
  const { currentStep } = useOnboarding()

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep />
      case "business-info":
        return <BusinessInfoStep />
      case "payment-details":
        return <PaymentDetailsStep />
      case "complete":
        return <CompleteStep />
      default:
        return <WelcomeStep />
    }
  }

  return (
    <Card className="w-full max-w-4xl shadow-lg rounded-xl overflow-hidden">
      <OnboardingProgress />
      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

