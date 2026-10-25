export type WithdrawAssetCode = 'XLM' | 'USDC' | 'EURC';

export type WithdrawMemoType = 'none' | 'text' | 'id';

export type WithdrawFeePriority = 'standard' | 'fast' | 'instant';

export interface WithdrawFormData {
  asset: WithdrawAssetCode;
  amount: string;
  destination: string;
  memoType: WithdrawMemoType;
  memo: string;
  feePriority: WithdrawFeePriority;
  twoFactorCode: string;
  confirmedTerms: boolean;
  [key: string]: unknown;
}

export interface WithdrawFeeEstimate {
  baseFeeXlm: number;
  priorityMultiplier: number;
  networkFeeXlm: number;
  serviceFeeAsset: number;
  totalAssetDeduction: number;
  estimatedReceiveAmount: number;
  estimatedConfirmationSeconds: number;
}

export interface WithdrawValidationResult {
  isValid: boolean;
  error?: string;
}

export interface WithdrawTransactionResult {
  id: string;
  hash: string;
  asset: WithdrawAssetCode;
  amount: string;
  destination: string;
  feeXlm: string;
  memo?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}
