import { Transaction } from "@stellar/stellar-sdk"

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface AssetType {
  asset_type: string
  asset_code?: string
  asset_issuer?: string
  balance: string
  limit?: string
  buying_liabilities?: string
  selling_liabilities?: string
  last_modified_ledger?: number
  is_authorized?: boolean
  is_authorized_to_maintain_liabilities?: boolean
}

export interface TransactionRecord {
  id: string
  paging_token: string
  successful: boolean
  hash: string
  ledger: number | number
  created_at: string
  source_account: string
  source_account_sequence: string
  fee_charged: string | number
  max_fee: string | number
  operation_count: number
  memo_type: string
  memo?: string
  signatures: string[]
  type?: string
}

export interface PaymentOperation {
  id: string
  paging_token: string
  transaction_successful: boolean
  source_account: string
  type: string
  type_i: number
  created_at: string
  transaction_hash: string
  asset_type?: string
  asset_code?: string
  asset_issuer?: string
  from?: string
  to?: string
  amount?: string
  transaction?: Partial<TransactionRecord> 
}

export interface EnhancedPaymentOperation {
  id: string
  paging_token: string
  transaction_successful: boolean
  source_account: string
  type: string
  type_i: number
  created_at: string
  transaction_hash: string
  asset_type?: string
  asset_code?: string
  asset_issuer?: string
  from?: string
  to?: string
  amount?: string
  transaction?: Transaction
  direction: "sent" | "received"
  counterparty: string
  displayAsset: string
}
