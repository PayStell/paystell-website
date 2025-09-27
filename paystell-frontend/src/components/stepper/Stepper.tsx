'use client';

import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStepper } from '@/hooks/useStepper';
import { cn } from '@/lib/utils';
import type { StepperProps } from '@/types/stepper';

export function Stepper({
  className,
  variant = 'default',
  size = 'md',
  showStepNumbers = true,
}: Omit<StepperProps, 'steps'>) {
  const {
    steps,
    currentStepIndex,
    stepStates,
    goToStep,
    isStepAccessible,
    isStepCompleted,
    getProgress,
  } = useStepper();

  // Size variants
  const sizeClasses = {
    sm: {
      circle: 'w-8 h-8',
      icon: 'h-4 w-4',
      text: 'text-xs',
      spacing: 'space-y-1',
    },
    md: {
      circle: 'w-10 h-10',
      icon: 'h-5 w-5',
      text: 'text-sm',
      spacing: 'space-y-2',
    },
    lg: {
      circle: 'w-12 h-12',
      icon: 'h-6 w-6',
      text: 'text-base',
      spacing: 'space-y-3',
    },
  };

  const currentSize = sizeClasses[size];

  // Animation variants
  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${((currentStepIndex) / (steps.length - 1)) * 100}%`,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const stepVariants = {
    inactive: { scale: 1 },
    active: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 },
    },
    completed: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 },
    },
  };

  const getStepStatus = (stepIndex: number, stepId: string) => {
    const stepState = stepStates[stepId];
    const isCompleted = isStepCompleted(stepId);
    const isActive = stepIndex === currentStepIndex;
    const isAccessible = isStepAccessible(stepId);

    return {
      isCompleted,
      isActive,
      isAccessible,
      hasError: stepState?.status === 'error',
    };
  };

  const getStepClasses = (status: ReturnType<typeof getStepStatus>) => {
    const baseClasses = `${currentSize.circle} rounded-full flex items-center justify-center border-2 transition-all duration-200`;

    if (status.hasError) {
      return `${baseClasses} bg-destructive border-destructive text-destructive-foreground`;
    }

    if (status.isCompleted) {
      return `${baseClasses} bg-primary border-primary text-primary-foreground`;
    }

    if (status.isActive) {
      return `${baseClasses} bg-primary border-primary text-primary-foreground`;
    }

    if (status.isAccessible) {
      return `${baseClasses} bg-background border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary cursor-pointer`;
    }

    return `${baseClasses} bg-muted border-muted text-muted-foreground`;
  };

  const getStepTextClasses = (status: ReturnType<typeof getStepStatus>) => {
    const baseClasses = `${currentSize.text} font-medium transition-colors duration-200`;

    if (status.hasError) {
      return `${baseClasses} text-destructive`;
    }

    if (status.isCompleted || status.isActive) {
      return `${baseClasses} text-primary`;
    }

    return `${baseClasses} text-muted-foreground`;
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('mb-6', className)}>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{Math.round(getProgress())}%</span>
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {steps[currentStepIndex] && (
          <div className="mt-3">
            <h3 className="font-semibold text-foreground">{steps[currentStepIndex].title}</h3>
            {steps[currentStepIndex].description && (
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStepIndex].description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('mb-8', className)}>
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-between relative w-full">
        {/* Progress line */}
        <div className={`absolute top-${parseInt(currentSize.circle.split(' ')[1]) / 2} left-0 w-full h-[2px] bg-muted`}>
          <motion.div
            className="h-full bg-primary"
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const status = getStepStatus(index, step.id);

          return (
            <div key={step.id} className={cn('flex flex-col items-center relative z-10', currentSize.spacing)}>
              <motion.div
                className={getStepClasses(status)}
                variants={stepVariants}
                initial="inactive"
                animate={status.isActive ? 'active' : status.isCompleted ? 'completed' : 'inactive'}
                onClick={() => status.isAccessible && goToStep(step.id)}
                role="button"
                tabIndex={status.isAccessible ? 0 : -1}
                aria-label={`Step ${index + 1}: ${step.title}`}
                aria-current={status.isActive ? 'step' : undefined}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && status.isAccessible) {
                    e.preventDefault();
                    goToStep(step.id);
                  }
                }}
              >
                {status.isCompleted ? (
                  <CheckCircle2 className={currentSize.icon} />
                ) : showStepNumbers ? (
                  <span className="font-semibold">{index + 1}</span>
                ) : null}
              </motion.div>

              <div className="text-center max-w-[120px]">
                <span className={getStepTextClasses(status)}>
                  {step.title}
                </span>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile stepper */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between">
          <span className={cn(currentSize.text, 'font-medium')}>
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className={cn(currentSize.text, 'font-medium text-muted-foreground')}>
            {steps[currentStepIndex]?.title}
          </span>
        </div>

        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {steps[currentStepIndex]?.description && (
          <p className="text-sm text-muted-foreground">
            {steps[currentStepIndex].description}
          </p>
        )}
      </div>
    </div>
  );
}