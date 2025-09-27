'use client';

import type React from 'react';

import { createContext, useContext } from 'react';
import { StepperProvider, useStepper, type StepConfig } from './useStepper';

interface ProgressContextType {
  progress: number;
  totalSteps: number;
  setProgress: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  getPercentage: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({
  children,
  initialStep = 0,
  steps = 5,
}: {
  children: React.ReactNode;
  initialStep?: number;
  steps?: number;
}) {
  // Create simple step configs for backward compatibility
  const stepConfigs: StepConfig[] = Array.from({ length: steps }, (_, index) => ({
    id: `step-${index}`,
    title: `Step ${index + 1}`,
    component: () => null, // Not used in legacy mode
  }));

  const initialStepId = `step-${initialStep}`;

  return (
    <StepperProvider steps={stepConfigs} initialStepId={initialStepId}>
      <ProgressProviderContent>
        {children}
      </ProgressProviderContent>
    </StepperProvider>
  );
}

function ProgressProviderContent({ children }: { children: React.ReactNode }) {
  const stepper = useStepper();

  const contextValue: ProgressContextType = {
    progress: stepper.currentStepIndex,
    totalSteps: stepper.totalSteps,
    setProgress: (step: number) => {
      if (step >= 0 && step < stepper.steps.length) {
        const stepId = stepper.steps[step].id;
        stepper.goToStep(stepId);
      }
    },
    nextStep: () => {
      stepper.nextStep();
    },
    prevStep: stepper.previousStep,
    goToStep: (step: number) => {
      if (step >= 0 && step < stepper.steps.length) {
        const stepId = stepper.steps[step].id;
        stepper.goToStep(stepId);
      }
    },
    getPercentage: stepper.getProgress,
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
