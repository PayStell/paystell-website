"use client"

import { useOnboarding } from "../onboarding-context"
import { Button } from "@/components/ui/button"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle, ExternalLink } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentDetailsStep() {
  const { paymentInfo, setPaymentInfo, goToNextStep, goToPreviousStep, isStepComplete } = useOnboarding()

  const assets = [
    { id: "XLM", label: "Stellar Lumens (XLM)" },
    { id: "USDC", label: "USD Coin (USDC)" },
    { id: "BTC", label: "Bitcoin (BTC)" },
    { id: "ETH", label: "Ethereum (ETH)" },
    { id: "EUR", label: "Euro (EUR)" },
  ]

  const paymentTypes = [
    { id: "online", label: "Online Payments" },
    { id: "pos", label: "Point of Sale" },
    { id: "invoice", label: "Invoicing" },
    { id: "subscription", label: "Subscriptions" },
  ]

  const toggleAsset = (assetId: string) => {
    setPaymentInfo({
      acceptedAssets: paymentInfo.acceptedAssets.includes(assetId)
        ? paymentInfo.acceptedAssets.filter((id) => id !== assetId)
        : [...paymentInfo.acceptedAssets, assetId],
    })
  }

  const togglePaymentType = (typeId: string) => {
    setPaymentInfo({
      paymentTypes: paymentInfo.paymentTypes.includes(typeId)
        ? paymentInfo.paymentTypes.filter((id) => id !== typeId)
        : [...paymentInfo.paymentTypes, typeId],
    })
  }

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl">Payment Settings</CardTitle>
        <CardDescription>Configure how you'll receive payments on the Stellar network</CardDescription>
      </CardHeader>

      <div className="grid gap-6">
        <TooltipProvider>
          <div className="grid gap-3">
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
              value={paymentInfo.stellarAddress}
              onChange={(e) => setPaymentInfo({ stellarAddress: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Don't have a Stellar address?{" "}
              <a href="#" className="text-primary inline-flex items-center">
                Create one <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </div>

          <div className="grid gap-3">
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
                <div key={asset.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`asset-${asset.id}`}
                    checked={paymentInfo.acceptedAssets.includes(asset.id)}
                    onCheckedChange={() => toggleAsset(asset.id)}
                  />
                  <Label htmlFor={`asset-${asset.id}`} className="cursor-pointer">
                    {asset.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
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
              {paymentTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={paymentInfo.paymentTypes.includes(type.id)}
                    onCheckedChange={() => togglePaymentType(type.id)}
                  />
                  <Label htmlFor={`type-${type.id}`} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>

        <Alert variant="default" className="bg-muted/50 border-muted">
          <AlertDescription>
            PayStell automatically converts between assets at the best available rate. You'll always receive the assets
            you've selected above.
          </AlertDescription>
        </Alert>
      </div>

      <CardFooter className="flex justify-between p-0 pt-4">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button onClick={goToNextStep} disabled={!isStepComplete("payment-details")}>
          Complete Setup
        </Button>
      </CardFooter>
    </div>
  )
}

