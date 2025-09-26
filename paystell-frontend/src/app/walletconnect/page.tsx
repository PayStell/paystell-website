import type { Metadata } from 'next';
import WalletDashboard from '@/components/wallet/walletconnect/WalletDashboard';

export const metadata: Metadata = {
  title: 'Paystell Stellar Wallet | Dashboard',
  description: 'Manage your Stellar wallet, view balances, and send transactions',
};

export default function WalletPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Stellar Wallet</h1>
      </div>
      <WalletDashboard />
    </div>
  );
}
