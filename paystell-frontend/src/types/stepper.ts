import type React from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Represents the possible states of a step in the stepper workflow
 */
export enum StepState {
  /** Step is waiting to be started */
  PENDING = 'pending',
  /** Step is currently active and being processed */
  IN_PROGRESS = 'in_progress',
  /** Step has been successfully completed */
  COMPLETED = 'completed',
  /** Step encountered an error during processing */
  ERROR = 'error',
}

/**
 * Type alias for step status values
 */
export type StepStatus = `${StepState}`;

/**
 * Interface representing the internal state of a step
 */
export interface StepStateData {
  /** Unique identifier for the step */
  id: string;
  /** Current status of the step */
  status: StepStatus;
  /** Error message if the step failed */
  error?: string;
  /** Custom data associated with this step */
  data?: unknown;
  /** Timestamp when the step was completed */
  completedAt?: Date;
}

/**
 * Configuration interface for defining a step in the stepper workflow
 * @template TFormData - Type of form data this step will work with
 */
export interface StepConfig<TFormData extends FieldValues = FieldValues> {
  /** Unique identifier for the step */
  id: string;

  /** Display title for the step */
  title: string;

  /** Optional description providing more details about the step */
  description?: string;

  /** React component to render for this step */
  component: React.ComponentType<unknown>;

  /**
   * Custom validation function for the step
   * @param formData - Current form data
   * @param formMethods - React Hook Form methods if available
   * @returns Promise or boolean indicating if validation passed
   */
  validate?: (formData: TFormData, formMethods?: UseFormReturn<TFormData>) => Promise<boolean> | boolean;

  /** Whether this step can be skipped if validation fails */
  canSkip?: boolean;

  /** Whether this step is optional in the workflow */
  isOptional?: boolean;

  /** Custom metadata for the step */
  metadata?: Record<string, unknown>;

  /**
   * Function to determine if this step should be shown
   * @param formData - Current form data
   * @param completedSteps - Array of completed step IDs
   * @returns Whether this step should be visible
   */
  shouldShow?: (formData: TFormData, completedSteps: string[]) => boolean;

  /** Icon to display for this step (optional) */
  icon?: React.ComponentType<{ className?: string }>;

  /** Estimated duration for this step in minutes (for progress indication) */
  estimatedDuration?: number;
}

/**
 * Props interface for the main Stepper component
 * @template TFormData - Type of form data the stepper will manage
 */
export interface StepperProps<TFormData extends FieldValues = FieldValues> {
  /** Array of step configurations */
  steps?: StepConfig<TFormData>[];

  /** ID of the initial step to start with */
  initialStepId?: string;

  /** Callback triggered when the current step changes */
  onStepChange?: (currentStep: StepConfig<TFormData>, previousStep: StepConfig<TFormData> | null) => void;

  /** Callback triggered when all steps are completed */
  onComplete?: (formData: TFormData) => void;

  /** Current form data */
  formData?: TFormData;

  /** Whether to show a progress indicator */
  showProgress?: boolean;

  /** Whether to allow navigation to previous steps */
  allowBackNavigation?: boolean;

  /** Whether to show step numbers */
  showStepNumbers?: boolean;

  /** Custom CSS classes for styling */
  className?: string;

  /** Theme variant for the stepper */
  variant?: 'default' | 'minimal' | 'card';

  /** Size variant for the stepper */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Interface for transaction-specific step data
 * Used for wallet transaction flows like withdraw, deposit, etc.
 */
export interface TransactionStepData {
  /** Type of transaction being performed */
  transactionType: 'withdraw' | 'deposit' | 'transfer' | 'swap';

  /** Transaction amount in the base currency */
  amount?: string;

  /** Currency code (e.g., 'USD', 'XLM', 'USDC') */
  currency?: string;

  /** Source wallet address or identifier */
  sourceWallet?: string;

  /** Destination wallet address or identifier */
  destinationWallet?: string;

  /** Transaction fee information */
  fee?: {
    /** Fee amount */
    amount: string;
    /** Fee currency */
    currency: string;
    /** Fee type description */
    type: 'network' | 'service' | 'gas';
  };

  /** Network or blockchain being used */
  network?: 'stellar' | 'ethereum' | 'bitcoin';

  /** Transaction memo or note */
  memo?: string;

  /** Estimated transaction time in seconds */
  estimatedTime?: number;

  /** Current transaction status */
  status?: 'pending' | 'confirming' | 'confirmed' | 'failed';

  /** Transaction hash or ID once submitted */
  transactionHash?: string;

  /** Number of network confirmations */
  confirmations?: number;

  /** Required number of confirmations */
  requiredConfirmations?: number;

  /** Additional metadata specific to the transaction type */
  metadata?: Record<string, unknown>;
}

/**
 * Extended step configuration specifically for transaction flows
 */
export interface TransactionStepConfig extends StepConfig<TransactionStepData> {
  /** Transaction-specific metadata */
  transactionMeta?: {
    /** Whether this step requires wallet connection */
    requiresWalletConnection?: boolean;
    /** Whether this step requires user signature */
    requiresSignature?: boolean;
    /** Whether this step involves network fees */
    hasNetworkFees?: boolean;
    /** Minimum balance required for this step */
    minimumBalance?: string;
  };
}

/**
 * Navigation context for stepper components
 */
export interface StepperNavigation {
  /** Whether user can proceed to next step */
  canGoNext: boolean;

  /** Whether user can go back to previous step */
  canGoPrevious: boolean;

  /** Function to navigate to next step */
  nextStep: () => Promise<boolean>;

  /** Function to navigate to previous step */
  previousStep: () => void;

  /** Function to navigate to a specific step by ID */
  goToStep: (stepId: string) => boolean;

  /** Get current progress percentage */
  getProgress: () => number;

  /** Check if a specific step is completed */
  isStepCompleted: (stepId: string) => boolean;

  /** Check if a specific step is accessible */
  isStepAccessible: (stepId: string) => boolean;
}

/**
 * Hook return type for useStepper
 * @template TFormData - Type of form data being managed
 */
export interface StepperHookReturn<TFormData extends FieldValues = FieldValues> extends StepperNavigation {
  /** Array of configured steps */
  steps: StepConfig<TFormData>[];

  /** Current step index */
  currentStepIndex: number;

  /** Current step configuration */
  currentStep: StepConfig<TFormData> | null;

  /** State data for all steps */
  stepStates: Record<string, StepStateData>;

  /** Total number of steps */
  totalSteps: number;

  /** Array of completed step IDs */
  completedSteps: string[];

  /** Update the status of a specific step */
  updateStepStatus: (stepId: string, status: StepStatus, error?: string) => void;

  /** Update custom data for a specific step */
  updateStepData: (stepId: string, data: unknown) => void;

  /** Validate the current step */
  validateCurrentStep: () => Promise<boolean>;

  /** React Hook Form methods if available */
  formMethods?: UseFormReturn<TFormData>;

  /** Set React Hook Form methods */
  setFormMethods: (methods: UseFormReturn<TFormData>) => void;
}

/**
 * Common props for step components
 * @template TFormData - Type of form data for this step
 */
export interface StepComponentProps<TFormData extends FieldValues = FieldValues> {
  /** Current form data */
  formData?: TFormData;

  /** Function to update form data */
  updateFormData?: (data: Partial<TFormData>) => void;

  /** Navigation methods */
  navigation: StepperNavigation;

  /** Current step configuration */
  stepConfig: StepConfig<TFormData>;

  /** React Hook Form methods if available */
  formMethods?: UseFormReturn<TFormData>;
}