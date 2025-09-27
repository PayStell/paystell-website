'use client';

import { toast } from 'sonner';

/**
 * Extended payment error types for transaction-specific scenarios
 */
export type TransactionErrorType =
  | 'WALLET_ERROR'
  | 'TRANSACTION_ERROR'
  | 'VERIFICATION_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'INSUFFICIENT_FUNDS_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'TIMEOUT_ERROR'
  | 'USER_REJECTION_ERROR'
  | 'ACCOUNT_ERROR'
  | 'FEE_ERROR'
  | 'MEMO_ERROR'
  | 'DESTINATION_ERROR'
  | 'SEQUENCE_ERROR';

/**
 * Specific error codes for different transaction failure scenarios
 */
export type TransactionErrorCode =
  // Wallet errors
  | 'WALLET_NOT_CONNECTED'
  | 'WALLET_NOT_FOUND'
  | 'WALLET_CONNECTION_FAILED'
  | 'WALLET_DISCONNECTED'
  | 'WALLET_LOCKED'
  | 'WALLET_PERMISSION_DENIED'

  // Transaction creation errors
  | 'INVALID_AMOUNT'
  | 'INVALID_DESTINATION'
  | 'INVALID_MEMO'
  | 'INVALID_FEE'
  | 'TRANSACTION_BUILD_FAILED'
  | 'TRANSACTION_TOO_LARGE'

  // Account errors
  | 'SOURCE_ACCOUNT_NOT_FOUND'
  | 'DESTINATION_ACCOUNT_NOT_FOUND'
  | 'ACCOUNT_NOT_FUNDED'
  | 'INSUFFICIENT_BALANCE'
  | 'BELOW_MINIMUM_BALANCE'
  | 'TRUST_LINE_MISSING'
  | 'TRUST_LINE_NOT_AUTHORIZED'

  // Network/submission errors
  | 'NETWORK_UNAVAILABLE'
  | 'SUBMISSION_FAILED'
  | 'TRANSACTION_REJECTED'
  | 'SEQUENCE_NUMBER_ERROR'
  | 'FEE_TOO_LOW'
  | 'FEE_TOO_HIGH'
  | 'TIMEOUT'
  | 'RATE_LIMITED'

  // User interaction errors
  | 'USER_CANCELLED'
  | 'USER_REJECTED_TRANSACTION'
  | 'SIGNING_FAILED'

  // Verification errors
  | 'VERIFICATION_FAILED'
  | 'CONFIRMATION_TIMEOUT'
  | 'UNEXPECTED_TRANSACTION_RESULT'

  // Generic errors
  | 'UNKNOWN_ERROR'
  | 'INTERNAL_ERROR';

/**
 * Extended PaymentError interface with transaction-specific fields
 */
