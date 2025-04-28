"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Wallet } from "lucide-react"
import { useWallet } from "@/providers/useWalletProvider"
import { useStellar } from "@/hooks/use-wallet"
import { createPaymentTransaction, networkPassphrase } from "@/lib/wallet/stellar-service"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  destination: z
    .string()
    .min(56, "Stellar address must be 56 characters")
    .max(56, "Stellar address must be 56 characters"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  memo: z.string().optional(),
})

export default function SendPaymentForm() {
  const { state: walletState, signTransaction } = useWallet()
  const { publicKey, isConnected } = walletState
  const { state: stellarState, fetchBalances } = useStellar()
  const { balances, xlmPrice } = stellarState
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usdEquivalent, setUsdEquivalent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Find XLM balance
  const xlmBalance = balances.find((asset) => asset.asset_type === "native")
  const xlmAmount = xlmBalance ? Number(xlmBalance.balance) : 0

  // Calculate USD value of total balance
  const totalUsdValue = xlmPrice && xlmAmount ? (xlmAmount * xlmPrice).toFixed(2) : null

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      amount: "",
      memo: "",
    },
  })

  // Update USD equivalent when amount changes or XLM price changes
  useEffect(() => {
    const amount = form.watch("amount")
    if (amount && xlmPrice && !isNaN(Number(amount))) {
      const usdValue = (Number(amount) * xlmPrice).toFixed(2)
      setUsdEquivalent(usdValue)
    } else {
      setUsdEquivalent(null)
    }
  }, [form.watch("amount"), xlmPrice, form])

  // Handle Max button click
  const handleMaxClick = () => {
    if (!xlmBalance) return

    // Reserve 1 XLM for minimum balance requirement and 0.01 XLM for transaction fee
    const reserveAmount = 1.01
    const availableBalance = Math.max(0, xlmAmount - reserveAmount)

    // Format to 7 decimal places (Stellar's precision)
    const formattedAmount = availableBalance.toFixed(7)

    form.setValue("amount", formattedAmount)

    // Trigger validation
    form.trigger("amount")

    // Update USD equivalent
    if (xlmPrice) {
      const usdValue = (availableBalance * xlmPrice).toFixed(2)
      setUsdEquivalent(usdValue)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isConnected || !publicKey) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to send payments.",
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Create the payment transaction (XLM only)
      const { transaction, network_passphrase } = await createPaymentTransaction({
        source: publicKey,
        destination: values.destination,
        amount: values.amount,
        memo: values.memo,
      })

      console.log("Transaction created, attempting to sign...")
      let signedTxXdr
      try {
        const passphraseString = typeof network_passphrase === "string" ? network_passphrase : networkPassphrase

        signedTxXdr = await signTransaction(transaction, {
          networkPassphrase: passphraseString,
        })
        console.log("Transaction signed successfully")
        toast.success("Transaction successful", {
          description:"Transaction signed successfully",
        })
        
      } catch (signError: any) {
        // Capture and display the exact signing error
        console.error("Transaction signing error:", signError)
        const errorMessage = signError.message || signError.toString()
        setError(`Signing error: ${errorMessage}`)
        toast.error("Failed to sign transaction", {
          description: errorMessage,
        })
        setIsSubmitting(false)
        return
      }

      console.log("Transaction signed, submitting to network...")

      try {
        const response = await fetch("/api/wallet/submit-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signedXdr: signedTxXdr,
          }),
        })

        // Check if response is not JSON (HTML error page)
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text()
          console.error("Received non-JSON response:", responseText)
          throw new Error(`API error: Received ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        if (!response.ok) {
          console.error("Transaction submission failed:", result)
          const errorMessage = result.error || result.message || "Unknown error"
          throw new Error(`Failed to submit transaction: ${errorMessage}`)
        }

        console.log("Transaction submitted successfully:", result)

        toast.success("XLM payment sent successfully", {
          description: `Transaction hash: ${result.hash.substring(0, 10)}...`,
        })

        if (publicKey) {
          setTimeout(() => fetchBalances(publicKey), 2000) 
        }

        // Reset form
        form.reset()
        setUsdEquivalent(null)
      } catch (fetchError: any) {
        console.error("API request failed:", fetchError)
        const errorMessage = fetchError.message || fetchError.toString()
        setError(`API error: ${errorMessage}`)
        toast.error("API request failed", {
          description: errorMessage,
        })
      }
    } catch (error: any) {
      console.error("Payment process failed:", error)
      const errorMessage = error.message || error.toString()
      setError(errorMessage)
      toast.error("Payment failed", {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
            <div className="text-right">
              <p className="text-xl font-bold">{xlmAmount.toFixed(2)} XLM</p>
              {totalUsdValue && (
                <p className="text-sm text-muted-foreground flex items-center justify-end">
                  <Wallet className="h-3 w-3 mr-1" />
                  {totalUsdValue} USD
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="break-all">{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Address</FormLabel>
                <FormControl>
                  <Input placeholder="G..." {...field} />
                </FormControl>
                <FormDescription>Enter the Stellar public key of the recipient</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Amount (XLM)</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleMaxClick}
                    className="h-6 px-2 text-xs"
                    disabled={!xlmBalance || xlmAmount <= 1.01}
                  >
                    Max
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="0.0" {...field} />
                    {usdEquivalent && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground flex items-center">
                        <Wallet className="h-3 w-3 mr-1" />
                        {usdEquivalent}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>Amount of XLM to send</span>
                  {field.value && Number(field.value) > 0 && usdEquivalent && (
                    <span className="text-muted-foreground">≈ ${usdEquivalent} USD</span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memo (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Payment for services..." {...field} />
                </FormControl>
                <FormDescription>Add a short note to your transaction</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending XLM...
              </>
            ) : (
              "Send XLM"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
