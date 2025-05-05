"use client"
import { Horizon, Networks } from "@stellar/stellar-sdk"
import type { TransactionFilter } from "@/types/transaction-types"

type NetworkType = "TESTNET" | "PUBLIC"

interface Network {
  server: string
  passphrase: string
  name: string
}

export const NETWORKS: Record<NetworkType, Network> = {
  TESTNET: {
    server: "https://horizon-testnet.stellar.org",
    passphrase: Networks.TESTNET,
    name: "Testnet",
  },
  PUBLIC: {
    server: "https://horizon.stellar.org",
    passphrase: Networks.PUBLIC,
    name: "Public",
  },
}

let currentNetwork: NetworkType = "TESTNET"
export let server = new Horizon.Server(NETWORKS[currentNetwork].server)
export let networkPassphrase = NETWORKS[currentNetwork].passphrase

export const setNetwork = (network: NetworkType) => {
  currentNetwork = network;
  console.log(`Setting network to ${network}`);
  server = new Horizon.Server(NETWORKS[network].server)
  networkPassphrase = NETWORKS[network].passphrase
  return { server, networkPassphrase }
}

interface TransactionHistoryResponse {
  records: Horizon.ServerApi.TransactionRecord[]
  next: string | null
  prev: string | null
  hasNext: boolean
  hasPrev: boolean
  cursor: string | null
}

export const fetchTransactionHistory = async (
  publicKey: string,
  cursor: string | null = null,
  limit = 10,
  order: "asc" | "desc" = "desc",
  includeFailed = true,
  filters?: TransactionFilter,
): Promise<TransactionHistoryResponse> => {
  try {
    let builder = server.transactions().forAccount(publicKey).limit(limit).order(order)
    
    // Handle status filter
    if (filters?.status === "success") {
      includeFailed = false;
    } else if (filters?.status === "failed") {
      // We still want to include failed transactions, but will filter for only failed ones client-side
      includeFailed = true;
    }
    
    builder = builder.includeFailed(includeFailed);

    // Add cursor for pagination if provided
    if (cursor) {
      builder = builder.cursor(cursor)
    }

    // Fetch transactions from the server
    const response = await builder.call()
    let records = response.records

    // Apply client-side filters if necessary
    if (filters) {
      // Date range filtering
      if (filters.dateRange !== "all") {
        const now = new Date()
        let startDate: Date | null = null
        let endDate: Date | null = null

        // Calculate date range based on the selected option
        if (filters.dateRange === "custom" && filters.startDate) {
          startDate = new Date(filters.startDate)
          endDate = filters.endDate ? new Date(filters.endDate) : now
        } else if (filters.dateRange === "24h") {
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        } else if (filters.dateRange === "7d") {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        } else if (filters.dateRange === "30d") {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        } else if (filters.dateRange === "90d") {
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        }

        if (startDate) {
          records = records.filter(tx => {
            const txDate = new Date(tx.created_at)
            return txDate >= startDate! && (!endDate || txDate <= endDate)
          })
        }
      }

      // Amount filtering (this will need to be refined based on operation details)
      if (filters.minAmount || filters.maxAmount) {
        // Note: This is a simplified implementation as transaction amounts would need to be 
        // extracted from operations, which would require additional API calls per transaction
        // For a complete implementation, you'd need to fetch operations for each transaction
      }

      // Search filtering (simplified implementation)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        records = records.filter(tx => 
          tx.id.toLowerCase().includes(query) || 
          tx.memo?.toLowerCase().includes(query)
        )
      }

      // Filter for only failed transactions if requested
      if (filters.status === "failed") {
        records = records.filter(tx => tx.successful === false)
      }
    }

    return {
      records,
      next: records.length > 0 ? records[records.length - 1].paging_token : null,
      prev: records.length > 0 ? records[0].paging_token : null,
      hasNext: records.length > 0,
      hasPrev: records.length > 0,
      cursor: records.length > 0 ? records[records.length - 1].paging_token : null,
    }
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    throw new Error("Failed to fetch transaction history")
  }
}

interface TransactionDetailsResponse {
  transaction: Horizon.ServerApi.TransactionRecord
  operations: Horizon.ServerApi.OperationRecord[]
}

export const fetchTransactionDetails = async (transactionHash: string): Promise<TransactionDetailsResponse> => {
  try {
    const transaction = await server.transactions().transaction(transactionHash).call()
    const operationsResponse = await server.operations().forTransaction(transactionHash).call()

    return {
      transaction,
      operations: operationsResponse.records,
    }
  } catch (error) {
    console.error("Error fetching transaction details:", error)
    throw new Error("Failed to fetch transaction details")
  }
}
