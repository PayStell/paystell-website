'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useStepper } from '@/hooks/useStepper';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface StepNavigationProps {
  className?: string;
  showBackButton?: boolean;
  showNextButton?: boolean;
  showSkipButton?: boolean;
  backLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  completeLabel?: string;
  loadingLabel?: string;
  onCustomAction?: () => void | Promise<void>;
  customActionLabel?: string;
  customActionVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  align?: 'left' | 'right' | 'center' | 'between';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export function StepNavigation({
  className,
  showBackButton = true,
  showNextButton = true,
  showSkipButton = false,
  backLabel = 'Back',
  nextLabel = 'Next',
  skipLabel = 'Skip',
  completeLabel = 'Complete',
  loadingLabel = 'Processing...',
  onCustomAction,
  customActionLabel,
  customActionVariant = 'outline',
  align = 'between',
  size = 'default',
  disabled = false,
  loading = false,
}: StepNavigationProps) {
  const {
    canGoNext,
    canGoPrevious,
    nextStep,
    previousStep,
    currentStep,
    currentStepIndex,
    totalSteps,
    stepStates,
    validateCurrentStep,
  } = useStepper();

  const [isNavigating, setIsNavigating] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);

  const currentStepState = currentStep ? stepStates[currentStep.id] : null;
  const isStepLoading = currentStepState?.status === 'in_progress' || loading;
  const canSkip = currentStep?.canSkip && showSkipButton;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNext = async () => {
    if (disabled || isNavigating || isValidating) return;

    setIsNavigating(true);
    try {
      const success = await nextStep();
      if (!success && canSkip) {
        // If validation failed but step can be skipped, allow user to choose
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handlePrevious = () => {
    if (disabled || isNavigating || !canGoPrevious) return;
    previousStep();
  };

  const handleSkip = async () => {
    if (disabled || isNavigating || !canSkip) return;

    setIsNavigating(true);
    try {
      await nextStep();
    } catch (error) {
      console.error('Skip error:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleValidate = async () => {
    if (!currentStep || isValidating) return;

    setIsValidating(true);
    try {
      await validateCurrentStep();
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCustomAction = async () => {
    if (!onCustomAction || disabled || isNavigating) return;

    setIsNavigating(true);
    try {
      await onCustomAction();
    } catch (error) {
      console.error('Custom action error:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const getAlignmentClasses = () => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      case 'center':
        return 'justify-center';
      case 'between':
      default:
        return 'justify-between';
    }
  };

  const renderBackButton = () => {
    if (!showBackButton || !canGoPrevious) {
      return align === 'between' ? <div /> : null;
    }

    return (
      <Button
        variant="outline"
        size={size}
        onClick={handlePrevious}
        disabled={disabled || isNavigating || isStepLoading}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        {backLabel}
      </Button>
    );
  };

  const renderNextButton = () => {
    if (!showNextButton) return null;

    const isDisabled = disabled || isNavigating || isStepLoading || (!canGoNext && !isLastStep);
    const showLoading = isNavigating || isStepLoading;
    const buttonLabel = showLoading
      ? loadingLabel
      : isLastStep
        ? completeLabel
        : nextLabel;

    return (
      <Button
        size={size}
        onClick={handleNext}
        disabled={isDisabled}
        className="gap-2"
      >
        {showLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : !isLastStep ? (
          <>
            {buttonLabel}
            <ChevronRight className="h-4 w-4" />
          </>
        ) : (
          buttonLabel
        )}
      </Button>
    );
  };

  const renderSkipButton = () => {
    if (!canSkip) return null;

    return (
      <Button
        variant="ghost"
        size={size}
        onClick={handleSkip}
        disabled={disabled || isNavigating || isStepLoading}
        className="gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        {skipLabel}
      </Button>
    );
  };

  const renderCustomAction = () => {
    if (!onCustomAction || !customActionLabel) return null;

    return (
      <Button
        variant={customActionVariant}
        size={size}
        onClick={handleCustomAction}
        disabled={disabled || isNavigating || isStepLoading}
      >
        {customActionLabel}
      </Button>
    );
  };

  const renderValidateButton = () => {
    if (!currentStep?.validate) return null;

    return (
      <Button
        variant="secondary"
        size={size}
        onClick={handleValidate}
        disabled={disabled || isValidating || isStepLoading}
        className="gap-2"
      >
        {isValidating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
        Validate
      </Button>
    );
  };

  return (
    <div className={cn('flex items-center gap-3 pt-6', getAlignmentClasses(), className)}>
      {renderBackButton()}

      <div className="flex items-center gap-2">
        {renderSkipButton()}
        {renderCustomAction()}
        {renderValidateButton()}
        {renderNextButton()}
      </div>
    </div>
  );
}

interface StepNavigationGroupProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export function StepNavigationGroup({
  children,
  className,
  spacing = 'md',
}: StepNavigationGroupProps) {
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  return (
    <div className={cn('flex items-center', spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}

interface CustomStepButtonProps {
  children: React.ReactNode;
  onClick: () => void | Promise<void>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function CustomStepButton({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  className,
}: CustomStepButtonProps) {
  const { stepStates, currentStep } = useStepper();
  const [isLoading, setIsLoading] = React.useState(false);

  const currentStepState = currentStep ? stepStates[currentStep.id] : null;
  const isStepLoading = currentStepState?.status === 'in_progress' || loading;

  const handleClick = async () => {
    if (disabled || isLoading || isStepLoading) return;

    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error('Custom button error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || isLoading || isStepLoading}
      className={cn('gap-2', className)}
    >
      {(isLoading || isStepLoading) && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      {children}
    </Button>
  );
}