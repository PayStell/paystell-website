'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { PaymentState } from '@/lib/types/payment';
import type { TransactionStepData } from '@/types/stepper';
import type { TransactionError, TransactionErrorContext } from './errors';
import { handleTransactionError } from './errors';

/**
 * Extended transaction states for comprehensive flow tracking
 */
export type TransactionState =
  | PaymentState
  | 'BUILDING'
  | 'REVIEWING'
  | 'CONFIRMING'
  | 'BROADCASTING'
  | 'CONFIRMING_NETWORK'
  | 'FINALIZING'
  | 'CANCELLED'
  | 'EXPIRED';

/**
 * Transaction types supported by the system
 */
export type TransactionType =
  | 'payment'
  | 'deposit'
  | 'withdraw'
  | 'transfer'
  | 'swap'
  | 'trust_line'
  | 'account_merge';

/**
 * Transaction priority levels
 */
export type TransactionPriority = 'low' | 'medium' | 'high';

/**
 * Transaction history entry
 */
export interface TransactionHistoryEntry {
  id: string;
  type: TransactionType;
  state: TransactionState;
  amount: string;
  asset: string;
  sourceAccount: string;
  destinationAccount?: string;
  memo?: string;
  fee: string;
  hash?: string;
  ledger?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  expiresAt?: string;
  error?: TransactionError;
  metadata?: Record<string, unknown>;
}

/**
 * Active transaction being processed
 */
export interface ActiveTransaction {
  id: string;
  type: TransactionType;
  state: TransactionState;
  stepData: TransactionStepData;
  currentStep: number;
  totalSteps: number;
  priority: TransactionPriority;
  xdr?: string;
  hash?: string;
  ledger?: number;
  fee?: string;
  error?: TransactionError;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  retryCount: number;
  maxRetries: number;
  context?: TransactionErrorContext;
  metadata?: Record<string, unknown>;
}

/**
 * Transaction flow configuration
 */
export interface TransactionFlowConfig {
  type: TransactionType;
  steps: string[];
  maxRetries: number;
  timeout: number;
  requiresConfirmation: boolean;
  estimatedDuration: number;
}

/**
 * Transaction statistics
 */
export interface TransactionStats {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  successRate: number;
  averageDuration: number;
  lastActivity?: string;
}

/**
 * Transaction store state
 */
interface TransactionStoreState {
  // Active transaction
  activeTransaction: ActiveTransaction | null;

  // Transaction history
  history: TransactionHistoryEntry[];
  historyLoading: boolean;
  historyError: string | null;

  // Statistics
  stats: TransactionStats;

  // UI state
  isModalOpen: boolean;
  currentStep: number;
  showAdvancedOptions: boolean;

  // Configuration
  flowConfigs: Record<TransactionType, TransactionFlowConfig>;
  defaultPriority: TransactionPriority;
  autoRetry: boolean;

  // Error handling
  lastError: TransactionError | null;
  retryQueue: string[];
}

/**
 * Transaction store actions
 */
interface TransactionStoreActions {
  // Transaction lifecycle
  startTransaction: (
    type: TransactionType,
    stepData: TransactionStepData,
    config?: Partial<TransactionFlowConfig>,
  ) => string;
  updateTransaction: (id: string, updates: Partial<ActiveTransaction>) => void;
  updateTransactionState: (id: string, state: TransactionState) => void;
  updateTransactionStep: (id: string, step: number) => void;
  updateStepData: (id: string, stepData: Partial<TransactionStepData>) => void;
  completeTransaction: (id: string, result: { hash?: string; ledger?: number }) => void;
  failTransaction: (id: string, error: TransactionError | Error | unknown) => void;
  cancelTransaction: (id: string, reason?: string) => void;
  retryTransaction: (id: string) => void;

  // History management
  loadHistory: (limit?: number, offset?: number) => Promise<void>;
  clearHistory: () => void;
  removeHistoryEntry: (id: string) => void;

  // Error handling
  clearError: () => void;
  addToRetryQueue: (id: string) => void;
  removeFromRetryQueue: (id: string) => void;
  processRetryQueue: () => Promise<void>;

  // UI state
  openModal: () => void;
  closeModal: () => void;
  setCurrentStep: (step: number) => void;
  toggleAdvancedOptions: () => void;

  // Configuration
  updateFlowConfig: (type: TransactionType, config: Partial<TransactionFlowConfig>) => void;
  setDefaultPriority: (priority: TransactionPriority) => void;
  setAutoRetry: (enabled: boolean) => void;

