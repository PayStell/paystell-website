"use client"

import { useOnboarding } from "../onboarding-context"
import { Button } from "@/components/ui/button"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ProfileImageUpload from "@/components/register/ProfileImageUpload"

export default function BusinessInfoStep() {
  const { businessInfo, setBusinessInfo, goToNextStep, goToPreviousStep, isStepComplete } = useOnboarding()
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    businessInfo.profilePicture ? URL.createObjectURL(businessInfo.profilePicture) : "/default-image.jpg",
  )

  const handleImageUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setBusinessInfo({ profilePicture: file })
    } else {
      setPreviewImage("/default-image.jpg")
      setBusinessInfo({ profilePicture: null })
    }
  }

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl">Business Information</CardTitle>
        <CardDescription>Tell us about your business to customize your payment experience</CardDescription>
      </CardHeader>

      <div className="grid gap-6">
        <div className="flex justify-center">
          <ProfileImageUpload previewImage={previewImage} onImageUpload={handleImageUpload} />
        </div>

        <TooltipProvider>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="businessName">Business Name</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80">
                    This is the name that will appear on payment receipts and your merchant profile
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="businessName"
              placeholder="Your Business Name"
              value={businessInfo.businessName}
              onChange={(e) => setBusinessInfo({ businessName: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="businessType">Business Type</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the category that best describes your business</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={businessInfo.businessType}
              onValueChange={(value) => setBusinessInfo({ businessType: value })}
            >
              <SelectTrigger id="businessType">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="service">Service Provider</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="nonprofit">Non-profit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="website">Website (Optional)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your business website URL</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="website"
              placeholder="https://yourbusiness.com"
              value={businessInfo.website || ""}
              onChange={(e) => setBusinessInfo({ website: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>A contact number for your business</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="phoneNumber"
              placeholder="+1 (555) 123-4567"
              value={businessInfo.phoneNumber || ""}
              onChange={(e) => setBusinessInfo({ phoneNumber: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Business Description</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>A brief description of your business and what you offer</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              id="description"
              placeholder="Tell us about your business..."
              value={businessInfo.description}
              onChange={(e) => setBusinessInfo({ description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </TooltipProvider>
      </div>

      <CardFooter className="flex justify-between p-0 pt-4">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button onClick={goToNextStep} disabled={!isStepComplete("business-info")}>
          Continue
        </Button>
      </CardFooter>
    </div>
  )
}

