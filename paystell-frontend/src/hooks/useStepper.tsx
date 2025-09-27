'use client';

import type React from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'error';

export interface StepConfig<TFormData extends FieldValues = FieldValues> {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<unknown>;
  validate?: (formData: TFormData, formMethods?: UseFormReturn<TFormData>) => Promise<boolean> | boolean;
  canSkip?: boolean;
  isOptional?: boolean;
  metadata?: Record<string, unknown>;
  shouldShow?: (formData: TFormData, completedSteps: string[]) => boolean;
}

export interface StepState {
  id: string;
  status: StepStatus;
  error?: string;
  data?: unknown;
  completedAt?: Date;
}

interface StepperContextType<TFormData extends FieldValues = FieldValues> {
  // Core state
  steps: StepConfig<TFormData>[];
  currentStepIndex: number;
  currentStep: StepConfig<TFormData> | null;
  stepStates: Record<string, StepState>;

  // Navigation
  canGoNext: boolean;
  canGoPrevious: boolean;
  nextStep: () => Promise<boolean>;
  previousStep: () => void;
  goToStep: (stepId: string) => boolean;

  // Step management
  updateStepStatus: (stepId: string, status: StepStatus, error?: string) => void;
  updateStepData: (stepId: string, data: unknown) => void;
  validateCurrentStep: () => Promise<boolean>;

  // Progress tracking
  totalSteps: number;
  completedSteps: string[];
  getProgress: () => number;
  isStepCompleted: (stepId: string) => boolean;
  isStepAccessible: (stepId: string) => boolean;

  // Form integration
  formMethods?: UseFormReturn<TFormData>;
  setFormMethods: (methods: UseFormReturn<TFormData>) => void;
}

const StepperContext = createContext<StepperContextType<FieldValues> | undefined>(undefined);

export interface StepperProviderProps<TFormData extends FieldValues = FieldValues> {
  children: React.ReactNode;
  steps: StepConfig<TFormData>[];
  initialStepId?: string;
  onStepChange?: (currentStep: StepConfig<TFormData>, previousStep: StepConfig<TFormData> | null) => void;
  onComplete?: (formData: TFormData) => void;
  formData?: TFormData;
}

