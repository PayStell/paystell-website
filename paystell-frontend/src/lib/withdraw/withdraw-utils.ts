import { StrKey } from '@stellar/stellar-sdk';
import type {
  WithdrawAssetCode,
  WithdrawFeeEstimate,
  WithdrawFeePriority,
  WithdrawMemoType,
  WithdrawValidationResult,
} from '@/lib/types/withdraw';

export const STELLAR_BASE_FEE_XLM = 0.00001;
export const STELLAR_MIN_RESERVE_XLM = 1.0;
export const STELLAR_MIN_AMOUNT = 0.0000001;

const PRIORITY_MULTIPLIERS: Record<WithdrawFeePriority, { multiplier: number; seconds: number }> = {
  standard: { multiplier: 1, seconds: 5 },
  fast: { multiplier: 10, seconds: 3 },
  instant: { multiplier: 50, seconds: 2 },
};

export function validateWithdrawAmount(
  amountInput: string,
  availableBalance: number,
  asset: WithdrawAssetCode = 'XLM',
  feeXlm: number = STELLAR_BASE_FEE_XLM,
): WithdrawValidationResult {
  const trimmed = amountInput.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Withdrawal amount is required' };
  }

  if (!/^(\d+\.?\d*|\.\d+)$/.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid positive withdrawal amount' };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return { isValid: false, error: 'Please enter a valid positive withdrawal amount' };
  }

  if (parsed < STELLAR_MIN_AMOUNT) {
    return {
      isValid: false,
      error: `Minimum withdrawal amount is ${STELLAR_MIN_AMOUNT.toFixed(7)} ${asset}`,
    };
  }

  const decimalParts = trimmed.split('.');
  if (decimalParts.length === 2 && decimalParts[1].length > 7) {
    return {
      isValid: false,
      error: 'Stellar amounts support up to 7 decimal places (stroops)',
    };
  }

  const reserve = asset === 'XLM' ? STELLAR_MIN_RESERVE_XLM + feeXlm : 0;
  const maxSpendable = Math.max(0, Number((availableBalance - reserve).toFixed(7)));

  if (parsed > maxSpendable) {
    if (asset === 'XLM' && parsed <= availableBalance) {
      return {
        isValid: false,
        error: `Insufficient spendable XLM after ${STELLAR_MIN_RESERVE_XLM.toFixed(1)} XLM base reserve and network fee`,
      };
    }
    return {
      isValid: false,
      error: `Amount exceeds available balance (${maxSpendable.toFixed(4)} ${asset} spendable)`,
    };
  }

  return { isValid: true };
}

export function validateStellarDestination(
  destination: string,
  sourceAccount?: string | null,
): WithdrawValidationResult {
  const trimmed = destination.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Destination Stellar address is required' };
  }

  let isValidKey = false;
  try {
    isValidKey = StrKey.isValidEd25519PublicKey(trimmed);
  } catch {
    isValidKey = /^G[A-Z2-7]{55}$/.test(trimmed);
  }

  if (!isValidKey) {
    return {
      isValid: false,
      error:
        'Invalid Stellar public key (must start with G and contain 56 valid base32 characters)',
    };
  }

  if (sourceAccount && trimmed.toUpperCase() === sourceAccount.trim().toUpperCase()) {
    return {
      isValid: false,
      error: 'Destination address cannot be the same as your source wallet address',
    };
  }

  return { isValid: true };
}

export function validateWithdrawMemo(
  memoType: WithdrawMemoType,
  memoValue: string,
): WithdrawValidationResult {
  if (memoType === 'none') {
    return { isValid: true };
  }

  const trimmed = memoValue.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: `Please provide a value for the ${memoType.toUpperCase()} memo`,
    };
  }

  if (memoType === 'text') {
    const byteLength = new TextEncoder().encode(trimmed).length;
    if (byteLength > 28) {
      return {
        isValid: false,
        error: 'Stellar text memo cannot exceed 28 bytes',
      };
    }
    return { isValid: true };
  }

  if (memoType === 'id') {
    if (!/^\d+$/.test(trimmed)) {
      return {
        isValid: false,
        error: 'Stellar ID memo must be a positive unsigned 64-bit integer',
      };
    }
    try {
      const value = BigInt(trimmed);
      if (value < BigInt(0) || value > BigInt('18446744073709551615')) {
        return {
          isValid: false,
          error: 'Stellar ID memo exceeds maximum unsigned 64-bit integer range',
        };
      }
    } catch {
      return { isValid: false, error: 'Invalid Stellar ID memo format' };
    }
    return { isValid: true };
  }

  return { isValid: true };
}

export function calculateWithdrawFee(
  amountInput: string,
  asset: WithdrawAssetCode,
  priority: WithdrawFeePriority = 'standard',
): WithdrawFeeEstimate {
  const parsedAmount = Number.isFinite(Number(amountInput)) ? Math.max(0, Number(amountInput)) : 0;
  const tier = PRIORITY_MULTIPLIERS[priority] || PRIORITY_MULTIPLIERS.standard;
  const networkFeeXlm = Number((STELLAR_BASE_FEE_XLM * tier.multiplier).toFixed(7));
  const serviceFeeAsset = 0;
  const totalAssetDeduction =
    asset === 'XLM'
      ? Number((parsedAmount + networkFeeXlm + serviceFeeAsset).toFixed(7))
      : Number((parsedAmount + serviceFeeAsset).toFixed(7));

  return {
    baseFeeXlm: STELLAR_BASE_FEE_XLM,
    priorityMultiplier: tier.multiplier,
    networkFeeXlm,
    serviceFeeAsset,
    totalAssetDeduction,
    estimatedReceiveAmount: Number(parsedAmount.toFixed(7)),
    estimatedConfirmationSeconds: tier.seconds,
  };
}

export function validateTwoFactorCode(
  code: string,
  requireTwoFactor = false,
): WithdrawValidationResult {
  if (!requireTwoFactor) {
    return { isValid: true };
  }
  const trimmed = code.trim();
  if (!/^\d{6}$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid 6-digit 2FA verification code',
    };
  }
  return { isValid: true };
}

export function formatShortStellarAddress(address: string): string {
  const trimmed = address.trim();
  if (trimmed.length <= 12) return trimmed;
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-6)}`;
}
