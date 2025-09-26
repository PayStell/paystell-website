import type { PaymentRequest } from "./types/payment"

export function generatePaymentURI(payment: PaymentRequest): string {
  const params = new URLSearchParams({
    destination: payment.destination,
    amount: payment.amount,
    asset_code: payment.asset === "native" ? "XLM" : payment.asset,
  })

  if (payment.memo) {
    params.append("memo", payment.memo)
    params.append("memo_type", "text")
  }

  return `web+stellar:pay?${params.toString()}`
}

export function generateQRCodeData(payment: PaymentRequest): string {
  return generatePaymentURI(payment)
}
