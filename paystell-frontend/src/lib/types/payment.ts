export type PaymentState =
  | "INITIAL"
  | "CONNECTING"
  | "PREPARING"
  | "SIGNING"
  | "SUBMITTING"
  | "VERIFYING"
  | "COMPLETED"
  | "FAILED"

export interface PaymentRequest {
  id: string
  amount: string
  asset: string
  destination: string
  memo?: string
  status: PaymentState
  createdAt: string
  expiresAt?: string
}

export interface PaymentError {
  type: "WALLET_ERROR" | "TRANSACTION_ERROR" | "VERIFICATION_ERROR"
  code: string
  message: string
  recoverable: boolean
}
