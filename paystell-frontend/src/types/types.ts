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
  hash: string;
  type: 'sent' | 'received';
  amount: string;
  currency: string;
  from: string;
  to: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  fee: string;
  memo?: string;
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