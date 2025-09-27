export interface DepositRequest {
  id: string;
  ownerId: string;
  address: string;
  amount?: string;
  asset: string;
  memo?: string;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  createdAt: string;
  expiresAt: string;
  confirmedAt?: string;
  transactionHash?: string;
}

export interface DepositQRData {
  address: string;
  amount?: string;
  asset: string;
  memo?: string;
  label?: string;
  message?: string;
}

export interface DepositTransaction {
  id: string;
  hash: string;
  amount: string;
  asset: string;
  from: string;
  to: string;
  memo?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  confirmedAt?: string;
  ledger?: number;
  fee: string;
}

export interface OptimisticTransaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: string;
  asset: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  transactionHash?: string;
  error?: string;
}

export interface TransactionQueue {
  pending: OptimisticTransaction[];
  processing: OptimisticTransaction[];
  completed: OptimisticTransaction[];
  failed: OptimisticTransaction[];
}

export interface DepositMonitoringConfig {
  address: string;
  asset: string;
  minAmount?: string;
  maxAmount?: string;
  memo?: string;
  callback?: (transaction: DepositTransaction) => void;
}
