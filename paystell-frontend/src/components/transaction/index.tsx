"use client"

import { TransactionHistoryDashboard } from "./transaction-history-dashboard"
import { useEffect } from "react"
import { setNetwork } from "@/services/wallet-transaction.service"
import type { NetworkType } from "@/types/transaction-types"

export default function TransactionsPage() {
  const publicKey = "GDY5ZF245RCA54QG4XM4R54TS76LDV3UZZ56P6R2UE72TXSVOJFRFSZ7"
  const network: NetworkType = "TESTNET" // or "PUBLIC"

  useEffect(() => {
    setNetwork(network)
  }, [network])

  return (
    <div className="container mx-auto py-8">
      <TransactionHistoryDashboard publicKey={publicKey} network={network} />
    </div>
  )
}
