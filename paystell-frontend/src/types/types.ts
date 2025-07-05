export type StellarAddress = string;

export interface WalletData {
  address: string;
  balance: string;
  balanceUSD: string;
  isActivated: boolean;
  trustlines: number;
  transactions: number;
  hasWallet: boolean;
}

export interface Transaction {
  id: string;
  hash: string; // Should be validated as Stellar transaction hash
  type: 'sent' | 'received';
  amount: string; // Consider using number for calculations
  currency: string; // Should be validated against supported assets
  from: StellarAddress;
  to: StellarAddress;
  date: string; // Consider using Date type or ISO string
  status: 'completed' | 'pending' | 'failed';
  fee: string; // Consider using number
  memo?: string;
  ledger?: number; // Stellar ledger number
  sequence?: string; // Account sequence number
  operationType?: 'payment' | 'create_account' | 'trust' | 'offer';
}

export interface FormData {
  walletName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  mnemonic: string;
  securityQuestions: Record<string, string>;
  twoFactorEnabled: boolean;
}

export interface Filters {
  type: string;
  dateRange: string;
  amount: string;
  search: string;
}