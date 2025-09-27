'use client';

import { server } from '@/lib/wallet/stellar-service';


/**
 * Types of Stellar operations that affect fee calculation
 */
export type OperationType =
  | 'payment'
  | 'createAccount'
  | 'pathPaymentStrictSend'
  | 'pathPaymentStrictReceive'
  | 'manageSellOffer'
  | 'manageBuyOffer'
  | 'createPassiveSellOffer'
  | 'setOptions'
  | 'changeTrust'
  | 'allowTrust'
  | 'accountMerge'
  | 'manageData'
  | 'bumpSequence'
  | 'createClaimableBalance'
  | 'claimClaimableBalance'
  | 'beginSponsoringFutureReserves'
  | 'endSponsoringFutureReserves'
  | 'revokeSponsorship'
  | 'clawback'
  | 'clawbackClaimableBalance'
  | 'setTrustLineFlags'
  | 'liquidityPoolDeposit'
  | 'liquidityPoolWithdraw';

/**
 * Fee calculation options
 */
export interface FeeCalculationOptions {
  /** Number of operations in the transaction */
  operationCount?: number;
  /** Type of operations (affects complexity) */
  operationTypes?: OperationType[];
  /** Whether to use network base fee or custom fee */
  useNetworkFee?: boolean;
  /** Custom base fee per operation in stroops */
  customBaseFee?: string;
  /** Fee bump multiplier for faster confirmation */
  feeBumpMultiplier?: number;
  /** Maximum fee willing to pay in stroops */
  maxFee?: string;
}

/**
 * Fee estimation result
 */
export interface FeeEstimation {
  /** Base fee per operation in stroops */
  baseFee: string;
  /** Total fee for all operations in stroops */
  totalFee: string;
  /** Fee in XLM (human-readable) */
  totalFeeXlm: string;
  /** USD equivalent if XLM price is provided */
  totalFeeUsd?: string;
  /** Network congestion level */
  congestionLevel: 'low' | 'medium' | 'high';
  /** Estimated confirmation time in seconds */
  estimatedConfirmationTime: number;
  /** Whether this is a custom or network fee */
  isCustomFee: boolean;
  /** Fee per operation breakdown */
  operationFees: Array<{
    type: OperationType;
    fee: string;
  }>;
}

/**
 * Network fee statistics
 */
export interface NetworkFeeStats {
  /** Minimum fee from recent transactions */
  min: string;
  /** Maximum fee from recent transactions */
  max: string;
  /** Median fee from recent transactions */
  median: string;
  /** Recommended fee for current network conditions */
  recommended: string;
  /** Last update timestamp */
  lastUpdated: Date;
}

/**
 * Default fee values in stroops (1 XLM = 10,000,000 stroops)
 */
export const DEFAULT_FEES = {
  /** Minimum base fee per operation (100 stroops = 0.00001 XLM) */
  MIN_BASE_FEE: '100',
  /** Default base fee per operation (10,000 stroops = 0.001 XLM) */
  DEFAULT_BASE_FEE: '10000',
  /** High priority fee per operation (100,000 stroops = 0.01 XLM) */
  HIGH_PRIORITY_FEE: '100000',
  /** Maximum reasonable fee (1,000,000 stroops = 0.1 XLM) */
  MAX_FEE: '1000000',
} as const;

/**
 * Operation complexity weights for fee estimation
 */
const OPERATION_COMPLEXITY: Record<OperationType, number> = {
  payment: 1,
  createAccount: 1,
  pathPaymentStrictSend: 2,
  pathPaymentStrictReceive: 2,
  manageSellOffer: 1.5,
  manageBuyOffer: 1.5,
  createPassiveSellOffer: 1.5,
  setOptions: 1,
  changeTrust: 1,
  allowTrust: 1,
  accountMerge: 1,
  manageData: 1,
  bumpSequence: 1,
  createClaimableBalance: 1.5,
  claimClaimableBalance: 1.5,
  beginSponsoringFutureReserves: 1,
  endSponsoringFutureReserves: 1,
  revokeSponsorship: 1,
  clawback: 1,
  clawbackClaimableBalance: 1,
  setTrustLineFlags: 1,
  liquidityPoolDeposit: 2,
  liquidityPoolWithdraw: 2,
};

