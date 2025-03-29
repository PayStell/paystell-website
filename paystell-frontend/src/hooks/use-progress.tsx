"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface ProgressContextType {
  progress: number
  totalSteps: number
  setProgress: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  getPercentage: () => number
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({
  children,
  initialStep = 0,
  steps = 5,
}: {
  children: React.ReactNode
  initialStep?: number
  steps?: number
}) {
  const [progress, setProgress] = useState(initialStep)
  const totalSteps = steps

  const nextStep = () => {
    if (progress < totalSteps) {
      setProgress(progress + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (progress > 0) {
      setProgress(progress - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step <= totalSteps) {
      setProgress(step)
      window.scrollTo(0, 0)
    }
  }

  const getPercentage = () => {
    return (progress / totalSteps) * 100
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        totalSteps,
        setProgress,
        nextStep,
        prevStep,
        goToStep,
        getPercentage,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}

