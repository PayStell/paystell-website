'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InfoTooltip } from '../InfoToolTip';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useProgress } from '@/hooks/use-progress';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BusinessDetailsStepProps {
  formData: {
    businessType: string;
    businessCategory: string;
    country: string;
    address: string;
    taxId: string;
  };
  updateFormData: (
    data: Partial<{
      businessType: string;
      businessCategory: string;
      country: string;
      address: string;
      taxId: string;
    }>,
  ) => void;
}

export function BusinessDetailsStep({ formData, updateFormData }: BusinessDetailsStepProps) {
  const { nextStep } = useProgress();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Limited Liability Company (LLC)',
    'Corporation',
    'Non-profit Organization',
  ];

  const businessCategories = [
    'Retail',
    'E-commerce',
    'Food & Beverage',
    'Technology',
    'Healthcare',
    'Education',
    'Financial Services',
    'Other',
  ];

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'Singapore',
    'Other',
  ];

  const validate = (field?: string) => {
    const newErrors: Record<string, string> = { ...errors };

    if (!field || field === 'businessType') {
      if (!formData.businessType) {
        newErrors.businessType = 'Business type is required';
      } else {
        delete newErrors.businessType;
      }
    }

    if (!field || field === 'businessCategory') {
      if (!formData.businessCategory) {
        newErrors.businessCategory = 'Business category is required';
      } else {
        delete newErrors.businessCategory;
      }
    }

    if (!field || field === 'country') {
      if (!formData.country) {
        newErrors.country = 'Country is required';
      } else {
        delete newErrors.country;
      }
    }

    if (!field || field === 'address') {
      if (!formData.address.trim()) {
        newErrors.address = 'Business address is required';
      } else if (formData.address.length < 10) {
        newErrors.address = 'Please enter a complete address';
      } else {
        delete newErrors.address;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validate(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      businessType: true,
      businessCategory: true,
      country: true,
      address: true,
      taxId: true,
    });

    if (validate()) {
      setIsSubmitting(true);

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Business details saved', {
          description: 'Your business details have been saved successfully.',
        });
        nextStep();
      } catch (error) {
        toast.error(`Error: ${error}`, {
          description: 'There was a problem saving your business details. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Validation Error', {
        description: 'Please correct the errors in the form.',
      });
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Business Details</h2>
        <p className="text-muted-foreground">
          Tell us more about your business to help us customize your payment experience.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={formVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="businessType">Business Type</Label>
            <InfoTooltip content="The legal structure of your business" />
          </div>
          <Select
            value={formData.businessType}
            onValueChange={(value) => {
              updateFormData({ businessType: value });
              if (touched.businessType) validate('businessType');
            }}
            onOpenChange={() =>
              !touched.businessType && setTouched({ ...touched, businessType: true })
            }
          >
            <SelectTrigger
              id="businessType"
              className={
                errors.businessType && touched.businessType
                  ? 'border-destructive'
                  : formData.businessType
                    ? 'border-green-500'
                    : ''
              }
            >
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessType && touched.businessType && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.businessType}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="businessCategory">Business Category</Label>
            <InfoTooltip content="The industry or sector your business operates in" />
          </div>
          <Select
            value={formData.businessCategory}
            onValueChange={(value) => {
              updateFormData({ businessCategory: value });
              if (touched.businessCategory) validate('businessCategory');
            }}
            onOpenChange={() =>
              !touched.businessCategory && setTouched({ ...touched, businessCategory: true })
            }
          >
            <SelectTrigger
              id="businessCategory"
              className={
                errors.businessCategory && touched.businessCategory
                  ? 'border-destructive'
                  : formData.businessCategory
                    ? 'border-green-500'
                    : ''
              }
            >
              <SelectValue placeholder="Select business category" />
            </SelectTrigger>
            <SelectContent>
              {businessCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessCategory && touched.businessCategory && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.businessCategory}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="country">Country</Label>
            <InfoTooltip content="The country where your business is registered" />
          </div>
          <Select
            value={formData.country}
            onValueChange={(value) => {
              updateFormData({ country: value });
              if (touched.country) validate('country');
            }}
            onOpenChange={() => !touched.country && setTouched({ ...touched, country: true })}
          >
            <SelectTrigger
              id="country"
              className={
                errors.country && touched.country
                  ? 'border-destructive'
                  : formData.country
                    ? 'border-green-500'
                    : ''
              }
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && touched.country && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.country}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="address">Business Address</Label>
            <InfoTooltip content="The physical address where your business is registered" />
          </div>
          <div className="relative">
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => {
                updateFormData({ address: e.target.value });
                if (touched.address) validate('address');
              }}
              onBlur={() => handleBlur('address')}
              placeholder="123 Business St, City, State, ZIP"
              className={`transition-all ${errors.address && touched.address ? 'border-destructive' : formData.address && !errors.address ? 'border-green-500' : ''}`}
              rows={3}
            />
            {formData.address && !errors.address && (
              <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.address && touched.address && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.address}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="taxId">Tax ID (Optional)</Label>
            <InfoTooltip content="Your business tax identification number (EIN, VAT, etc.)" />
          </div>
          <div className="relative">
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => updateFormData({ taxId: e.target.value })}
              placeholder="XX-XXXXXXX"
            />
            {formData.taxId && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
        </motion.div>

        <motion.div className="pt-4" variants={itemVariants}>
          <Button type="submit" className="w-full md:w-auto group" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
