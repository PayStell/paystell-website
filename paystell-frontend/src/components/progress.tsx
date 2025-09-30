'use client';

import { CheckCircle2 } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';
import { motion, Variants } from 'framer-motion';

export function Progress() {
  const { progress, totalSteps, goToStep, getPercentage } = useProgress();

  const steps = ['Basic Information', 'Business Details', 'Payment Setup', 'Complete'];

  // Animation variants
  const progressVariants: Variants = {
    initial: { width: 0 },
    animate: {
      width: `${getPercentage()}%`,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  const stepVariants: Variants = {
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

  return (
    <div className="mb-8">
      <div className="hidden md:flex items-center justify-between relative w-full">
        <div className="absolute top-5 left-0 w-full h-[2px] bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((progress - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          />
        </div>
        {steps.map((step, index) => {
          const isCompleted = index < progress;
          const isActive = index === progress - 1;
          const isClickable = index < progress;

          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2 border-primary ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
                variants={stepVariants}
                initial="inactive"
                animate={isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}
                onClick={() => isClickable && goToStep(index + 1)}
              >
                {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <span>{index + 1}</span>}
              </motion.div>
              <span
                className={`text-xs mt-2 font-medium ${index < progress ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile progress indicator */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {progress} of {totalSteps}
          </span>
          <span className="text-sm font-medium">{steps[progress - 1]}</span>
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <motion.div
            className="bg-primary h-full rounded-full"
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />
        </div>
      </div>
    </div>
  );
}
