"use client"

import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronLeft, ChevronRight,  ArrowRight, ArrowLeft } from "lucide-react"
import { useWallet } from "@/providers/useWalletProvider"
import { useStellar } from "@/hooks/use-wallet"
import { formatDate, formatAddress } from "@/lib/utils"

export default function TransactionHistory() {
  const { state: walletState } = useWallet()
  const { publicKey, isConnected } = walletState
  const { state, fetchPayments, goToNextPage, goToPrevPage } = useStellar()
  const { payments, isLoadingPayments, paymentError, paymentCursor, prevCursors } = state
  const networkType = "TESTNET";

  useEffect(() => {
    if (isConnected && publicKey) {
      fetchPayments(publicKey, null)
    }
  }, [publicKey, isConnected, fetchPayments])

  if (isLoadingPayments) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (paymentError) {
    return <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-600">{paymentError}</div>
  }

  if (payments.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No transactions found for this account.</div>
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Asset</th>
              <th className="px-4 py-2 text-left">Direction</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const txDate = payment.created_at || "Unknown"

              return (
                <tr key={payment.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">
                    {payment.amount ? Number(payment.amount).toFixed(7) : "N/A"}
                  </td>
                  <td className="px-4 py-3">{payment.displayAsset}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={payment.direction === "received" ? "success" : "default"}
                      className={`flex items-center gap-1 ${
                        payment.direction === "received" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {payment.direction === "received" ? (
                        <>
                          <ArrowRight className="h-3 w-3" /> Received
                        </>
                      ) : (
                        <>
                          <ArrowLeft className="h-3 w-3" /> Sent
                        </>
                      )}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">{formatAddress(payment.counterparty || "Unknown")}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {txDate !== "Unknown" ? formatDate(txDate) : "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://stellar.expert/explorer/${networkType.toLowerCase()}/tx/${payment.transaction_hash}`,
                          "_blank"
                        )
                      }
                      className="h-8 px-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View on Explorer</span>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPrevPage()}
          disabled={prevCursors.length === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToNextPage()}
          disabled={!paymentCursor}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
