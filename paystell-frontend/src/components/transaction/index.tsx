"use client"

import { TransactionHistoryDashboard } from "./transaction-history-dashboard"
import { useEffect, useState } from "react"
import { setNetwork } from "@/services/wallet-transaction.service"
import type { NetworkType } from "@/types/transaction-types"
import { useWallet } from "@/providers/useWalletProvider"

export default function TransactionsPage() {
  // const publicKey = "GDY5ZF245RCA54QG4XM4R54TS76LDV3UZZ56P6R2UE72TXSVOJFRFSZ7"
  const { state: walletState } = useWallet()
  const { publicKey, isConnected } = walletState
  const [sendAddress, setSenderAddress] = useState<string | null>(null)
  const network: NetworkType = "TESTNET" // or "PUBLIC"

  useEffect(() => {
    setNetwork(network)
    if (isConnected && publicKey) {
      setSenderAddress(publicKey)
    }
  }, [network, isConnected, sendAddress, publicKey])

  return (
    <div className="container mx-auto py-8">
      <TransactionHistoryDashboard publicKey={sendAddress} network={network} isConnected={isConnected} />
    </div>
  )
}
