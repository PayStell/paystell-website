"use client"

import type React from "react"

import { useOnboarding, type OnboardingStep } from "./onboarding-context"
import { Check, Store, CreditCard, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function OnboardingProgress() {
  const { currentStep, setCurrentStep, isStepComplete } = useOnboarding()

  const steps: { id: OnboardingStep; label: string; icon: React.ReactNode; tooltip: string }[] = [
    {
      id: "welcome",
      label: "Welcome",
      icon: <Rocket className="h-5 w-5" />,
      tooltip: "Welcome to PayStell",
    },
    {
      id: "business-info",
      label: "Business",
      icon: <Store className="h-5 w-5" />,
      tooltip: "Enter your business information",
    },
    {
      id: "payment-details",
      label: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
      tooltip: "Configure your payment settings",
    },
    {
      id: "complete",
      label: "Complete",
      icon: <Check className="h-5 w-5" />,
      tooltip: "Complete your registration",
    },
  ]

  const handleStepClick = (step: OnboardingStep) => {
    // Only allow clicking on completed steps or the next available step
    const stepIndex = steps.findIndex((s) => s.id === step)
    const currentIndex = steps.findIndex((s) => s.id === currentStep)

    // Check if all previous steps are complete
    const canNavigate = steps.slice(0, stepIndex).every((s) => isStepComplete(s.id))

    if (canNavigate) {
      setCurrentStep(step)
    }
  }

  return (
    <TooltipProvider>
      <div className="bg-muted/30 px-6 py-4">
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted = isStepComplete(step.id)
            const isPrevious = steps.findIndex((s) => s.id === currentStep) > index

            return (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Line connector */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-4 h-[2px] w-[calc(100%+1.5rem)] left-6",
                      isCompleted || isPrevious ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className={cn(
                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted bg-background",
                      )}
                      aria-current={isActive ? "step" : undefined}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{step.tooltip}</TooltipContent>
                </Tooltip>

                <span className={cn("mt-2 text-xs font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}

