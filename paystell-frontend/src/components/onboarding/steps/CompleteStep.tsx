"use client"

import { useOnboarding } from "../onboarding-context"
import { Button } from "@/components/ui/button"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CompleteStep() {
  const { businessInfo, paymentInfo } = useOnboarding()

  const handleSubmit = () => {
    // In a real application, this would submit all the collected data to your API
    console.log("Submitting registration data:", {
      businessInfo,
      paymentInfo,
    })

    // Redirect to dashboard or login page
    window.location.href = "/dashboard"
  }

  return (
    <div className="space-y-6">
      <CardHeader className="text-center p-0">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl">Setup Complete!</CardTitle>
        <CardDescription className="text-base mt-2">
          You're all set to start accepting Stellar payments with PayStell
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Account Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Business Name:</p>
              <p className="font-medium">{businessInfo.businessName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Business Type:</p>
              <p className="font-medium">{businessInfo.businessType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stellar Address:</p>
              <p className="font-medium truncate">{paymentInfo.stellarAddress}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Accepted Assets:</p>
              <p className="font-medium">{paymentInfo.acceptedAssets.join(", ")}</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Next Steps</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Access your merchant dashboard to view transactions</li>
            <li>Create your first payment link to share with customers</li>
            <li>Set up your point-of-sale system if applicable</li>
            <li>Customize your payment page with your branding</li>
          </ul>
        </div>
      </div>

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-0 pt-4">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/help">View Documentation</Link>
        </Button>
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          Go to Dashboard
        </Button>
      </CardFooter>
    </div>
  )
}

