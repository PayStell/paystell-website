import { CheckCircle } from "lucide-react"

interface SuccessMessageProps {
  productName: string
}

export function SuccessMessage({ productName }: SuccessMessageProps) {
  return (
    <div className="py-8 flex flex-col items-center justify-center text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
      <p className="text-gray-500">Your order for {productName} has been confirmed.</p>
    </div>
  )
}

