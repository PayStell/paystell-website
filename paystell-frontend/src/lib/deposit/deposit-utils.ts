import { DepositQRData, DepositRequest } from '@/lib/types/deposit';

/**
 * Generate Stellar payment URI for deposits
 * Follows SEP-0007 standard for payment requests
 */
export function generateDepositURI(data: DepositQRData): string {
  const params = new URLSearchParams({
    destination: data.address,
    asset_code: data.asset === 'native' ? 'XLM' : data.asset,
  });

  if (data.amount) {
    params.append('amount', data.amount);
  }

  if (data.memo) {
    params.append('memo', data.memo);
    params.append('memo_type', 'text');
  }

  if (data.label) {
    params.append('label', data.label);
  }

  if (data.message) {
    params.append('message', data.message);
  }

  return `web+stellar:pay?${params.toString()}`;
}

/**
 * Generate QR code data for deposit requests
 */
export function generateDepositQRData(deposit: DepositRequest): string {
  const qrData: DepositQRData = {
    address: deposit.address,
    asset: deposit.asset,
    memo: deposit.memo,
    label: `Deposit to PayStell`,
    message: `Deposit ${deposit.amount || 'any amount'} ${deposit.asset}`,
  };

  if (deposit.amount) {
    qrData.amount = deposit.amount;
  }

  return generateDepositURI(qrData);
}

/**
 * Validate Stellar address format
 */
export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address);
}

/**
 * Format amount for display
 */
export function formatDepositAmount(amount: string, asset: string): string {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '0';

  // Format with appropriate decimal places
  if (asset === 'XLM' || asset === 'native') {
    return numAmount.toFixed(7);
  }

  return numAmount.toFixed(2);
}

/**
 * Check if deposit request has expired
 */
export function isDepositExpired(deposit: DepositRequest): boolean {
  return new Date(deposit.expiresAt) < new Date();
}

/**
 * Get deposit status color for UI
 */
export function getDepositStatusColor(status: DepositRequest['status']): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600';
    case 'completed':
      return 'text-green-600';
    case 'failed':
      return 'text-red-600';
    case 'expired':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get deposit status icon
 */
export function getDepositStatusIcon(status: DepositRequest['status']): string {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'completed':
      return '✅';
    case 'failed':
      return '❌';
    case 'expired':
      return '⏰';
    default:
      return '❓';
  }
}

/**
 * Generate unique deposit ID
 */
export function generateDepositId(): string {
  return `deposit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate deposit expiration time (24 hours from now)
 */
export function calculateDepositExpiration(): string {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  return expiration.toISOString();
}