/**
 * Get current network fee statistics
 */
export async function getNetworkFeeStats(): Promise<NetworkFeeStats> {
  try {
    // Get recent fee stats from Horizon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feeStats = await server.feeStats() as any;

    return {
      min: feeStats.min_accepted_fee,
      max: feeStats.max_fee.max,
      // Horizon exposes p50 for median; fallback to mode if p50 absent
      median: feeStats.fee_charged.p50 ?? feeStats.fee_charged.mode,
      recommended: feeStats.fee_charged.p95, // 95th percentile for reliable confirmation
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Failed to fetch network fee stats:', error);

    // Return default values if network request fails
    return {
      min: DEFAULT_FEES.MIN_BASE_FEE,
      max: DEFAULT_FEES.MAX_FEE,
      median: DEFAULT_FEES.DEFAULT_BASE_FEE,
      recommended: DEFAULT_FEES.DEFAULT_BASE_FEE,
      lastUpdated: new Date(),
    };
  }
}

/**
 * Calculate transaction fee based on operations and network conditions
 */
export async function calculateFee(
  options: FeeCalculationOptions = {},
  xlmPrice?: number
): Promise<FeeEstimation> {
  const {
    operationCount = 1,
    operationTypes = ['payment'],
    useNetworkFee = true,
    customBaseFee,
    feeBumpMultiplier = 1,
    maxFee,
  } = options;

  let baseFee: string = DEFAULT_FEES.DEFAULT_BASE_FEE;
  let isCustomFee = false;

  // Get network fee if requested
  if (useNetworkFee && !customBaseFee) {
    try {
      const feeStats = await getNetworkFeeStats();
      baseFee = feeStats.recommended;
    } catch (error) {
      console.warn('Using default fee due to network error:', error);
    }
  } else if (customBaseFee) {
    baseFee = customBaseFee;
    isCustomFee = true;
  }

  // Calculate complexity-adjusted fee
  let totalComplexity = 0;
  const operationFees: Array<{ type: OperationType; fee: string }> = [];

  for (let i = 0; i < operationCount; i++) {
    const operationType = operationTypes[i] || operationTypes[0] || 'payment';
    const complexity = OPERATION_COMPLEXITY[operationType] || 1;
    totalComplexity += complexity;

    const operationFee = Math.ceil(Number(baseFee) * complexity).toString();
    operationFees.push({
      type: operationType,
      fee: operationFee,
    });
  }

  // Apply fee bump multiplier
  const bumpedFeeNum = Math.ceil(Number(baseFee) * totalComplexity * feeBumpMultiplier);

  // Ensure minimum fee
  const minTotalFee = Number(DEFAULT_FEES.MIN_BASE_FEE) * operationCount;

  // Calculate max total fee (scale maxFee by operation count if provided, otherwise use Infinity)
  const maxTotalFeeOrInfinity = maxFee ? Number(maxFee) * operationCount : Infinity;

  // Clamp the bumped fee between min and max limits
  const totalFeeNum = Math.min(Math.max(bumpedFeeNum, minTotalFee), maxTotalFeeOrInfinity);
  const totalFee = totalFeeNum.toString();

  // Convert to XLM (1 XLM = 10,000,000 stroops)
  const totalFeeXlm = (Number(totalFee) / 10_000_000).toFixed(7);

  // Calculate USD equivalent if price is provided
  let totalFeeUsd: string | undefined;
  if (xlmPrice) {
    totalFeeUsd = (Number(totalFeeXlm) * xlmPrice).toFixed(4);
  }

  // Estimate congestion level and confirmation time
  const congestionLevel = getCongestionLevel(Number(baseFee));
  const estimatedConfirmationTime = getEstimatedConfirmationTime(congestionLevel);

  return {
    baseFee,
    totalFee,
    totalFeeXlm,
    totalFeeUsd,
    congestionLevel,
    estimatedConfirmationTime,
    isCustomFee,
    operationFees,
  };
}

/**
 * Estimate fee for a simple payment transaction
 */
export async function estimatePaymentFee(
  xlmPrice?: number,
  priority: 'low' | 'medium' | 'high' = 'medium'
): Promise<FeeEstimation> {
  const feeBumpMultiplier = {
    low: 1,
    medium: 1.5,
    high: 3,
  }[priority];

  return calculateFee({
    operationCount: 1,
    operationTypes: ['payment'],
    useNetworkFee: true,
    feeBumpMultiplier,
  }, xlmPrice);
}

/**
 * Estimate fee for a complex transaction with multiple operations
 */
export async function estimateComplexTransactionFee(
  operations: OperationType[],
  xlmPrice?: number,
  priority: 'low' | 'medium' | 'high' = 'medium'
): Promise<FeeEstimation> {
  const feeBumpMultiplier = {
    low: 1,
    medium: 1.5,
    high: 3,
  }[priority];

  return calculateFee({
    operationCount: operations.length,
    operationTypes: operations,
    useNetworkFee: true,
    feeBumpMultiplier,
  }, xlmPrice);
}

/**
 * Format fee amount for display
 */
export function formatFee(
  feeInStroops: string,
  options: {
    includeUnit?: boolean;
    precision?: number;
    inUsd?: boolean;
    xlmPrice?: number;
  } = {}
): string {
  const {
    includeUnit = true,
    precision = 7,
    inUsd = false,
    xlmPrice,
  } = options;

  const feeInXlm = Number(feeInStroops) / 10_000_000;

  if (inUsd && xlmPrice) {
    const feeInUsdValue = feeInXlm * xlmPrice;
    return includeUnit
      ? `$${feeInUsdValue.toFixed(4)} USD`
      : feeInUsdValue.toFixed(4);
  }

  return includeUnit
    ? `${feeInXlm.toFixed(precision)} XLM`
    : feeInXlm.toFixed(precision);
}

/**
 * Get congestion level based on fee amount
 */
function getCongestionLevel(baseFee: number): 'low' | 'medium' | 'high' {
  if (baseFee <= Number(DEFAULT_FEES.MIN_BASE_FEE) * 2) {
    return 'low';
  } else if (baseFee <= Number(DEFAULT_FEES.DEFAULT_BASE_FEE) * 5) {
    return 'medium';
  } else {
    return 'high';
  }
}

/**
 * Get estimated confirmation time based on congestion
 */
function getEstimatedConfirmationTime(congestionLevel: 'low' | 'medium' | 'high'): number {
  switch (congestionLevel) {
    case 'low':
      return 5; // 5 seconds
    case 'medium':
      return 8; // 8 seconds
    case 'high':
      return 15; // 15 seconds
    default:
      return 5;
  }
}

/**
 * Validate if a fee amount is reasonable
 */
export function validateFee(
  feeInStroops: string,
  operationCount: number = 1
): {
  isValid: boolean;
  error?: string;
  warning?: string;
} {
  const fee = Number(feeInStroops);
  const minFee = Number(DEFAULT_FEES.MIN_BASE_FEE) * operationCount;
  const maxFee = Number(DEFAULT_FEES.MAX_FEE);

  if (fee < minFee) {
    return {
      isValid: false,
      error: `Fee too low. Minimum fee is ${formatFee(minFee.toString())}`,
    };
  }

  if (fee > maxFee) {
    return {
      isValid: false,
      error: `Fee too high. Maximum recommended fee is ${formatFee(maxFee.toString())}`,
    };
  }

  const reasonableFee = Number(DEFAULT_FEES.DEFAULT_BASE_FEE) * operationCount * 10;
  if (fee > reasonableFee) {
    return {
      isValid: true,
      warning: `Fee is unusually high. Consider using ${formatFee(reasonableFee.toString())} or less.`,
    };
  }

  return { isValid: true };
}