export interface TransactionError {
  type: TransactionErrorType;
  code: TransactionErrorCode;
  message: string;
  details?: string;
  recoverable: boolean;
  retryable: boolean;
  recoveryActions?: RecoveryAction[];
  context?: {
    transactionId?: string;
    stepName?: string;
    sourceAccount?: string;
    destinationAccount?: string;
    amount?: string;
    asset?: string;
    networkPassphrase?: string;
  };
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Recovery action suggestions for different error types
 */
export interface RecoveryAction {
  id: string;
  label: string;
  description: string;
  actionType: 'retry' | 'reconnect' | 'navigate' | 'refresh' | 'contact_support' | 'manual';
  buttonText: string;
  href?: string;
  callback?: () => void | Promise<void>;
  primary?: boolean;
}

/**
 * Error context for transaction flows
 */
export interface TransactionErrorContext {
  transactionId?: string;
  stepName?: string;
  flow?: 'deposit' | 'withdraw' | 'transfer' | 'swap' | 'payment';
  sourceAccount?: string;
  destinationAccount?: string;
  amount?: string;
  asset?: string;
  fee?: string;
  memo?: string;
  networkPassphrase?: string;
  attemptNumber?: number;
  userAgent?: string;
  timestamp?: Date;
}

/**
 * User-friendly error messages mapping
 */
const ERROR_MESSAGES: Record<TransactionErrorCode, {
  title: string;
  message: string;
  details?: string;
}> = {
  // Wallet errors
  WALLET_NOT_CONNECTED: {
    title: 'Wallet Not Connected',
    message: 'Please connect your wallet to continue.',
    details: 'Click the "Connect Wallet" button to access your Stellar account.',
  },
  WALLET_NOT_FOUND: {
    title: 'Wallet Not Found',
    message: 'No compatible wallet was found.',
    details: 'Please install Freighter or another Stellar wallet extension.',
  },
  WALLET_CONNECTION_FAILED: {
    title: 'Connection Failed',
    message: 'Failed to connect to your wallet.',
    details: 'Please check your wallet settings and try again.',
  },
  WALLET_DISCONNECTED: {
    title: 'Wallet Disconnected',
    message: 'Your wallet was disconnected during the transaction.',
    details: 'Please reconnect your wallet and try again.',
  },
  WALLET_LOCKED: {
    title: 'Wallet Locked',
    message: 'Your wallet is locked.',
    details: 'Please unlock your wallet and try again.',
  },
  WALLET_PERMISSION_DENIED: {
    title: 'Permission Denied',
    message: 'Access to your wallet was denied.',
    details: 'Please grant permission to this website in your wallet settings.',
  },

  // Transaction creation errors
  INVALID_AMOUNT: {
    title: 'Invalid Amount',
    message: 'The transaction amount is invalid.',
    details: 'Please enter a valid positive amount with up to 7 decimal places.',
  },
  INVALID_DESTINATION: {
    title: 'Invalid Destination',
    message: 'The destination address is invalid.',
    details: 'Please enter a valid Stellar public key starting with "G".',
  },
  INVALID_MEMO: {
    title: 'Invalid Memo',
    message: 'The transaction memo is invalid.',
    details: 'Memo must be less than 28 characters for text memos.',
  },
  INVALID_FEE: {
    title: 'Invalid Fee',
    message: 'The transaction fee is invalid.',
    details: 'Please use a reasonable fee amount.',
  },
  TRANSACTION_BUILD_FAILED: {
    title: 'Transaction Build Failed',
    message: 'Failed to create the transaction.',
    details: 'There was an error building your transaction. Please try again.',
  },
  TRANSACTION_TOO_LARGE: {
    title: 'Transaction Too Large',
    message: 'The transaction size exceeds network limits.',
    details: 'Try reducing the number of operations or memo size.',
  },

  // Account errors
  SOURCE_ACCOUNT_NOT_FOUND: {
    title: 'Account Not Found',
    message: 'Your account was not found on the network.',
    details: 'Please ensure your account is funded and activated.',
  },
  DESTINATION_ACCOUNT_NOT_FOUND: {
    title: 'Destination Not Found',
    message: 'The destination account was not found.',
    details: 'The recipient account may not be activated. They need to receive XLM first.',
  },
  ACCOUNT_NOT_FUNDED: {
    title: 'Account Not Funded',
    message: 'The account has not been funded yet.',
    details: 'Stellar accounts must be funded with at least 1 XLM to be activated.',
  },
  INSUFFICIENT_BALANCE: {
    title: 'Insufficient Balance',
    message: 'Your account balance is too low for this transaction.',
    details: 'Please add more funds or reduce the transaction amount.',
  },
  BELOW_MINIMUM_BALANCE: {
    title: 'Below Minimum Balance',
    message: 'This transaction would leave your account below the minimum balance.',
    details: 'Stellar accounts must maintain a minimum balance of 1 XLM.',
  },
  TRUST_LINE_MISSING: {
    title: 'Trust Line Missing',
    message: 'A required trust line is missing.',
    details: 'You need to establish a trust line for this asset before receiving it.',
  },
  TRUST_LINE_NOT_AUTHORIZED: {
    title: 'Trust Line Not Authorized',
    message: 'The trust line is not authorized.',
    details: 'The asset issuer has not authorized your account for this asset.',
  },

  // Network/submission errors
  NETWORK_UNAVAILABLE: {
    title: 'Network Unavailable',
    message: 'The Stellar network is currently unavailable.',
    details: 'Please check your internet connection and try again later.',
  },
  SUBMISSION_FAILED: {
    title: 'Submission Failed',
    message: 'Failed to submit the transaction to the network.',
    details: 'The transaction could not be submitted. Please try again.',
  },
  TRANSACTION_REJECTED: {
    title: 'Transaction Rejected',
    message: 'The transaction was rejected by the network.',
    details: 'Please check the transaction details and try again.',
  },
  SEQUENCE_NUMBER_ERROR: {
    title: 'Sequence Error',
    message: 'Transaction sequence number is incorrect.',
    details: 'Another transaction may have been processed. Please retry.',
  },
  FEE_TOO_LOW: {
    title: 'Fee Too Low',
    message: 'The transaction fee is too low.',
    details: 'Increase the fee to ensure faster processing.',
  },
  FEE_TOO_HIGH: {
    title: 'Fee Too High',
    message: 'The transaction fee is unusually high.',
    details: 'You may want to reduce the fee to save costs.',
  },
  TIMEOUT: {
    title: 'Transaction Timeout',
    message: 'The transaction timed out.',
    details: 'The transaction took too long to process. Please try again.',
  },
  RATE_LIMITED: {
    title: 'Rate Limited',
    message: 'Too many requests. Please wait before trying again.',
    details: 'You have exceeded the rate limit. Please wait a moment.',
  },

  // User interaction errors
  USER_CANCELLED: {
    title: 'Transaction Cancelled',
    message: 'You cancelled the transaction.',
    details: 'The transaction was cancelled by your request.',
  },
  USER_REJECTED_TRANSACTION: {
    title: 'Transaction Rejected',
    message: 'You rejected the transaction in your wallet.',
    details: 'The transaction was rejected in your wallet. Try again if this was unintentional.',
  },
  SIGNING_FAILED: {
    title: 'Signing Failed',
    message: 'Failed to sign the transaction.',
    details: 'There was an error signing the transaction with your wallet.',
  },

  // Verification errors
  VERIFICATION_FAILED: {
    title: 'Verification Failed',
    message: 'Could not verify the transaction result.',
    details: 'The transaction may have been processed, but verification failed.',
  },
  CONFIRMATION_TIMEOUT: {
    title: 'Confirmation Timeout',
    message: 'Transaction confirmation timed out.',
    details: 'The transaction may still be processing. Check your transaction history.',
  },
  UNEXPECTED_TRANSACTION_RESULT: {
    title: 'Unexpected Result',
    message: 'The transaction result was unexpected.',
    details: 'The transaction completed but with an unexpected result.',
  },

  // Generic errors
  UNKNOWN_ERROR: {
    title: 'Unknown Error',
    message: 'An unknown error occurred.',
    details: 'Something went wrong. Please try again or contact support.',
  },
  INTERNAL_ERROR: {
    title: 'Internal Error',
    message: 'An internal system error occurred.',
    details: 'Please try again later or contact support if the problem persists.',
  },
};

/**
 * Recovery actions for different error types
 */
const RECOVERY_ACTIONS: Record<TransactionErrorCode, RecoveryAction[]> = {
  WALLET_NOT_CONNECTED: [
    {
      id: 'connect_wallet',
      label: 'Connect Wallet',
      description: 'Connect your Stellar wallet to continue',
      actionType: 'reconnect',
      buttonText: 'Connect Wallet',
      primary: true,
    },
  ],
  WALLET_NOT_FOUND: [
    {
      id: 'install_freighter',
      label: 'Install Freighter',
      description: 'Install the Freighter wallet extension',
      actionType: 'navigate',
      buttonText: 'Install Freighter',
      href: 'https://freighter.app/',
      primary: true,
    },
    {
      id: 'refresh_page',
      label: 'Refresh Page',
      description: 'Refresh the page if you just installed a wallet',
      actionType: 'refresh',
      buttonText: 'Refresh',
    },
  ],
  WALLET_CONNECTION_FAILED: [
    {
      id: 'retry_connection',
      label: 'Retry Connection',
      description: 'Try connecting to your wallet again',
      actionType: 'retry',
      buttonText: 'Retry',
      primary: true,
    },
    {
      id: 'check_wallet',
      label: 'Check Wallet',
      description: 'Ensure your wallet is unlocked and accessible',
      actionType: 'manual',
      buttonText: 'Check Wallet',
    },
  ],
  INSUFFICIENT_BALANCE: [
    {
      id: 'add_funds',
      label: 'Add Funds',
      description: 'Add more XLM to your account',
      actionType: 'manual',
      buttonText: 'Add Funds',
      primary: true,
    },
    {
      id: 'reduce_amount',
      label: 'Reduce Amount',
      description: 'Enter a smaller transaction amount',
      actionType: 'manual',
      buttonText: 'Adjust Amount',
    },
  ],
  INVALID_DESTINATION: [
    {
      id: 'fix_address',
      label: 'Fix Address',
      description: 'Enter a valid Stellar public key',
      actionType: 'manual',
      buttonText: 'Fix Address',
      primary: true,
    },
  ],
  USER_REJECTED_TRANSACTION: [
    {
      id: 'try_again',
      label: 'Try Again',
      description: 'Approve the transaction in your wallet',
      actionType: 'retry',
      buttonText: 'Try Again',
      primary: true,
    },
  ],
  NETWORK_UNAVAILABLE: [
    {
      id: 'retry_later',
      label: 'Retry Later',
      description: 'Try again when the network is available',
      actionType: 'retry',
      buttonText: 'Retry',
      primary: true,
    },
    {
      id: 'check_status',
      label: 'Network Status',
      description: 'Check Stellar network status',
      actionType: 'navigate',
      buttonText: 'Check Status',
      href: 'https://status.stellar.org/',
    },
  ],
  FEE_TOO_LOW: [
    {
      id: 'increase_fee',
      label: 'Increase Fee',
      description: 'Use a higher fee for faster processing',
      actionType: 'manual',
      buttonText: 'Increase Fee',
      primary: true,
    },
  ],
  // Default action for errors without specific recovery actions
  WALLET_DISCONNECTED: [{
    id: 'reconnect',
    label: 'Reconnect',
    description: 'Reconnect your wallet',
    actionType: 'reconnect',
    buttonText: 'Reconnect',
    primary: true,
  }],
  WALLET_LOCKED: [{
    id: 'unlock_wallet',
    label: 'Unlock Wallet',
    description: 'Unlock your wallet and try again',
    actionType: 'manual',
    buttonText: 'Unlock Wallet',
    primary: true,
  }],
  WALLET_PERMISSION_DENIED: [{
    id: 'grant_permission',
    label: 'Grant Permission',
    description: 'Allow access in your wallet settings',
    actionType: 'manual',
    buttonText: 'Grant Permission',
    primary: true,
  }],
  INVALID_AMOUNT: [{
    id: 'fix_amount',
    label: 'Fix Amount',
    description: 'Enter a valid amount',
    actionType: 'manual',
    buttonText: 'Fix Amount',
    primary: true,
  }],
  INVALID_MEMO: [{
    id: 'fix_memo',
    label: 'Fix Memo',
    description: 'Enter a valid memo',
    actionType: 'manual',
    buttonText: 'Fix Memo',
    primary: true,
  }],
  INVALID_FEE: [{
    id: 'fix_fee',
    label: 'Fix Fee',
    description: 'Use a reasonable fee amount',
    actionType: 'manual',
    buttonText: 'Fix Fee',
    primary: true,
  }],
  TRANSACTION_BUILD_FAILED: [{
    id: 'retry_build',
    label: 'Retry',
    description: 'Try building the transaction again',
    actionType: 'retry',
    buttonText: 'Retry',
    primary: true,
  }],
  TRANSACTION_TOO_LARGE: [{
    id: 'simplify_transaction',
    label: 'Simplify',
    description: 'Reduce transaction complexity',
    actionType: 'manual',
    buttonText: 'Simplify',
    primary: true,
  }],
  SOURCE_ACCOUNT_NOT_FOUND: [{
    id: 'fund_account',
    label: 'Fund Account',
    description: 'Fund your account with XLM',
    actionType: 'manual',
    buttonText: 'Fund Account',
    primary: true,
  }],
  DESTINATION_ACCOUNT_NOT_FOUND: [{
    id: 'notify_recipient',
    label: 'Notify Recipient',
    description: 'Ask recipient to activate their account',
    actionType: 'manual',
    buttonText: 'Continue Anyway',
    primary: true,
  }],
  ACCOUNT_NOT_FUNDED: [{
    id: 'fund_account',
    label: 'Fund Account',
    description: 'Add at least 1 XLM to activate',
    actionType: 'manual',
    buttonText: 'Fund Account',
    primary: true,
  }],
  BELOW_MINIMUM_BALANCE: [{
    id: 'adjust_amount',
    label: 'Adjust Amount',
    description: 'Leave at least 1 XLM in account',
    actionType: 'manual',
    buttonText: 'Adjust Amount',
    primary: true,
  }],
  TRUST_LINE_MISSING: [{
    id: 'add_trustline',
    label: 'Add Trust Line',
    description: 'Establish trust line for this asset',
    actionType: 'manual',
    buttonText: 'Add Trust Line',
    primary: true,
  }],
  TRUST_LINE_NOT_AUTHORIZED: [{
    id: 'contact_issuer',
    label: 'Contact Issuer',
    description: 'Contact the asset issuer for authorization',
    actionType: 'contact_support',
    buttonText: 'Contact Issuer',
    primary: true,
  }],
  SUBMISSION_FAILED: [{
    id: 'retry_submission',
    label: 'Retry',
    description: 'Try submitting again',
    actionType: 'retry',
    buttonText: 'Retry',
    primary: true,
  }],
  TRANSACTION_REJECTED: [{
    id: 'check_details',
    label: 'Check Details',
    description: 'Verify transaction details',
    actionType: 'manual',
    buttonText: 'Check Details',
    primary: true,
  }],
  SEQUENCE_NUMBER_ERROR: [{
    id: 'retry_transaction',
    label: 'Retry',
    description: 'Retry with updated sequence',
    actionType: 'retry',
    buttonText: 'Retry',
    primary: true,
  }],
  FEE_TOO_HIGH: [{
    id: 'reduce_fee',
    label: 'Reduce Fee',
    description: 'Use a lower fee amount',
    actionType: 'manual',
    buttonText: 'Reduce Fee',
    primary: true,
  }],
  TIMEOUT: [{
    id: 'retry_timeout',
    label: 'Retry',
    description: 'Try the transaction again',
    actionType: 'retry',
    buttonText: 'Retry',
    primary: true,
  }],
  RATE_LIMITED: [{
    id: 'wait_retry',
    label: 'Wait and Retry',
    description: 'Wait a moment before retrying',
    actionType: 'retry',
    buttonText: 'Retry',
    primary: true,
  }],
  USER_CANCELLED: [{
    id: 'start_over',
    label: 'Start Over',
    description: 'Begin the transaction again',
    actionType: 'retry',
    buttonText: 'Start Over',
    primary: true,
  }],
  SIGNING_FAILED: [{
    id: 'retry_signing',
    label: 'Retry',
    description: 'Try signing again',
    actionType: 'retry',
    buttonText: 'Retry',
    primary: true,
  }],
  VERIFICATION_FAILED: [{
    id: 'check_history',
    label: 'Check History',
    description: 'Check your transaction history',
    actionType: 'manual',
    buttonText: 'Check History',
    primary: true,
  }],
  CONFIRMATION_TIMEOUT: [{
    id: 'check_status',
    label: 'Check Status',
    description: 'Check if transaction was processed',
    actionType: 'manual',
    buttonText: 'Check Status',
    primary: true,
  }],
  UNEXPECTED_TRANSACTION_RESULT: [{
    id: 'contact_support',
    label: 'Contact Support',
    description: 'Get help with this issue',
    actionType: 'contact_support',
    buttonText: 'Contact Support',
    primary: true,
  }],
  UNKNOWN_ERROR: [{
    id: 'retry_unknown',
    label: 'Retry',
    description: 'Try the operation again',
    actionType: 'retry',
    buttonText: 'Retry',
    primary: true,
  }],
  INTERNAL_ERROR: [{
    id: 'contact_support',
    label: 'Contact Support',
    description: 'Report this issue to support',
    actionType: 'contact_support',
    buttonText: 'Contact Support',
    primary: true,
  }],
};

/**
 * Create a standardized transaction error
 */
export function createTransactionError(
  code: TransactionErrorCode,
  context?: TransactionErrorContext,
  overrides?: Partial<TransactionError>
): TransactionError {
  const errorInfo = ERROR_MESSAGES[code];
  const recoveryActions = RECOVERY_ACTIONS[code] || [];

  const errorType = getErrorTypeFromCode(code);
  const severity = getErrorSeverity(code);

  return {
    type: errorType,
    code,
    message: errorInfo.message,
    details: errorInfo.details,
    recoverable: recoveryActions.length > 0,
    retryable: recoveryActions.some(action => action.actionType === 'retry'),
    recoveryActions,
    context,
    timestamp: new Date(),
    severity,
    ...overrides,
  };
}

/**
 * Get error type based on error code
 */
function getErrorTypeFromCode(code: TransactionErrorCode): TransactionErrorType {
  if (code.startsWith('WALLET_')) return 'WALLET_ERROR';
  if (code.includes('ACCOUNT') || code.includes('BALANCE') || code.includes('TRUST')) return 'ACCOUNT_ERROR';
  if (code.includes('NETWORK') || code.includes('SUBMISSION') || code.includes('RATE')) return 'NETWORK_ERROR';
  if (code.includes('INVALID') || code.includes('TOO_')) return 'VALIDATION_ERROR';
  if (code.includes('INSUFFICIENT')) return 'INSUFFICIENT_FUNDS_ERROR';
  if (code.includes('USER_') || code.includes('SIGNING')) return 'USER_REJECTION_ERROR';
  if (code.includes('VERIFICATION') || code.includes('CONFIRMATION')) return 'VERIFICATION_ERROR';
  if (code.includes('TIMEOUT')) return 'TIMEOUT_ERROR';
  if (code.includes('FEE')) return 'FEE_ERROR';
  if (code.includes('MEMO')) return 'MEMO_ERROR';
  if (code.includes('DESTINATION')) return 'DESTINATION_ERROR';
  if (code.includes('SEQUENCE')) return 'SEQUENCE_ERROR';
  return 'TRANSACTION_ERROR';
}

/**
 * Get error severity based on error code
 */
function getErrorSeverity(code: TransactionErrorCode): 'low' | 'medium' | 'high' | 'critical' {
  const criticalErrors: TransactionErrorCode[] = [
    'ACCOUNT_NOT_FUNDED',
    'INSUFFICIENT_BALANCE',
    'NETWORK_UNAVAILABLE',
    'INTERNAL_ERROR',
  ];

  const highErrors: TransactionErrorCode[] = [
    'WALLET_NOT_CONNECTED',
    'TRANSACTION_REJECTED',
    'SUBMISSION_FAILED',
    'VERIFICATION_FAILED',
  ];

  const lowErrors: TransactionErrorCode[] = [
    'USER_CANCELLED',
    'USER_REJECTED_TRANSACTION',
    'FEE_TOO_HIGH',
    'RATE_LIMITED',
  ];

  if (criticalErrors.includes(code)) return 'critical';
  if (highErrors.includes(code)) return 'high';
  if (lowErrors.includes(code)) return 'low';
  return 'medium';
}

/**
 * Handle transaction error with appropriate user feedback
 */
export function handleTransactionError(
  error: TransactionError | Error | unknown,
  context?: TransactionErrorContext
): TransactionError {
  let transactionError: TransactionError;

  if (error instanceof Error) {
    // Try to map common error messages to specific codes
    const code = mapErrorMessageToCode(error.message);
    transactionError = createTransactionError(code, context, {
      message: error.message,
      details: error.stack,
    });
  } else if (typeof error === 'object' && error !== null && 'code' in error) {
    transactionError = error as TransactionError;
  } else {
    transactionError = createTransactionError('UNKNOWN_ERROR', context, {
      message: String(error),
    });
  }

  // Show appropriate toast notification
  showErrorToast(transactionError);

  // Log error for debugging
  console.error('Transaction error:', transactionError);

  return transactionError;
}

/**
 * Map common error messages to specific error codes
 */
function mapErrorMessageToCode(message: string): TransactionErrorCode {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('wallet not connected')) return 'WALLET_NOT_CONNECTED';
  if (lowerMessage.includes('user cancelled') || lowerMessage.includes('user denied')) return 'USER_CANCELLED';
  if (lowerMessage.includes('insufficient')) return 'INSUFFICIENT_BALANCE';
  if (lowerMessage.includes('timeout')) return 'TIMEOUT';
  if (lowerMessage.includes('network')) return 'NETWORK_UNAVAILABLE';
  if (lowerMessage.includes('sequence')) return 'SEQUENCE_NUMBER_ERROR';
  if (lowerMessage.includes('fee')) return 'FEE_TOO_LOW';
  if (lowerMessage.includes('destination')) return 'INVALID_DESTINATION';
  if (lowerMessage.includes('signing')) return 'SIGNING_FAILED';

  return 'UNKNOWN_ERROR';
}

/**
 * Show error toast notification based on error severity
 */
function showErrorToast(error: TransactionError) {
  const errorInfo = ERROR_MESSAGES[error.code];
  const duration = error.severity === 'critical' ? 10000 : error.severity === 'high' ? 7000 : 5000;

  toast.error(errorInfo.title, {
    description: error.message,
    duration,
    action: error.recoveryActions?.[0] ? {
      label: error.recoveryActions[0].buttonText,
      onClick: error.recoveryActions[0].callback || (() => {}),
    } : undefined,
  });
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(code: TransactionErrorCode): {
  title: string;
  message: string;
  details?: string;
} {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Get recovery actions for an error code
 */
export function getRecoveryActions(code: TransactionErrorCode): RecoveryAction[] {
  return RECOVERY_ACTIONS[code] || [];
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: TransactionError): boolean {
  return error.retryable || error.recoveryActions?.some(action => action.actionType === 'retry') || false;
}

/**
 * Check if an error is recoverable
 */
export function isRecoverableError(error: TransactionError): boolean {
  return error.recoverable;
}