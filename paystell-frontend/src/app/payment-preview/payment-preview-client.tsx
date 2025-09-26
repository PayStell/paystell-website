"use client"

export const dynamic = "force-dynamic"
import PaymentPreview from "@/components/paymentPreview/payment-preview"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { ErrorBoundary } from "@/components/ErrorBoundary"

interface PageProps {
  params: {
    id: string
  }
}

function PaymentSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading payment...</p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPreviewClient({ params }: PageProps) {
  const searchParams = useSearchParams()
  const merchantWalletAddress = searchParams.get("merchant")

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Suspense fallback={<PaymentSkeleton />}>
          <PaymentPreview paymentId={params.id} merchantWalletAddress={merchantWalletAddress} />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
