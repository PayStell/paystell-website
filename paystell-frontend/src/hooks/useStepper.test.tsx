/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { StepperProvider, useStepper } from './useStepper';
import type { StepConfig } from '@/types/stepper';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

// Mock components for testing
const MockComponent = () => <div>Mock Step Component</div>;

// Sample step configurations for testing
const mockSteps: StepConfig[] = [
  {
    id: 'step1',
    title: 'Step 1',
    description: 'First step',
    component: MockComponent,
    validate: jest.fn().mockResolvedValue(true),
  },
  {
    id: 'step2',
    title: 'Step 2',
    description: 'Second step',
    component: MockComponent,
    canSkip: true,
  },
  {
    id: 'step3',
    title: 'Step 3',
    description: 'Final step',
    component: MockComponent,
    validate: jest.fn().mockResolvedValue(false),
  },
];

const mockStepsWithConditions: StepConfig[] = [
  {
    id: 'step1',
    title: 'Step 1',
    component: MockComponent,
  },
  {
    id: 'step2',
    title: 'Step 2',
    component: MockComponent,
    shouldShow: (formData) => formData.showStep2 === true,
  },
  {
    id: 'step3',
    title: 'Step 3',
    component: MockComponent,
  },
];

const createWrapper = (
  steps: StepConfig[] = mockSteps,
  props: Partial<React.ComponentProps<typeof StepperProvider>> = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <StepperProvider steps={steps} {...props}>
      {children}
    </StepperProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('useStepper', () => {
  describe('Initial State', () => {
    it('should initialize with first step active', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.currentStep?.id).toBe('step1');
      expect(result.current.totalSteps).toBe(3);
      expect(result.current.canGoPrevious).toBe(false);
      expect(result.current.canGoNext).toBe(true);
    });

    it('should initialize with specified initial step', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockSteps, { initialStepId: 'step2' }),
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.currentStep?.id).toBe('step2');
    });

    it('should initialize step states correctly', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      const { stepStates } = result.current;
      expect(stepStates['step1'].status).toBe('in_progress');
      expect(stepStates['step2'].status).toBe('pending');
      expect(stepStates['step3'].status).toBe('pending');
    });
  });

  describe('Navigation', () => {
    it('should navigate to next step successfully', async () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const success = await result.current.nextStep();
        expect(success).toBe(true);
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.currentStep?.id).toBe('step2');
    });

    it('should navigate to previous step', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockSteps, { initialStepId: 'step2' }),
      });

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.currentStep?.id).toBe('step1');
    });

    it('should not go to previous step from first step', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      expect(result.current.canGoPrevious).toBe(false);

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStepIndex).toBe(0);
    });

    it('should navigate to specific step by ID', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      act(() => {
        const success = result.current.goToStep('step3');
        expect(success).toBe(true);
      });

      expect(result.current.currentStepIndex).toBe(2);
      expect(result.current.currentStep?.id).toBe('step3');
    });

    it('should fail to navigate to non-existent step', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      act(() => {
        const success = result.current.goToStep('nonexistent');
        expect(success).toBe(false);
      });

      expect(result.current.currentStepIndex).toBe(0);
    });
  });

  describe('Step Validation', () => {
    it('should validate step successfully', async () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const isValid = await result.current.validateCurrentStep();
        expect(isValid).toBe(true);
      });

      expect(mockSteps[0].validate).toHaveBeenCalled();
    });

    it('should handle validation failure', async () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockSteps, { initialStepId: 'step3' }),
      });

      await act(async () => {
        const isValid = await result.current.validateCurrentStep();
        expect(isValid).toBe(false);
      });

      expect(result.current.stepStates['step3'].status).toBe('error');
    });

    it('should allow skipping step with validation failure', async () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockSteps, { initialStepId: 'step2' }),
      });

      // Step 2 has canSkip: true
      expect(result.current.currentStep?.canSkip).toBe(true);

      await act(async () => {
        const success = await result.current.nextStep();
        expect(success).toBe(true);
      });

      expect(result.current.currentStepIndex).toBe(2);
    });
  });

  describe('Step State Management', () => {
    it('should update step status', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.updateStepStatus('step1', 'completed');
      });

      expect(result.current.stepStates['step1'].status).toBe('completed');
      expect(result.current.stepStates['step1'].completedAt).toBeInstanceOf(Date);
    });

    it('should update step data', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      const testData = { key: 'value' };

      act(() => {
        result.current.updateStepData('step1', testData);
      });

      expect(result.current.stepStates['step1'].data).toEqual(testData);
    });

    it('should track completed steps', async () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.nextStep(); // Complete step1, move to step2
      });

      expect(result.current.completedSteps).toContain('step1');
      expect(result.current.isStepCompleted('step1')).toBe(true);
      expect(result.current.isStepCompleted('step2')).toBe(false);
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress correctly', async () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      // Initially no steps completed
      expect(result.current.getProgress()).toBe(0);

      // Complete first step
      await act(async () => {
        await result.current.nextStep();
      });

      expect(result.current.getProgress()).toBeCloseTo(33.33, 1); // 1/3 * 100
    });
  });

  describe('Step Accessibility', () => {
    it('should determine step accessibility correctly', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      // Current step should be accessible
      expect(result.current.isStepAccessible('step1')).toBe(true);

      // Future steps should not be accessible initially
      expect(result.current.isStepAccessible('step2')).toBe(false);
      expect(result.current.isStepAccessible('step3')).toBe(false);
    });

    it('should make previous steps accessible', async () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.nextStep(); // Move to step2
      });

      // Previous step should now be accessible
      expect(result.current.isStepAccessible('step1')).toBe(true);
      expect(result.current.isStepAccessible('step2')).toBe(true);
    });
  });

  describe('Conditional Steps', () => {
    it('should filter steps based on conditions', () => {
      const formData = { showStep2: false };

      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockStepsWithConditions, { formData }),
      });

      // Step 2 should be filtered out
      expect(result.current.totalSteps).toBe(2);
      expect(result.current.steps.map((s: StepConfig) => s.id)).toEqual(['step1', 'step3']);
    });

    it('should include conditional steps when condition is met', () => {
      const formData = { showStep2: true };

      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockStepsWithConditions, { formData }),
      });

      // All steps should be included
      expect(result.current.totalSteps).toBe(3);
      expect(result.current.steps.map((s: StepConfig) => s.id)).toEqual([
        'step1',
        'step2',
        'step3',
      ]);
    });
  });

  describe('Callbacks', () => {
    it('should call onStepChange when navigating', async () => {
      const onStepChange = jest.fn();

      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockSteps, { onStepChange }),
      });

      await act(async () => {
        await result.current.nextStep();
      });

      expect(onStepChange).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'step2' }),
        expect.objectContaining({ id: 'step1' }),
      );
    });

    it('should call onComplete when reaching end', async () => {
      const onComplete = jest.fn();
      const formData = { test: 'data' };

      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockSteps, { onComplete, formData }),
      });

      // Navigate to last step
      await act(async () => {
        await result.current.nextStep(); // step1 -> step2
        await result.current.nextStep(); // step2 -> step3
      });

      // Try to go beyond last step
      await act(async () => {
        await result.current.nextStep(); // should trigger onComplete
      });

      expect(onComplete).toHaveBeenCalledWith(formData);
    });
  });

  describe('Form Integration', () => {
    it('should store and retrieve form methods', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(),
      });

      const mockFormMethods = {} as UseFormReturn<FieldValues>;

      act(() => {
        result.current.setFormMethods(mockFormMethods);
      });

      expect(result.current.formMethods).toBe(mockFormMethods);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      const mockStepWithError: StepConfig[] = [
        {
          id: 'step1',
          title: 'Step 1',
          component: MockComponent,
          validate: jest.fn().mockRejectedValue(new Error('Validation failed')),
        },
      ];

      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(mockStepWithError),
      });

      await act(async () => {
        const isValid = await result.current.validateCurrentStep();
        expect(isValid).toBe(false);
      });

      expect(result.current.stepStates['step1'].status).toBe('error');
      expect(result.current.stepStates['step1'].error).toBe('Validation failed');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty steps array', () => {
      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper([]),
      });

      expect(result.current.totalSteps).toBe(0);
      expect(result.current.currentStep).toBe(null);
      expect(result.current.canGoNext).toBe(false);
      expect(result.current.canGoPrevious).toBe(false);
    });

    it('should handle single step', () => {
      const singleStep = [mockSteps[0]];

      const { result } = renderHook(() => useStepper(), {
        wrapper: createWrapper(singleStep),
      });

      expect(result.current.totalSteps).toBe(1);
      expect(result.current.canGoNext).toBe(false);
      expect(result.current.canGoPrevious).toBe(false);
    });
  });
});
