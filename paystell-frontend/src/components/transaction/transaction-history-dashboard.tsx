"use client"

import { useState, useEffect, useCallback } from "react"
import type { Horizon } from "@stellar/stellar-sdk"
import { fetchTransactionHistory, NETWORKS } from "@/services/wallet-transaction.service"
import { TransactionFilters } from "./transaction-filters"
import { TransactionTable } from "./transaction-table"
import { TransactionDetailsModal } from "./transaction-details-modal"
import { Pagination } from "./pagination"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { TransactionFilter, NetworkType } from "@/types/transaction-types"
import ConnectWalletButton from "../shared/ConnectWalletButton"

interface TransactionHistoryDashboardProps {
  publicKey: string | null
  network: NetworkType
  isConnected: boolean
}

export function TransactionHistoryDashboard({ publicKey, network, isConnected }: TransactionHistoryDashboardProps) {
  const [transactions, setTransactions] = useState<Horizon.ServerApi.TransactionRecord[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [prevCursors, setPrevCursors] = useState<string[]>([])

  // State for filters
  const [filters, setFilters] = useState<TransactionFilter>({
    dateRange: "7d",
    startDate: "",
    endDate: "",
    status: "all",
    minAmount: "",
    maxAmount: "",
    searchQuery: "",
  })

  // Wrap loadTransactions with useCallback to prevent it from changing on every render
  const loadTransactions = useCallback(async (resetPagination = false) => {
    if (!publicKey) return;
    
    // Reset error state
    setError(null);
    
    // Handle pagination reset
    if (resetPagination) {
      setCurrentPage(1);
      setCursor(null);
      setPrevCursors([]);
    }
    
    try {
      setIsLoading(true);
      
      // Call fetchTransactionHistory with the correct parameter types
      const result = await fetchTransactionHistory(publicKey, cursor);
      
      if (!result || !result.records || result.records.length === 0) {
        if (resetPagination) {
          // If no results on first page
          setTransactions([]);
          setHasNext(false);
          setHasPrev(false);
        } else {
          // If no more results when paginating
          setHasNext(false);
        }
      } else {
        setTransactions(result.records);
        setHasNext(result.next !== null);
        setCursor(result.next);
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, cursor]);

  // Load next/previous page
  const loadNextPage = () => {
    if (hasNext) {
      loadTransactions(false);
      setCurrentPage((prev) => prev + 1);
    }
  }

  const loadPreviousPage = () => {
    if (hasPrev) {
      const prevCursor = prevCursors.length > 0 ? prevCursors[prevCursors.length - 1] : null;
      setCursor(prevCursor);
      loadTransactions(false);
      setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
    }
  }

  // Handle filter changes
  const handleFilterChange = (newFilters: TransactionFilter) => {
    setFilters(newFilters)
    loadTransactions(true)
  }

  // View transaction details
  const handleViewTransaction = (transactionId: string) => {
    setSelectedTransactionId(transactionId)
  }

  // Close transaction details modal
  const handleCloseModal = () => {
    setSelectedTransactionId(null)
  }

  // Initial load
  useEffect(() => {
    if (publicKey) {
      loadTransactions(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey])

  // Refresh data periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (publicKey && !isLoading) {
        loadTransactions(true)
      }
    }, 60000) // Refresh every minute

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, isLoading, filters])

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
            <CardDescription className="text-slate-300">
              View and manage your transaction history on the Stellar {NETWORKS[network].name} network
            </CardDescription>
          </div>
          <div className="bg-slate-900/50 px-3 py-1 rounded-full text-xs font-medium text-slate-200">{network}</div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <TransactionFilters filters={filters} onFilterChange={handleFilterChange} isLoading={isLoading} />

        {error && (
          <Alert variant="destructive" className="animate-in fade-in-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-lg text-muted-foreground">Loading transactions...</span>
          </div>
        ) : (
          <>
            {isConnected && publicKey ?
              <TransactionTable transactions={transactions} onViewTransaction={handleViewTransaction} network={network} />
              :
              <div className="flex justify-center py-8 flex-col items-center">
                <ConnectWalletButton />
                <p className="text-sm text-muted-foreground mt-2">
                  {!isConnected ? "Wallet not connected" : "Connected but No public key available"}
                </p>
              </div>}
            {transactions.length > 0 && (
              <Pagination
                currentPage={currentPage}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onNext={loadNextPage}
                onPrevious={loadPreviousPage}
                isLoading={isLoading}
                totalItems={transactions.length}
              />
            )}
          </>
        )}
      </CardContent>

      {selectedTransactionId && (
        <TransactionDetailsModal transactionId={selectedTransactionId} onClose={handleCloseModal} network={network} />
      )}
    </Card>
  )
}
