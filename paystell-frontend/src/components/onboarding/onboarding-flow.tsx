'use client';

import { useState } from 'react';
import { WelcomeStep } from './steps/WelcomeStep';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BusinessDetailsStep } from './steps/BusinessDetailsStep';
import { PaymentDetailsStep } from './steps/PaymentDetailsStep';
import { SuccessStep } from './steps/SuccessStep';
import { Progress } from '../progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProgressProvider, useProgress } from '@/hooks/use-progress';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';

const TOTAL_STEPS = 5;

export function OnboardingFlow() {
  return (
    <ProgressProvider initialStep={0} steps={TOTAL_STEPS}>
      <OnboardingFlowContent />
      <Toaster />
    </ProgressProvider>
  );
}

function OnboardingFlowContent() {
  const { progress, prevStep } = useProgress();
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    businessType: '',
    businessCategory: '',
    country: '',
    address: '',
    taxId: '',
    stellarAddress: '',
    acceptTerms: false,
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (progress) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <BusinessDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PaymentDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <SuccessStep formData={formData} />;
      default:
        return <WelcomeStep />;
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {progress > 0 && progress < TOTAL_STEPS + 1 && <Progress />}

      <Card className="w-full shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          {progress > 0 && progress < TOTAL_STEPS + 1 && (
            <div className="p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                className="flex items-center text-muted-foreground transition-all hover:text-primary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={progress}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="p-6"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