export function StepperProvider<TFormData extends FieldValues = FieldValues>({
  children,
  steps,
  initialStepId,
  onStepChange,
  onComplete,
  formData,
}: StepperProviderProps<TFormData>) {
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (initialStepId) {
      const index = steps.findIndex(step => step.id === initialStepId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  const [stepStates, setStepStates] = useState<Record<string, StepState>>(() => {
    const initialStates: Record<string, StepState> = {};
    steps.forEach((step, index) => {
      initialStates[step.id] = {
        id: step.id,
        status: index === currentStepIndex ? 'in_progress' : 'pending',
      };
    });
    return initialStates;
  });

  const [formMethods, setFormMethods] = useState<UseFormReturn<TFormData>>();

  // Filter visible steps based on conditions
  const visibleSteps = useMemo(() => {
    if (!formData) return steps;

    const completedStepIds = Object.keys(stepStates).filter(stepId =>
      stepStates[stepId].status === 'completed'
    );

    return steps.filter(step =>
      !step.shouldShow || step.shouldShow(formData, completedStepIds)
    );
  }, [steps, formData, stepStates]);

  const currentStep = visibleSteps[currentStepIndex] || null;
  const totalSteps = visibleSteps.length;

  const updateStepStatus = useCallback((stepId: string, status: StepStatus, error?: string) => {
    setStepStates(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        status,
        error,
        completedAt: status === 'completed' ? new Date() : prev[stepId]?.completedAt,
      },
    }));
  }, []);

  const updateStepData = useCallback((stepId: string, data: unknown) => {
    setStepStates(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        data,
      },
    }));
  }, []);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (!currentStep || !formData) return true;

    try {
      updateStepStatus(currentStep.id, 'in_progress');

      if (currentStep.validate) {
        const isValid = await currentStep.validate(formData, formMethods);
        if (!isValid) {
          updateStepStatus(currentStep.id, 'error', 'Validation failed');
          return false;
        }
      }

      // If form methods are available, trigger form validation
      if (formMethods) {
        const isFormValid = await formMethods.trigger();
        if (!isFormValid) {
          updateStepStatus(currentStep.id, 'error', 'Form validation failed');
          return false;
        }
      }

      updateStepStatus(currentStep.id, 'completed');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStepStatus(currentStep.id, 'error', errorMessage);
      return false;
    }
  }, [currentStep, formData, formMethods, updateStepStatus]);

  const nextStep = useCallback(async (): Promise<boolean> => {
    if (!currentStep) return false;

    // Validate current step before proceeding
    const isValid = await validateCurrentStep();
    if (!isValid && !currentStep.canSkip) {
      return false;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < totalSteps) {
      const previousStep = currentStep;
      setCurrentStepIndex(nextIndex);

      // Update next step status to in_progress
      const nextStepId = visibleSteps[nextIndex].id;
      updateStepStatus(nextStepId, 'in_progress');

      // Trigger callback
      if (onStepChange) {
        onStepChange(visibleSteps[nextIndex], previousStep);
      }

      // Scroll to top
      window.scrollTo(0, 0);
      return true;
    } else if (nextIndex === totalSteps && onComplete && formData) {
      // All steps completed
      onComplete(formData);
      return true;
    }

    return false;
  }, [currentStep, currentStepIndex, totalSteps, visibleSteps, validateCurrentStep, updateStepStatus, onStepChange, onComplete, formData]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const previousStep = currentStep;
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);

      // Update step statuses
      if (currentStep) {
        updateStepStatus(currentStep.id, 'pending');
      }
      updateStepStatus(visibleSteps[newIndex].id, 'in_progress');

      // Trigger callback
      if (onStepChange) {
        onStepChange(visibleSteps[newIndex], previousStep);
      }

      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, [currentStepIndex, currentStep, visibleSteps, updateStepStatus, onStepChange]);

  const isStepAccessible = useCallback((stepId: string): boolean => {
    const stepIndex = visibleSteps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return false;

    // Current step is always accessible
    if (stepIndex === currentStepIndex) return true;

    // Previous steps are accessible if they exist
    if (stepIndex < currentStepIndex) return true;

    // Next steps are accessible only if all previous steps are completed or skippable
    for (let i = 0; i < stepIndex; i++) {
      const step = visibleSteps[i];
      const stepState = stepStates[step.id];
      if (stepState.status !== 'completed' && !step.canSkip) {
        return false;
      }
    }

    return true;
  }, [visibleSteps, currentStepIndex, stepStates]);

  const goToStep = useCallback((stepId: string): boolean => {
    const stepIndex = visibleSteps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return false;

    // Check if step is accessible
    const isAccessible = isStepAccessible(stepId);
    if (!isAccessible) return false;

    const previousStep = currentStep;
    setCurrentStepIndex(stepIndex);

    // Update step statuses
    if (currentStep) {
      updateStepStatus(currentStep.id, 'pending');
    }
    updateStepStatus(stepId, 'in_progress');

    // Trigger callback
    if (onStepChange && previousStep) {
      onStepChange(visibleSteps[stepIndex], previousStep);
    }

    // Scroll to top
    window.scrollTo(0, 0);
    return true;
  }, [visibleSteps, currentStep, updateStepStatus, onStepChange, isStepAccessible]);

  const completedSteps = useMemo(() => {
    return Object.keys(stepStates).filter(stepId =>
      stepStates[stepId].status === 'completed'
    );
  }, [stepStates]);

  const isStepCompleted = useCallback((stepId: string): boolean => {
    return stepStates[stepId]?.status === 'completed';
  }, [stepStates]);

  const canGoNext = useMemo(() => {
    return currentStepIndex < totalSteps - 1;
  }, [currentStepIndex, totalSteps]);

  const canGoPrevious = useMemo(() => {
    return currentStepIndex > 0;
  }, [currentStepIndex]);

  const getProgress = useCallback((): number => {
    if (totalSteps === 0) return 0;
    return (completedSteps.length / totalSteps) * 100;
  }, [completedSteps.length, totalSteps]);

  const contextValue: StepperContextType<TFormData> = {
    steps: visibleSteps,
    currentStepIndex,
    currentStep,
    stepStates,
    canGoNext,
    canGoPrevious,
    nextStep,
    previousStep,
    goToStep,
    updateStepStatus,
    updateStepData,
    validateCurrentStep,
    totalSteps,
    completedSteps,
    getProgress,
    isStepCompleted,
    isStepAccessible,
    formMethods,
    setFormMethods,
  };

  return (
    <StepperContext.Provider value={contextValue as unknown as StepperContextType<FieldValues>}>
      {children}
    </StepperContext.Provider>
  );
}

export function useStepper<TFormData extends FieldValues = FieldValues>(): StepperContextType<TFormData> {
  const context = useContext(StepperContext);
  if (context === undefined) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context as unknown as StepperContextType<TFormData>;
}

// Backward compatibility with useProgress
export function useProgress() {
  const stepper = useStepper();

  return {
    progress: stepper.currentStepIndex,
    totalSteps: stepper.totalSteps,
    setProgress: (step: number) => {
      if (step >= 0 && step < stepper.steps.length) {
        const stepId = stepper.steps[step].id;
        stepper.goToStep(stepId);
      }
    },
    nextStep: () => stepper.nextStep(),
    prevStep: stepper.previousStep,
    goToStep: (step: number) => {
      if (step >= 0 && step < stepper.steps.length) {
        const stepId = stepper.steps[step].id;
        return stepper.goToStep(stepId);
      }
      return false;
    },
    getPercentage: stepper.getProgress,
  };
}