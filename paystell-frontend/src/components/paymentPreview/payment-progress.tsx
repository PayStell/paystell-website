import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PaymentState } from "@/lib/types/payment"
import { CheckCircle, Loader2, XCircle } from "lucide-react"

interface PaymentProgressProps {
  currentState: PaymentState
}

const paymentSteps: { state: PaymentState; label: string; description: string }[] = [
  { state: "INITIAL", label: "Ready", description: "Payment request created" },
  { state: "CONNECTING", label: "Connecting", description: "Connecting to wallet" },
  { state: "PREPARING", label: "Preparing", description: "Building transaction" },
  { state: "SIGNING", label: "Signing", description: "Waiting for signature" },
  { state: "SUBMITTING", label: "Submitting", description: "Submitting to network" },
  { state: "VERIFYING", label: "Verifying", description: "Verifying transaction" },
  { state: "COMPLETED", label: "Completed", description: "Payment successful" },
]

export function PaymentProgress({ currentState }: PaymentProgressProps) {
  const currentIndex = paymentSteps.findIndex((step) => step.state === currentState)
  const progress = currentState === "FAILED" ? 0 : ((currentIndex + 1) / paymentSteps.length) * 100

  const getStepIcon = (stepState: PaymentState, index: number) => {
    if (currentState === "FAILED") {
      return <XCircle className="h-4 w-4 text-red-500" />
    }

    if (index < currentIndex) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    if (stepState === currentState && currentState !== "COMPLETED") {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }

    if (stepState === currentState && currentState === "COMPLETED") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
  }

  if (currentState === "INITIAL") {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="w-full" />

        <div className="space-y-3">
          {paymentSteps.slice(1).map((step, index) => {
            const stepIndex = index + 1
            const isActive = step.state === currentState
            const isCompleted = stepIndex < currentIndex

            return (
              <div
                key={step.state}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 border border-blue-200" : isCompleted ? "bg-green-50" : "bg-muted/30"
                }`}
              >
                {getStepIcon(step.state, stepIndex)}
                <div className="flex-1">
                  <div className={`font-medium ${isActive ? "text-blue-700" : ""}`}>{step.label}</div>
                  <div className="text-sm text-muted-foreground">{step.description}</div>
                </div>
              </div>
            )
          })}
        </div>

        {currentState === "FAILED" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 font-medium">
              <XCircle className="h-4 w-4" />
              Payment Failed
            </div>
            <div className="text-sm text-red-600 mt-1">The payment could not be completed. Please try again.</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
