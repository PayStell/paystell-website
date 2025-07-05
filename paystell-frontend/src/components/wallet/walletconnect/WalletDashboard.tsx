"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useWallet } from "@/providers/useWalletProvider"
import { StellarProvider } from "@/hooks/use-wallet"
import WalletBalance from "./WalletBalance"
import TransactionHistory from "./TransactionHistory"
import SendPaymentForm from "./SendPaymentForm"
import ConnectWalletButton from "../../shared/ConnectWalletButton"

export default function WalletDashboard() {
  const { state } = useWallet()
  const { isConnected, publicKey } = state
  const [error] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!isConnected) {
      setActiveTab("overview")
    }
  }, [isConnected])

  return (
    <StellarProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl mb-2">Stellar Wallet</CardTitle>
              <CardDescription>{isConnected? <Badge className="bg-green-600">Connected</Badge>: "Connect your Stellar wallet to manage funds"}</CardDescription>
            </div>
            <div>
              <Badge variant="secondary">TESTNET</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ConnectWalletButton className="w-full sm:w-auto" />
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

     <div >
     {isConnected && publicKey && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="send">Send Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Overview</CardTitle>
                  <CardDescription>View your Stellar wallet balance and assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <WalletBalance />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionHistory />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="send" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Send Payment</CardTitle>
                  <CardDescription>Send payments to other Stellar accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <SendPaymentForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
     </div>
      </div>
    </StellarProvider>
  )
}
