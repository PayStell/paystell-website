export type DateRange = "24h" | "7d" | "30d" | "90d" | "all" | "custom"
export type TransactionStatus = "all" | "success" | "failed"
export type NetworkType = "TESTNET" | "PUBLIC"

export interface TransactionFilter {
  dateRange: DateRange
  startDate: string
  endDate: string
  status: TransactionStatus
  minAmount: string
  maxAmount: string
  searchQuery: string
}
