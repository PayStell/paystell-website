import { useOptimisticStore } from '../optimistic-store';
import { OptimisticTransaction } from '@/lib/types/deposit';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('optimistic-store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useOptimisticStore.setState({
      queue: {
        pending: [],
        processing: [],
        completed: [],
        failed: [],
      },
      isProcessing: false,
    });
  });

  describe('addTransaction', () => {
    it('should add a transaction to the pending queue', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      useOptimisticStore.getState().addTransaction(transaction);

      const state = useOptimisticStore.getState();
      expect(state.queue.pending).toHaveLength(1);
      expect(state.queue.pending[0]).toEqual(transaction);
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction in the queue', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      // Add transaction
      useOptimisticStore.getState().addTransaction(transaction);

      // Update transaction
      useOptimisticStore.getState().updateTransaction('test_123', {
        status: 'completed',
        transactionHash: 'tx_hash_123',
      });

      const state = useOptimisticStore.getState();
      const updatedTransaction = state.queue.pending[0];

      expect(updatedTransaction.status).toBe('completed');
      expect(updatedTransaction.transactionHash).toBe('tx_hash_123');
    });
  });

  describe('removeTransaction', () => {
    it('should remove a transaction from the queue', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      // Add transaction
      useOptimisticStore.getState().addTransaction(transaction);
      expect(useOptimisticStore.getState().queue.pending).toHaveLength(1);

      // Remove transaction
      useOptimisticStore.getState().removeTransaction('test_123');
      expect(useOptimisticStore.getState().queue.pending).toHaveLength(0);
    });
  });

  describe('moveTransaction', () => {
    it('should move a transaction between queues', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      // Add transaction
      useOptimisticStore.getState().addTransaction(transaction);
      expect(useOptimisticStore.getState().queue.pending).toHaveLength(1);
      expect(useOptimisticStore.getState().queue.completed).toHaveLength(0);

      // Move transaction
      useOptimisticStore.getState().moveTransaction('test_123', 'pending', 'completed');

      const state = useOptimisticStore.getState();
      expect(state.queue.pending).toHaveLength(0);
      expect(state.queue.completed).toHaveLength(1);
      expect(state.queue.completed[0]).toEqual(transaction);
    });
  });

  describe('getTransaction', () => {
    it('should get a transaction by ID', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      // Add transaction
      useOptimisticStore.getState().addTransaction(transaction);

      // Get transaction
      const foundTransaction = useOptimisticStore.getState().getTransaction('test_123');
      expect(foundTransaction).toEqual(transaction);
    });

    it('should return undefined for non-existent transaction', () => {
      const foundTransaction = useOptimisticStore.getState().getTransaction('non_existent');
      expect(foundTransaction).toBeUndefined();
    });
  });

  describe('getTransactionsByStatus', () => {
    it('should get transactions by status', () => {
      const transaction1: OptimisticTransaction = {
        id: 'test_1',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      const transaction2: OptimisticTransaction = {
        id: 'test_2',
        type: 'withdraw',
        amount: '5.0',
        asset: 'USDC',
        status: 'pending',
        timestamp: Date.now(),
      };

      const transaction3: OptimisticTransaction = {
        id: 'test_3',
        type: 'deposit',
        amount: '20.0',
        asset: 'XLM',
        status: 'completed',
        timestamp: Date.now(),
      };

      // Add transactions
      useOptimisticStore.getState().addTransaction(transaction1);
      useOptimisticStore.getState().addTransaction(transaction2);
      useOptimisticStore.getState().addTransaction(transaction3);

      // Get pending transactions
      const pendingTransactions = useOptimisticStore.getState().getTransactionsByStatus('pending');
      expect(pendingTransactions).toHaveLength(2);
      expect(pendingTransactions).toContainEqual(transaction1);
      expect(pendingTransactions).toContainEqual(transaction2);

      // Get completed transactions
      const completedTransactions = useOptimisticStore
        .getState()
        .getTransactionsByStatus('completed');
      expect(completedTransactions).toHaveLength(1);
      expect(completedTransactions).toContainEqual(transaction3);
    });
  });

  describe('clearCompleted', () => {
    it('should clear completed transactions', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'completed',
        timestamp: Date.now(),
      };

      // Add transaction to completed queue
      useOptimisticStore.setState({
        queue: {
          pending: [],
          processing: [],
          completed: [transaction],
          failed: [],
        },
      });

      expect(useOptimisticStore.getState().queue.completed).toHaveLength(1);

      // Clear completed
      useOptimisticStore.getState().clearCompleted();
      expect(useOptimisticStore.getState().queue.completed).toHaveLength(0);
    });
  });

  describe('clearFailed', () => {
    it('should clear failed transactions', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'failed',
        timestamp: Date.now(),
        error: 'Test error',
      };

      // Add transaction to failed queue
      useOptimisticStore.setState({
        queue: {
          pending: [],
          processing: [],
          completed: [],
          failed: [transaction],
        },
      });

      expect(useOptimisticStore.getState().queue.failed).toHaveLength(1);

      // Clear failed
      useOptimisticStore.getState().clearFailed();
      expect(useOptimisticStore.getState().queue.failed).toHaveLength(0);
    });
  });
});
