"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InfoTooltip } from "../InfoToolTip"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"
import { motion } from "framer-motion"
import { toast } from "sonner"


interface BasicInfoStepProps {
  formData: {
    businessName: string
    fullName: string
    email: string
    phone: string
  }
  updateFormData: (
    data: Partial<{
      businessName: string
      fullName: string
      email: string
      phone: string
    }>,
  ) => void
}

export function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  const { nextStep } = useProgress()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation patterns
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const phonePattern = /^\+?[0-9\s$$$$-]{10,20}$/

  const validate = (field?: string) => {
    const newErrors: Record<string, string> = { ...errors }

    if (!field || field === "businessName") {
      if (!formData.businessName.trim()) {
        newErrors.businessName = "Business name is required"
      } else if (formData.businessName.length < 2) {
        newErrors.businessName = "Business name must be at least 2 characters"
      } else {
        delete newErrors.businessName
      }
    }

    if (!field || field === "fullName") {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required"
      } else if (formData.fullName.length < 3) {
        newErrors.fullName = "Full name must be at least 3 characters"
      } else {
        delete newErrors.fullName
      }
    }

    if (!field || field === "email") {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!emailPattern.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      } else {
        delete newErrors.email
      }
    }

    if (!field || field === "phone") {
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      } else if (!phonePattern.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number"
      } else {
        delete newErrors.phone
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    validate(field)
  }

  const handleChange = (field: string, value: string) => {
    updateFormData({ [field as keyof typeof formData]: value })
    if (touched[field]) {
      validate(field)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      businessName: true,
      fullName: true,
      email: true,
      phone: true,
    })

    if (validate()) {
      setIsSubmitting(true)

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast.success("Information saved", {
          description:"Your basic information has been saved successfully."
        })
        nextStep()
      } catch (error) {
        toast.error("Error", {
          description:"There was a problem saving your information. Please try again."
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      toast.error("Error", {description:"Please correct the errors in the form."})
    }
  }

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-muted-foreground">Let's start with some basic information about you and your business.</p>
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
            <Label htmlFor="businessName">Business Name</Label>
            <InfoTooltip content="The legal name of your business as it appears on official documents" />
          </div>
          <div className="relative">
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              onBlur={() => handleBlur("businessName")}
              placeholder="Acme Inc."
              className={`transition-all ${errors.businessName && touched.businessName ? "border-destructive pr-10" : formData.businessName && !errors.businessName ? "border-green-500 pr-10" : ""}`}
            />
            {formData.businessName && !errors.businessName && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.businessName && touched.businessName && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.businessName}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="fullName">Full Name</Label>
            <InfoTooltip content="Your full legal name as the business representative" />
          </div>
          <div className="relative">
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="John Doe"
              className={`transition-all ${errors.fullName && touched.fullName ? "border-destructive pr-10" : formData.fullName && !errors.fullName ? "border-green-500 pr-10" : ""}`}
            />
            {formData.fullName && !errors.fullName && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.fullName && touched.fullName && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.fullName}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="email">Email Address</Label>
            <InfoTooltip content="We'll use this email for account verification and important notifications" />
          </div>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="john@acmeinc.com"
              className={`transition-all ${errors.email && touched.email ? "border-destructive pr-10" : formData.email && !errors.email ? "border-green-500 pr-10" : ""}`}
            />
            {formData.email && !errors.email && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.email && touched.email && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center">
            <Label htmlFor="phone">Phone Number</Label>
            <InfoTooltip content="A phone number where we can reach you for account verification" />
          </div>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="+1 (555) 123-4567"
              className={`transition-all ${errors.phone && touched.phone ? "border-destructive pr-10" : formData.phone && !errors.phone ? "border-green-500 pr-10" : ""}`}
            />
            {formData.phone && !errors.phone && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.phone && touched.phone && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.phone}
            </motion.p>
          )}
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
  )
}

