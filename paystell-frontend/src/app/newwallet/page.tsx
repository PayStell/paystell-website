import type { Metadata } from "next"
import WalletDashboard from "@/components/wallet/newwallet/WalletDashboard"

export const metadata: Metadata = {
  title: "Paystell Stellar Wallet | Dashboard",
  description: "Manage your Stellar wallet, view balances, and send transactions",
}

export default function WalletPage() {
  return (
    <div className=" mx-auto">
      <WalletDashboard />
    </div>
  )
}
