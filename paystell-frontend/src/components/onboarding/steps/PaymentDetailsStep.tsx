"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle, ExternalLink, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useProgress } from "@/hooks/use-progress"

interface PaymentSetupStepProps {
  formData: Record<string, any>
  updateFormData: (data: Record<string, any>) => void
}

export function PaymentDetailsStep({ formData, updateFormData }: PaymentSetupStepProps) {
  const { nextStep } = useProgress()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize state from formData
  const [stellarAddress, setStellarAddress] = useState(formData.stellarAddress || "")
  const [acceptedAssets, setAcceptedAssets] = useState(formData.acceptedAssets || ["XLM"])
  const [paymentTypesState, setPaymentTypes] = useState(formData.paymentTypes || ["online"])

  const assets = [
    { id: "XLM", label: "Stellar Lumens (XLM)" },
    { id: "USDC", label: "USD Coin (USDC)" },
    { id: "BTC", label: "Bitcoin (BTC)" },
    { id: "ETH", label: "Ethereum (ETH)" },
    { id: "EUR", label: "Euro (EUR)" },
  ]

  const paymentTypeOptions = [
    { id: "online", label: "Online Payments" },
    { id: "pos", label: "Point of Sale" },
    { id: "invoice", label: "Invoicing" },
    { id: "subscription", label: "Subscriptions" },
  ]

  const toggleAsset = (assetId: string) => {
    setAcceptedAssets(
      acceptedAssets.includes(assetId)
        ? acceptedAssets.filter((id: string) => id !== assetId)
        : [...acceptedAssets, assetId],
    )
  }

  const togglePaymentType = (typeId: string) => {
    setPaymentTypes(
      paymentTypesState.includes(typeId)
        ? paymentTypesState.filter((id: string) => id !== typeId)
        : [...paymentTypesState, typeId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Update form data
    updateFormData({
      stellarAddress,
      acceptedAssets,
      paymentTypes: paymentTypesState,
    })

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Payment settings saved", {
        description: "Your payment preferences have been saved successfully.",
      })
      nextStep()
    } catch (error) {
      toast.error("Error", {
        description: "There was a problem saving your payment settings. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
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

  const isStepComplete = () => {
    return stellarAddress.trim() !== "" && acceptedAssets.length > 0 && paymentTypesState.length > 0
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <CardHeader className="p-0">
        <motion.div variants={itemVariants}>
          <CardTitle className="text-2xl">Payment Settings</CardTitle>
          <CardDescription>Configure how you'll receive payments on the Stellar network</CardDescription>
        </motion.div>
      </CardHeader>

      <motion.form onSubmit={handleSubmit} className="grid gap-6" variants={containerVariants}>
        <TooltipProvider>
          <motion.div className="grid gap-3" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <Label htmlFor="stellarAddress">Stellar Address</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your Stellar wallet address where you'll receive payments</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="stellarAddress"
              placeholder="G..."
              value={stellarAddress}
              onChange={(e) => setStellarAddress(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Don't have a Stellar address?{" "}
              <a href="#" className="text-primary inline-flex items-center">
                Create one <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </motion.div>

          <motion.div className="grid gap-3" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <Label>Accepted Assets</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select which Stellar assets you want to accept as payment</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {assets.map((asset) => (
                <motion.div
                  key={asset.id}
                  className="flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Checkbox
                    id={`asset-${asset.id}`}
                    checked={acceptedAssets.includes(asset.id)}
                    onCheckedChange={() => toggleAsset(asset.id)}
                  />
                  <Label htmlFor={`asset-${asset.id}`} className="cursor-pointer">
                    {asset.label}
                  </Label>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="grid gap-3" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <Label>Payment Types</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select which payment methods you want to enable</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {paymentTypeOptions.map((type) => (
                <motion.div
                  key={type.id}
                  className="flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={paymentTypesState.includes(type.id)}
                    onCheckedChange={() => togglePaymentType(type.id)}
                  />
                  <Label htmlFor={`type-${type.id}`} className="cursor-pointer">
                    {type.label}
                  </Label>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TooltipProvider>

        <motion.div variants={itemVariants}>
          <Alert variant="default" className="bg-muted/50 border-muted">
            <AlertDescription>
              PayStell automatically converts between assets at the best available rate. You'll always receive the
              assets you've selected above.
            </AlertDescription>
          </Alert>
        </motion.div>

        <CardFooter className="flex justify-between p-0 pt-4">
          <motion.div variants={itemVariants}>
            <Button variant="outline" type="button" onClick={() => nextStep()}>
              Back
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button type="submit" disabled={!isStepComplete() || isSubmitting} className="group">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Setup
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      duration: 1,
                      repeatDelay: 1,
                    }}
                  ></motion.span>
                </>
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </motion.form>
    </motion.div>
  )
}

