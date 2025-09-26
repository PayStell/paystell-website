"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OptimisticTransaction, TransactionQueue } from "@/lib/types/deposit";

interface OptimisticState {
  queue: TransactionQueue;
  isProcessing: boolean;
  
  // Actions
  addTransaction: (transaction: OptimisticTransaction) => void;
  updateTransaction: (id: string, updates: Partial<OptimisticTransaction>) => void;
  removeTransaction: (id: string) => void;
  moveTransaction: (id: string, from: keyof TransactionQueue, to: keyof TransactionQueue) => void;
  processQueue: () => Promise<void>;
  clearCompleted: () => void;
  clearFailed: () => void;
  getTransaction: (id: string) => OptimisticTransaction | undefined;
  getTransactionsByStatus: (status: OptimisticTransaction['status']) => OptimisticTransaction[];
}

export const useOptimisticStore = create<OptimisticState>()(
  persist(
    (set, get) => ({
      queue: {
        pending: [],
        processing: [],
        completed: [],
        failed: [],
      },
      isProcessing: false,

      addTransaction: (transaction: OptimisticTransaction) => {
        set((state) => ({
          queue: {
            ...state.queue,
            pending: [...state.queue.pending, transaction],
          },
        }));
      },

      updateTransaction: (id: string, updates: Partial<OptimisticTransaction>) => {
        set((state) => {
          const updateInArray = (arr: OptimisticTransaction[]) =>
            arr.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx));

          return {
            queue: {
              pending: updateInArray(state.queue.pending),
              processing: updateInArray(state.queue.processing),
              completed: updateInArray(state.queue.completed),
              failed: updateInArray(state.queue.failed),
            },
          };
        });
      },

      removeTransaction: (id: string) => {
        set((state) => {
          const removeFromArray = (arr: OptimisticTransaction[]) =>
            arr.filter((tx) => tx.id !== id);

          return {
            queue: {
              pending: removeFromArray(state.queue.pending),
              processing: removeFromArray(state.queue.processing),
              completed: removeFromArray(state.queue.completed),
              failed: removeFromArray(state.queue.failed),
            },
          };
        });
      },

      moveTransaction: (id: string, from: keyof TransactionQueue, to: keyof TransactionQueue) => {
        set((state) => {
          const transaction = state.queue[from].find((tx) => tx.id === id);
          if (!transaction) return state;

          const newFrom = state.queue[from].filter((tx) => tx.id !== id);
          const newTo = [...state.queue[to], transaction];

          return {
            queue: {
              ...state.queue,
              [from]: newFrom,
              [to]: newTo,
            },
          };
        });
      },

      processQueue: async () => {
        const state = get();
        if (state.isProcessing) return;

        set({ isProcessing: true });

        try {
          const { queue } = state;
          const pendingTransactions = [...queue.pending];

          for (const transaction of pendingTransactions) {
            // Move to processing
            get().moveTransaction(transaction.id, "pending", "processing");

            try {
              // Simulate processing delay
              await new Promise((resolve) => setTimeout(resolve, 1000));

              // Simulate success/failure (90% success rate)
              const isSuccess = Math.random() > 0.1;

              if (isSuccess) {
                get().updateTransaction(transaction.id, {
                  status: "confirmed",
                  transactionHash: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                });
                get().moveTransaction(transaction.id, "processing", "completed");
              } else {
                get().updateTransaction(transaction.id, {
                  status: "failed",
                  error: "Transaction failed to confirm",
                });
                get().moveTransaction(transaction.id, "processing", "failed");
              }
            } catch (error) {
              get().updateTransaction(transaction.id, {
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
              });
              get().moveTransaction(transaction.id, "processing", "failed");
            }
          }
        } finally {
          set({ isProcessing: false });
        }
      },

      clearCompleted: () => {
        set((state) => ({
          queue: {
            ...state.queue,
            completed: [],
          },
        }));
      },

      clearFailed: () => {
        set((state) => ({
          queue: {
            ...state.queue,
            failed: [],
          },
        }));
      },

      getTransaction: (id: string) => {
        const state = get();
        const allTransactions = [
          ...state.queue.pending,
          ...state.queue.processing,
          ...state.queue.completed,
          ...state.queue.failed,
        ];
        return allTransactions.find((tx) => tx.id === id);
      },

      getTransactionsByStatus: (status: OptimisticTransaction['status']) => {
        const state = get();
        const allTransactions = [
          ...state.queue.pending,
          ...state.queue.processing,
          ...state.queue.completed,
          ...state.queue.failed,
        ];
        return allTransactions.filter((tx) => tx.status === status);
      },
    }),
    {
      name: "optimistic-transactions",
      partialize: (state) => ({
        queue: state.queue,
      }),
    }
  )
);
