"use client"
import { Horizon, Networks } from "@stellar/stellar-sdk"

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
): Promise<TransactionHistoryResponse> => {
  try {
    let builder = server.transactions().forAccount(publicKey).limit(limit).order(order).includeFailed(includeFailed)

    if (cursor) {
      builder = builder.cursor(cursor)
    }

    const response = await builder.call()
    const records = response.records

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