  // Statistics
  updateStats: () => void;

  // Cleanup
  cleanup: () => void;
  reset: () => void;
}

/**
 * Default flow configurations for different transaction types
 */
const DEFAULT_FLOW_CONFIGS: Record<TransactionType, TransactionFlowConfig> = {
  payment: {
    type: 'payment',
    steps: ['amount', 'destination', 'review', 'sign', 'submit'],
    maxRetries: 3,
    timeout: 30000,
    requiresConfirmation: true,
    estimatedDuration: 10,
  },
  deposit: {
    type: 'deposit',
    steps: ['amount', 'source', 'review', 'sign', 'submit'],
    maxRetries: 3,
    timeout: 45000,
    requiresConfirmation: true,
    estimatedDuration: 15,
  },
  withdraw: {
    type: 'withdraw',
    steps: ['amount', 'destination', 'verification', 'review', 'sign', 'submit'],
    maxRetries: 2,
    timeout: 60000,
    requiresConfirmation: true,
    estimatedDuration: 20,
  },
  transfer: {
    type: 'transfer',
    steps: ['amount', 'destination', 'review', 'sign', 'submit'],
    maxRetries: 3,
    timeout: 30000,
    requiresConfirmation: true,
    estimatedDuration: 10,
  },
  swap: {
    type: 'swap',
    steps: ['assets', 'amounts', 'slippage', 'review', 'sign', 'submit'],
    maxRetries: 2,
    timeout: 45000,
    requiresConfirmation: true,
    estimatedDuration: 25,
  },
  trust_line: {
    type: 'trust_line',
    steps: ['asset', 'limit', 'review', 'sign', 'submit'],
    maxRetries: 3,
    timeout: 30000,
    requiresConfirmation: true,
    estimatedDuration: 8,
  },
  account_merge: {
    type: 'account_merge',
    steps: ['destination', 'confirmation', 'review', 'sign', 'submit'],
    maxRetries: 1,
    timeout: 60000,
    requiresConfirmation: true,
    estimatedDuration: 30,
  },
};

/**
 * Initial state
 */
const initialState: TransactionStoreState = {
  activeTransaction: null,
  history: [],
  historyLoading: false,
  historyError: null,
  stats: {
    total: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    successRate: 0,
    averageDuration: 0,
  },
  isModalOpen: false,
  currentStep: 0,
  showAdvancedOptions: false,
  flowConfigs: DEFAULT_FLOW_CONFIGS,
  defaultPriority: 'medium',
  autoRetry: true,
  lastError: null,
  retryQueue: [],
};

/**
 * Create transaction store with Zustand
 */
