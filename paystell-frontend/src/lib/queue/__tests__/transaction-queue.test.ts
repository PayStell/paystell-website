import { TransactionQueue, QueueItem } from '../transaction-queue';
import { OptimisticTransaction } from '@/lib/types/deposit';

describe('TransactionQueue', () => {
  let queue: TransactionQueue;

  beforeEach(() => {
    queue = new TransactionQueue({
      maxRetries: 3,
      retryDelay: 1000,
      maxQueueSize: 10,
      processingTimeout: 5000,
    });
  });

  describe('add', () => {
    it('should add a transaction to the queue', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      const id = queue.add(transaction);
      expect(id).toBe('test_123');
      
      const queueItems = queue.getQueue();
      expect(queueItems).toHaveLength(1);
      expect(queueItems[0].transaction).toEqual(transaction);
    });

    it('should throw error when queue is full', () => {
      // Fill the queue
      for (let i = 0; i < 10; i++) {
        const transaction: OptimisticTransaction = {
          id: `test_${i}`,
          type: 'deposit',
          amount: '10.5',
          asset: 'XLM',
          status: 'pending',
          timestamp: Date.now(),
        };
        queue.add(transaction);
      }

      // Try to add one more
      const transaction: OptimisticTransaction = {
        id: 'test_overflow',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      expect(() => queue.add(transaction)).toThrow('Queue is full');
    });
  });

  describe('remove', () => {
    it('should remove a transaction from the queue', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      expect(queue.getQueue()).toHaveLength(1);

      const removed = queue.remove('test_123');
      expect(removed).toBe(true);
      expect(queue.getQueue()).toHaveLength(0);
    });

    it('should return false for non-existent transaction', () => {
      const removed = queue.remove('non_existent');
      expect(removed).toBe(false);
    });
  });

  describe('getNext', () => {
    it('should return the next item to process', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      const nextItem = queue.getNext();
      
      expect(nextItem).toBeDefined();
      expect(nextItem?.transaction).toEqual(transaction);
    });

    it('should return null when queue is empty', () => {
      const nextItem = queue.getNext();
      expect(nextItem).toBeNull();
    });

    it('should not return items that are being processed', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      queue.markProcessing('test_123');
      
      const nextItem = queue.getNext();
      expect(nextItem).toBeNull();
    });
  });

  describe('markProcessing', () => {
    it('should mark an item as processing', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      const marked = queue.markProcessing('test_123');
      
      expect(marked).toBe(true);
      expect(queue.getStatus().processing).toBe(1);
    });

    it('should return false for non-existent item', () => {
      const marked = queue.markProcessing('non_existent');
      expect(marked).toBe(false);
    });
  });

  describe('markCompleted', () => {
    it('should mark an item as completed', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      queue.markProcessing('test_123');
      
      const completed = queue.markCompleted('test_123', 'tx_hash_123');
      
      expect(completed).toBe(true);
      expect(queue.getStatus().completed).toBe(1);
      expect(queue.getStatus().processing).toBe(0);
      
      const completedItems = queue.getCompleted();
      expect(completedItems[0].transaction.transactionHash).toBe('tx_hash_123');
      expect(completedItems[0].transaction.status).toBe('confirmed');
    });
  });

  describe('markFailed', () => {
    it('should retry failed item if under max retries', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      queue.markProcessing('test_123');
      
      const failed = queue.markFailed('test_123', 'Test error');
      
      expect(failed).toBe(true);
      expect(queue.getStatus().failed).toBe(0);
      expect(queue.getStatus().processing).toBe(0);
      
      const queueItems = queue.getQueue();
      expect(queueItems[0].retries).toBe(1);
      expect(queueItems[0].transaction.error).toBe('Test error');
    });

    it('should move to failed queue after max retries', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      
      // Fail 3 times (max retries)
      for (let i = 0; i < 3; i++) {
        queue.markProcessing('test_123');
        queue.markFailed('test_123', 'Test error');
      }
      
      expect(queue.getStatus().failed).toBe(1);
      expect(queue.getStatus().pending).toBe(0);
    });
  });

  describe('getStatus', () => {
    it('should return correct queue status', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      queue.markProcessing('test_123');
      queue.markCompleted('test_123', 'tx_hash_123');
      
      const status = queue.getStatus();
      expect(status.pending).toBe(0);
      expect(status.processing).toBe(0);
      expect(status.completed).toBe(1);
      expect(status.failed).toBe(0);
      expect(status.total).toBe(1);
    });
  });

  describe('clear', () => {
    it('should clear all queues', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      queue.markProcessing('test_123');
      queue.markCompleted('test_123', 'tx_hash_123');
      
      queue.clear();
      
      const status = queue.getStatus();
      expect(status.total).toBe(0);
    });
  });

  describe('retry', () => {
    it('should retry a failed item', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'failed',
        timestamp: Date.now(),
        error: 'Test error',
      };

      // Add to failed queue
      queue.add(transaction);
      queue.markProcessing('test_123');
      queue.markFailed('test_123', 'Test error');
      queue.markFailed('test_123', 'Test error');
      queue.markFailed('test_123', 'Test error');
      
      expect(queue.getStatus().failed).toBe(1);
      
      const retried = queue.retry('test_123');
      expect(retried).toBe(true);
      expect(queue.getStatus().failed).toBe(0);
      expect(queue.getStatus().pending).toBe(1);
      
      const queueItems = queue.getQueue();
      expect(queueItems[0].retries).toBe(0);
      expect(queueItems[0].transaction.status).toBe('pending');
      expect(queueItems[0].transaction.error).toBeUndefined();
    });
  });

  describe('getItem', () => {
    it('should get an item by ID', () => {
      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      const item = queue.getItem('test_123');
      
      expect(item).toBeDefined();
      expect(item?.transaction).toEqual(transaction);
    });

    it('should return null for non-existent item', () => {
      const item = queue.getItem('non_existent');
      expect(item).toBeNull();
    });
  });

  describe('event handling', () => {
    it('should emit events when items are added', () => {
      const eventHandler = jest.fn();
      queue.on('item_added', eventHandler);

      const transaction: OptimisticTransaction = {
        id: 'test_123',
        type: 'deposit',
        amount: '10.5',
        asset: 'XLM',
        status: 'pending',
        timestamp: Date.now(),
      };

      queue.add(transaction);
      
      expect(eventHandler).toHaveBeenCalledWith({
        type: 'item_added',
        item: expect.objectContaining({
          id: 'test_123',
          transaction,
        }),
        timestamp: expect.any(Number),
      });
    });
  });
});
