"use client"

import { Horizon, Networks, Asset, TransactionBuilder, Memo, Operation } from "@stellar/stellar-sdk"

// Default to testnet for development
export const server = new Horizon.Server("https://horizon-testnet.stellar.org")
export const networkPassphrase = Networks.TESTNET
/**
 * Fetch account balances
 */
export const fetchAccountBalances = async (publicKey: string) => {
  try {
    const account = await server.loadAccount(publicKey)
    return account.balances
  } catch (error) {
    console.error("Error fetching account balances:", error)
    throw new Error("Failed to fetch account balances")
  }
}

/**
 * Fetch transaction history
 */
export const fetchTransactionHistory = async (publicKey: string, cursor: string | null = null, limit = 10) => {
  try {
    let builder = server.transactions().forAccount(publicKey).limit(limit).order("desc")

    if (cursor) {
      builder = builder.cursor(cursor)
    }

    const response = await builder.call()

    return {
      records: response.records,
      next: response.records.length > 0 ? response.records[response.records.length - 1].paging_token : null,
      prev: response.records.length > 0 ? response.records[0].paging_token : null,
    }
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    throw new Error("Failed to fetch transaction history")
  }
}

/**
 * Fetch payment operations for a given account
 */
export const fetchPaymentOperations = async (publicKey: string, cursor: string | null = null, limit = 20) => {
  try {
    let builder = server.payments().forAccount(publicKey).limit(limit).order("desc").join("transactions")

    if (cursor) {
      builder = builder.cursor(cursor)
    }

    const response = await builder.call()

    return {
      records: response.records,
      next: response.records.length > 0 ? response.records[response.records.length - 1].paging_token : null,
      prev: response.records.length > 0 ? response.records[0].paging_token : null,
    }
  } catch (error) {
    console.error("Error fetching payment operations:", error)
    throw new Error("Failed to fetch payment operations")
  }
}

/**
 * Create a payment transaction for XLM
 */
export const createPaymentTransaction = async ({
  source,
  destination,
  amount,
  memo = "",
}: {
  source: string
  destination: string
  amount: string
  memo?: string
}) => {
  try {
    const sourceAccount = await server.loadAccount(source)
    const transaction = new TransactionBuilder(sourceAccount, {
      networkPassphrase,
      fee: "100000", // 0.01 XLM
    })

    // Add memo if provided
    if (memo) {
      transaction.addMemo(Memo.text(memo))
    }

    // Add payment operation using the proper API for XLM (native asset)
    transaction.addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount: amount.toString(),
      }),
    )

    // Set timeout and build transaction
    const builtTransaction = transaction.setTimeout(300).build()

    return {
      transaction: builtTransaction.toXDR(),
      network_passphrase: networkPassphrase,
    }
  } catch (error) {
    console.error("Error creating payment transaction:", error)
    throw error
  }
}