export const useTransactionStore = create<TransactionStoreState & TransactionStoreActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Transaction lifecycle
        startTransaction: (type, stepData, config) => {
          const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const flowConfig = { ...get().flowConfigs[type], ...config };

          const transaction: ActiveTransaction = {
            id,
            type,
            state: 'BUILDING',
            stepData,
            currentStep: 0,
            totalSteps: flowConfig.steps.length,
            priority: get().defaultPriority,
            retryCount: 0,
            maxRetries: flowConfig.maxRetries,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + flowConfig.timeout).toISOString(),
            metadata: {},
          };

          set((state) => {
            state.activeTransaction = transaction;
            state.currentStep = 0;
            state.lastError = null;
          });

          return id;
        },

        updateTransaction: (id, updates) => {
          set((state) => {
            if (state.activeTransaction?.id === id) {
              Object.assign(state.activeTransaction, {
                ...updates,
                updatedAt: new Date().toISOString(),
              });
            }
          });
        },

        updateTransactionState: (id, newState) => {
          set((state) => {
            if (state.activeTransaction?.id === id) {
              state.activeTransaction.state = newState;
              state.activeTransaction.updatedAt = new Date().toISOString();
            }
          });
        },

        updateTransactionStep: (id, step) => {
          set((state) => {
            if (state.activeTransaction?.id === id) {
              state.activeTransaction.currentStep = step;
              state.activeTransaction.updatedAt = new Date().toISOString();
            }
            state.currentStep = step;
          });
        },

        updateStepData: (id, stepDataUpdates) => {
          set((state) => {
            if (state.activeTransaction?.id === id) {
              Object.assign(state.activeTransaction.stepData, stepDataUpdates);
              state.activeTransaction.updatedAt = new Date().toISOString();
            }
          });
        },

        completeTransaction: (id, result) => {
          set((state) => {
            if (state.activeTransaction?.id === id) {
              const transaction = state.activeTransaction;
              transaction.state = 'COMPLETED';
              transaction.hash = result.hash;
              transaction.ledger = result.ledger;
              transaction.updatedAt = new Date().toISOString();

              // Move to history
              const historyEntry: TransactionHistoryEntry = {
                id: transaction.id,
                type: transaction.type,
                state: transaction.state,
                amount: transaction.stepData.amount || '0',
                asset: transaction.stepData.currency || 'XLM',
                sourceAccount: transaction.stepData.sourceWallet || '',
                destinationAccount: transaction.stepData.destinationWallet,
                memo: transaction.stepData.memo,
                fee: transaction.fee || '0',
                hash: transaction.hash,
                ledger: transaction.ledger,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
                completedAt: new Date().toISOString(),
                metadata: transaction.metadata,
              };

              state.history.unshift(historyEntry);
              state.activeTransaction = null;
              state.currentStep = 0;
            }
          });

          get().updateStats();
        },

        failTransaction: (id, error) => {
          const transactionError = handleTransactionError(error);

          set((state) => {
            if (state.activeTransaction?.id === id) {
              const transaction = state.activeTransaction;
              transaction.state = 'FAILED';
              transaction.error = transactionError;
              transaction.updatedAt = new Date().toISOString();

              // Add to retry queue if retryable and auto-retry is enabled
              if (
                transactionError.retryable &&
                state.autoRetry &&
                transaction.retryCount < transaction.maxRetries
              ) {
                state.retryQueue.push(id);
              } else {
                // Move to history
                const historyEntry: TransactionHistoryEntry = {
                  id: transaction.id,
                  type: transaction.type,
                  state: transaction.state,
                  amount: transaction.stepData.amount || '0',
                  asset: transaction.stepData.currency || 'XLM',
                  sourceAccount: transaction.stepData.sourceWallet || '',
                  destinationAccount: transaction.stepData.destinationWallet,
                  memo: transaction.stepData.memo,
                  fee: transaction.fee || '0',
                  createdAt: transaction.createdAt,
                  updatedAt: transaction.updatedAt,
                  error: transactionError,
                  metadata: transaction.metadata,
                };

                state.history.unshift(historyEntry);
                state.activeTransaction = null;
                state.currentStep = 0;
              }

              state.lastError = transactionError;
            }
          });

          get().updateStats();
        },

        cancelTransaction: (id, reason) => {
          set((state) => {
            if (state.activeTransaction?.id === id) {
              const transaction = state.activeTransaction;
              transaction.state = 'CANCELLED';
              transaction.updatedAt = new Date().toISOString();

              if (reason) {
                transaction.metadata = { ...transaction.metadata, cancellationReason: reason };
              }

              // Move to history
              const historyEntry: TransactionHistoryEntry = {
                id: transaction.id,
                type: transaction.type,
                state: transaction.state,
                amount: transaction.stepData.amount || '0',
                asset: transaction.stepData.currency || 'XLM',
                sourceAccount: transaction.stepData.sourceWallet || '',
                destinationAccount: transaction.stepData.destinationWallet,
                memo: transaction.stepData.memo,
                fee: transaction.fee || '0',
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
                metadata: transaction.metadata,
              };

              state.history.unshift(historyEntry);
              state.activeTransaction = null;
              state.currentStep = 0;
            }
          });

          get().updateStats();
        },

        retryTransaction: (id) => {
          set((state) => {
            if (state.activeTransaction?.id === id) {
              const transaction = state.activeTransaction;
              transaction.retryCount += 1;
              transaction.state = 'BUILDING';
              transaction.currentStep = 0;
              transaction.error = undefined;
              transaction.updatedAt = new Date().toISOString();

              // Extend the transaction's expiry time when retrying
              const transactionType = transaction.type as TransactionType;
              const flowConfig =
                state.flowConfigs[transactionType] ?? DEFAULT_FLOW_CONFIGS[transactionType];
              const timeout = flowConfig?.timeout ?? 30000;
              transaction.expiresAt = new Date(Date.now() + timeout).toISOString();
            }

            state.retryQueue = state.retryQueue.filter((txId: string) => txId !== id);
            state.currentStep = 0;
            state.lastError = null;
          });
        },

        // History management
        loadHistory: async (limit = 50, offset = 0) => {
          set((state) => {
            state.historyLoading = true;
            state.historyError = null;
          });

          try {
            // In a real app, this would fetch from an API
            // For now, we just use the existing history
            const existingHistory = get().history;
            const paginatedHistory = existingHistory.slice(offset, offset + limit);

            set((state) => {
              if (offset === 0) {
                state.history = paginatedHistory;
              } else {
                state.history.push(...paginatedHistory);
              }
              state.historyLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.historyError =
                error instanceof Error ? error.message : 'Failed to load history';
              state.historyLoading = false;
            });
          }
        },

        clearHistory: () => {
          set((state) => {
            state.history = [];
          });
        },

        removeHistoryEntry: (id) => {
          set((state) => {
            state.history = state.history.filter((entry: { id: string }) => entry.id !== id);
          });
        },

        // Error handling
        clearError: () => {
          set((state) => {
            state.lastError = null;
          });
        },

        addToRetryQueue: (id) => {
          set((state) => {
            if (!state.retryQueue.includes(id)) {
              state.retryQueue.push(id);
            }
          });
        },

        removeFromRetryQueue: (id) => {
          set((state) => {
            state.retryQueue = state.retryQueue.filter((txId: string) => txId !== id);
          });
        },

        processRetryQueue: async () => {
          const { retryQueue, retryTransaction } = get();

          for (const id of retryQueue) {
            // Add delay between retries
            await new Promise((resolve) => setTimeout(resolve, 1000));
            retryTransaction(id);
          }
        },

        // UI state
        openModal: () => {
          set((state) => {
            state.isModalOpen = true;
          });
        },

        closeModal: () => {
          set((state) => {
            state.isModalOpen = false;
          });
        },

        setCurrentStep: (step) => {
          set((state) => {
            state.currentStep = step;
          });
        },

        toggleAdvancedOptions: () => {
          set((state) => {
            state.showAdvancedOptions = !state.showAdvancedOptions;
          });
        },

        // Configuration
        updateFlowConfig: (type, config) => {
          set((state) => {
            state.flowConfigs[type] = { ...state.flowConfigs[type], ...config };
          });
        },

        setDefaultPriority: (priority) => {
          set((state) => {
            state.defaultPriority = priority;
          });
        },

        setAutoRetry: (enabled) => {
          set((state) => {
            state.autoRetry = enabled;
          });
        },

        // Statistics
        updateStats: () => {
          set((state) => {
            const { history, activeTransaction } = state;
            const allTransactions = [...history];

            if (activeTransaction) {
              allTransactions.push({
                ...activeTransaction,
                amount: activeTransaction.stepData.amount || '0',
                asset: activeTransaction.stepData.currency || 'XLM',
                sourceAccount: activeTransaction.stepData.sourceWallet || '',
                destinationAccount: activeTransaction.stepData.destinationWallet,
                memo: activeTransaction.stepData.memo,
                fee: activeTransaction.fee || '0',
                updatedAt: activeTransaction.updatedAt,
              } as TransactionHistoryEntry);
            }

            const total = allTransactions.length;
            const completed = allTransactions.filter((tx) => tx.state === 'COMPLETED').length;
            const failed = allTransactions.filter((tx) => tx.state === 'FAILED').length;
            const pending = allTransactions.filter(
              (tx) => !['COMPLETED', 'FAILED', 'CANCELLED'].includes(tx.state),
            ).length;

            const successRate = total > 0 ? (completed / total) * 100 : 0;

            // Calculate average duration for completed transactions
            const completedTransactions = allTransactions.filter(
              (tx) => tx.state === 'COMPLETED' && tx.completedAt,
            );

            let averageDuration = 0;
            if (completedTransactions.length > 0) {
              const totalDuration = completedTransactions.reduce((sum, tx) => {
                const start = new Date(tx.createdAt).getTime();
                const end = new Date(tx.completedAt!).getTime();
                return sum + (end - start);
              }, 0);
              averageDuration = totalDuration / completedTransactions.length / 1000; // in seconds
            }

            const lastActivity =
              allTransactions.length > 0 ? allTransactions[0].updatedAt : undefined;

            state.stats = {
              total,
              completed,
              failed,
              pending,
              successRate,
              averageDuration,
              lastActivity,
            };
          });
        },

        // Cleanup
        cleanup: () => {
          set((state) => {
            // Handle expired active transaction
            const now = Date.now();
            if (state.activeTransaction?.expiresAt) {
              const expiresAt = new Date(state.activeTransaction.expiresAt).getTime();
              if (now > expiresAt) {
                // Mark as expired
                state.activeTransaction.state = 'EXPIRED';

                // Push a copy to history
                state.history.unshift({ ...state.activeTransaction });

                // Remove from retry queue
                state.retryQueue = state.retryQueue.filter(
                  (id: string) => id !== state.activeTransaction?.id,
                );

                // Clear active transaction
                state.activeTransaction = undefined;
              }
            }

            // Clean up old history entries (keep last 100)
            if (state.history.length > 100) {
              state.history = state.history.slice(0, 100);
            }
          });
        },

        reset: () => {
          set(() => ({ ...initialState }));
        },
      })),
      {
        name: 'transaction-store',
        version: 1, // Add version for migration
        migrate: (persistedState: unknown, version: number) => {
          // Migration for version 0 -> 1: redact PII from legacy persisted data
          const state = persistedState as Record<string, unknown>;
          if (version === 0 && state?.history && Array.isArray(state.history)) {
            state.history = state.history
              .slice(0, 20)
              .map((transaction: Record<string, unknown>) => {
                const sourceAccount = transaction.sourceAccount as string | undefined;
                const destinationAccount = transaction.destinationAccount as string | undefined;
                const error = transaction.error as
                  | {
                      type?: string;
                      code?: string;
                      message?: string;
                      severity?: string;
                      timestamp?: string;
                    }
                  | undefined;

                return {
                  ...transaction,
                  // Redact legacy PII fields
                  sourceAccount: sourceAccount ? `${sourceAccount.slice(0, 4)}***` : undefined,
                  destinationAccount: destinationAccount
                    ? `${destinationAccount.slice(0, 4)}***`
                    : undefined,
                  memo: undefined, // Remove memo entirely
                  metadata: undefined, // Remove metadata
                  error: error
                    ? {
                        type: error.type,
                        code: error.code,
                        message: error.message,
                        severity: error.severity,
                        timestamp: error.timestamp,
                      }
                    : undefined,
                };
              });
          }
          return persistedState;
        },
        partialize: (state) => {
          // Config flag to disable history persistence (opt-out by default)
          const persistHistory = process.env.NEXT_PUBLIC_PERSIST_TRANSACTION_HISTORY !== 'false';

          if (!persistHistory) {
            return {
              flowConfigs: state.flowConfigs,
              defaultPriority: state.defaultPriority,
              autoRetry: state.autoRetry,
            };
          }

          // Redact PII from transaction history
          const redactedHistory = state.history.slice(0, 20).map((transaction) => ({
            id: transaction.id,
            type: transaction.type,
            state: transaction.state,
            amount: transaction.amount,
            asset: transaction.asset,
            // Redact sensitive address information
            sourceAccount: transaction.sourceAccount
              ? `${transaction.sourceAccount.slice(0, 4)}***`
              : undefined,
            destinationAccount: transaction.destinationAccount
              ? `${transaction.destinationAccount.slice(0, 4)}***`
              : undefined,
            // Omit memo entirely for privacy
            fee: transaction.fee,
            hash: transaction.hash,
            ledger: transaction.ledger,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
            completedAt: transaction.completedAt,
            expiresAt: transaction.expiresAt,
            error: transaction.error
              ? {
                  type: transaction.error.type,
                  code: transaction.error.code,
                  message: transaction.error.message,
                  severity: transaction.error.severity,
                  timestamp: transaction.error.timestamp,
                  // Omit error context which may contain PII
                }
              : undefined,
            // Omit metadata which might contain sensitive data
          }));

          return {
            history: redactedHistory,
            flowConfigs: state.flowConfigs,
            defaultPriority: state.defaultPriority,
            autoRetry: state.autoRetry,
          };
        },
      },
    ),
    { name: 'transaction-store' },
  ),
);

/**
 * Helper hooks for common transaction operations
 */
export const useActiveTransaction = () => {
  return useTransactionStore((state) => state.activeTransaction);
};

export const useTransactionHistory = () => {
  return useTransactionStore((state) => ({
    history: state.history,
    loading: state.historyLoading,
    error: state.historyError,
    loadHistory: state.loadHistory,
  }));
};

export const useTransactionStats = () => {
  return useTransactionStore((state) => state.stats);
};

export const useTransactionUI = () => {
  return useTransactionStore((state) => ({
    isModalOpen: state.isModalOpen,
    currentStep: state.currentStep,
    showAdvancedOptions: state.showAdvancedOptions,
    openModal: state.openModal,
    closeModal: state.closeModal,
    setCurrentStep: state.setCurrentStep,
    toggleAdvancedOptions: state.toggleAdvancedOptions,
  }));
};

export const useTransactionError = () => {
  return useTransactionStore((state) => ({
    lastError: state.lastError,
    clearError: state.clearError,
  }));
};
