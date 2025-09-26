"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PaymentRequest, PaymentState } from "@/lib/types/payment"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"


interface PaymentDetailsProps {
  payment: PaymentRequest
}

const statusColors: Record<PaymentState, string> = {
  INITIAL: "bg-blue-100 text-blue-800",
  CONNECTING: "bg-yellow-100 text-yellow-800",
  PREPARING: "bg-orange-100 text-orange-800",
  SIGNING: "bg-purple-100 text-purple-800",
  SUBMITTING: "bg-indigo-100 text-indigo-800",
  VERIFYING: "bg-cyan-100 text-cyan-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
}

export function PaymentDetails({ payment }: PaymentDetailsProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast(`${label} copied to clipboard`)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Payment Details</CardTitle>
          <Badge className={statusColors[payment.status]}>{payment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Amount</label>
            <div className="text-2xl font-bold text-balance">
              {payment.amount} {payment.asset === "native" ? "XLM" : payment.asset}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="text-lg font-medium">{payment.status.replace("_", " ")}</div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Recipient Address</label>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="text-sm font-mono flex-1 break-all">{payment.destination}</code>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(payment.destination, "Address")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {payment.memo && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Memo</label>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-sm font-mono">{payment.memo}</code>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Created:</span> {new Date(payment.createdAt).toLocaleString()}
          </div>
          {payment.expiresAt && (
            <div>
              <span className="font-medium">Expires:</span> {new Date(payment.expiresAt).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
