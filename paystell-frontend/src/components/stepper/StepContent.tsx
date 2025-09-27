'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStepper } from '@/hooks/useStepper';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface StepContentProps {
  children?: React.ReactNode;
  className?: string;
  showError?: boolean;
  showLoading?: boolean;
  customError?: string;
  loadingText?: string;
}

const contentVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const errorVariants = {
  initial: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

const loadingVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

export function StepContent({
  children,
  className,
  showError = true,
  showLoading = true,
  customError,
  loadingText = 'Loading...',
}: StepContentProps) {
  const { currentStep, stepStates, currentStepIndex } = useStepper();

  if (!currentStep) {
    return null;
  }

  const stepState = stepStates[currentStep.id];
  const hasError = stepState?.status === 'error';
  const isLoading = stepState?.status === 'in_progress' && !children;
  const errorMessage = customError || stepState?.error;

  const StepComponent = currentStep.component;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Error Alert */}
      <AnimatePresence mode="wait">
        {hasError && showError && errorMessage && (
          <motion.div
            key="error"
            variants={errorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {isLoading && showLoading && (
          <motion.div
            key="loading"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center justify-center py-8"
          >
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">{loadingText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={`step-${currentStepIndex}`}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-[200px]"
          >
            {children || (
              <div className="space-y-4">
                {/* Step Header */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {currentStep.title}
                  </h2>
                  {currentStep.description && (
                    <p className="text-muted-foreground">
                      {currentStep.description}
                    </p>
                  )}
                </div>

                {/* Render step component */}
                <div className="pt-4">
                  <StepComponent />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StepLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerClassName?: string;
}

export function StepLayout({
  children,
  className,
  title,
  description,
  headerClassName,
}: StepLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description) && (
        <div className={cn('space-y-2', headerClassName)}>
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface StepSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  required?: boolean;
}

export function StepSection({
  children,
  className,
  title,
  description,
  required = false,
}: StepSectionProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-medium">
              {title}
              {required && <span className="text-destructive ml-1">*</span>}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}