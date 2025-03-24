"use client"

import { useOnboarding } from "../onboarding-context"
import { Button } from "@/components/ui/button"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket } from "lucide-react"

export default function WelcomeStep() {
  const { goToNextStep } = useOnboarding()

  return (
    <div className="space-y-6">
      <CardHeader className="text-center p-0">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl sm:text-3xl">Welcome to PayStell</CardTitle>
        <CardDescription className="text-base mt-2">
          Let's get you set up to accept Stellar payments in just a few steps
        </CardDescription>
      </CardHeader>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Fast & Secure Payments</h3>
          <p className="text-sm text-muted-foreground">
            Accept payments on the Stellar network with minimal transaction fees
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Multiple Assets</h3>
          <p className="text-sm text-muted-foreground">Support for multiple Stellar assets and currencies</p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Real-time Processing</h3>
          <p className="text-sm text-muted-foreground">Process payments in real-time with instant confirmations</p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Intuitive Dashboard</h3>
          <p className="text-sm text-muted-foreground">Manage all your transactions from an easy-to-use dashboard</p>
        </div>
      </div>

      <CardFooter className="flex justify-end p-0 pt-4">
        <Button onClick={goToNextStep} size="lg">
          Get Started
        </Button>
      </CardFooter>
    </div>
  )
}

