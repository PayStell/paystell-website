"use client";

import { OptimisticTransaction } from "@/lib/types/deposit";

export interface QueueConfig {
  maxRetries: number;
  retryDelay: number;
  maxQueueSize: number;
  processingTimeout: number;
}

export interface QueueItem {
  id: string;
  transaction: OptimisticTransaction;
  retries: number;
  createdAt: number;
  lastAttempt?: number;
  nextRetry?: number;
}

export interface QueueStatus {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
}

export type QueueEventType = 'item_added' | 'item_processing' | 'item_completed' | 'item_failed' | 'item_retry' | 'queue_cleared';

export interface QueueEvent {
  type: QueueEventType;
  item: QueueItem | null;
  timestamp: number;
}

export type QueueEventHandler = (event: QueueEvent) => void;

export class TransactionQueue {
  private queue: QueueItem[] = [];
  private processing: Set<string> = new Set();
  private completed: QueueItem[] = [];
  private failed: QueueItem[] = [];
  private config: QueueConfig;
  private eventHandlers: Map<QueueEventType, QueueEventHandler[]> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 5000,
      maxQueueSize: 100,
      processingTimeout: 30000,
      ...config,
    };
  }

  /**
   * Add a transaction to the queue
   */
  public add(transaction: OptimisticTransaction): string {
    // Check queue size limit
    if (this.queue.length >= this.config.maxQueueSize) {
      throw new Error('Queue is full');
    }

    const item: QueueItem = {
      id: transaction.id,
      transaction,
      retries: 0,
      createdAt: Date.now(),
    };

    this.queue.push(item);
    this.emitEvent('item_added', item);
    
    return item.id;
  }

  /**
   * Remove an item from the queue
   */
  public remove(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index === -1) return false;

    const item = this.queue[index];
    this.queue.splice(index, 1);
    this.processing.delete(id);
    
    return true;
  }

  /**
   * Get the next item to process
   */
  public getNext(): QueueItem | null {
    // Find the next item that's not being processed and is ready for retry
    const now = Date.now();
    const item = this.queue.find(item => 
      !this.processing.has(item.id) && 
      (!item.nextRetry || item.nextRetry <= now)
    );

    return item || null;
  }

  /**
   * Mark an item as processing
   */
  public markProcessing(id: string): boolean {
    const item = this.queue.find(item => item.id === id);
    if (!item) return false;

    this.processing.add(id);
    item.lastAttempt = Date.now();
    this.emitEvent('item_processing', item);
    
    return true;
  }

  /**
   * Mark an item as completed
   */
  public markCompleted(id: string, transactionHash?: string): boolean {
    const item = this.queue.find(item => item.id === id);
    if (!item) return false;

    // Update transaction with hash
    if (transactionHash) {
      item.transaction.transactionHash = transactionHash;
      item.transaction.status = 'confirmed';
    }

    // Move to completed
    this.queue = this.queue.filter(item => item.id !== id);
    this.processing.delete(id);
    this.completed.push(item);
    
    this.emitEvent('item_completed', item);
    return true;
  }

  /**
   * Mark an item as failed
   */
  public markFailed(id: string, error: string): boolean {
    const item = this.queue.find(item => item.id === id);
    if (!item) return false;

    item.transaction.status = 'failed';
    item.transaction.error = error;
    item.retries++;

    // Check if we should retry
    if (item.retries < this.config.maxRetries) {
      item.nextRetry = Date.now() + this.config.retryDelay;
      this.processing.delete(id);
      this.emitEvent('item_retry', item);
    } else {
      // Move to failed
      this.queue = this.queue.filter(queueItem => queueItem.id !== id);
      this.processing.delete(id);
      this.failed.push(item);
      this.emitEvent('item_failed', item);
    }
    
    return true;
  }

  /**
   * Start processing the queue
   */
  public startProcessing(): void {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.processingInterval = setInterval(() => {
      this.processNext();
    }, 1000); // Check every second
  }

  /**
   * Stop processing the queue
   */
  public stopProcessing(): void {
    this.isProcessing = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  /**
   * Process the next item in the queue
   */
  private async processNext(): Promise<void> {
    const item = this.getNext();
    if (!item) return;

    try {
      this.markProcessing(item.id);
      
      // Simulate processing
      await this.processItem(item);
      
      // Mark as completed
      this.markCompleted(item.id, `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.markFailed(item.id, errorMessage);
    }
  }

  /**
   * Process a single item
   */
  private async processItem(item: QueueItem): Promise<void> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (!isSuccess) {
      throw new Error('Simulated processing failure');
    }
  }

  /**
   * Get queue status
   */
  public getStatus(): QueueStatus {
    const pendingItems = this.queue.filter(item => !this.processing.has(item.id));
    const processingCount = this.processing.size;
    const completedCount = this.completed.length;
    const failedCount = this.failed.length;

    return {
      pending: pendingItems.length,
      processing: processingCount,
      completed: completedCount,
      failed: failedCount,
      total: pendingItems.length + processingCount + completedCount + failedCount,
    };
  }

  /**
   * Get all items in the queue
   */
  public getQueue(): QueueItem[] {
    return [...this.queue];
  }

  /**
   * Get all completed items
   */
  public getCompleted(): QueueItem[] {
    return [...this.completed];
  }

  /**
   * Get all failed items
   */
  public getFailed(): QueueItem[] {
    return [...this.failed];
  }

  /**
   * Get all items
   */
  public getAllItems(): QueueItem[] {
    return [
      ...this.queue,
      ...this.completed,
      ...this.failed,
    ];
  }

  /**
   * Clear the queue
   */
  public clear(): void {
    this.queue = [];
    this.processing.clear();
    this.completed = [];
    this.failed = [];
    this.emitEvent('queue_cleared', null);
  }

  /**
   * Clear completed items
   */
  public clearCompleted(): void {
    this.completed = [];
  }

  /**
   * Clear failed items
   */
  public clearFailed(): void {
    this.failed = [];
  }

  /**
   * Retry a failed item
   */
  public retry(id: string): boolean {
    const item = this.failed.find(item => item.id === id);
    if (!item) return false;

    // Reset item
    item.retries = 0;
    item.nextRetry = undefined;
    item.lastAttempt = undefined;
    item.transaction.status = 'pending';
    item.transaction.error = undefined;

    // Move back to queue
    this.failed = this.failed.filter(failedItem => failedItem.id !== id);
    this.queue.push(item);

    return true;
  }

  /**
   * Get item by ID
   */
  public getItem(id: string): QueueItem | null {
    const allItems = this.getAllItems();
    return allItems.find(item => item.id === id) || null;
  }

  /**
   * Subscribe to queue events
   */
  public on(eventType: QueueEventType, handler: QueueEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  /**
   * Unsubscribe from queue events
   */
  public off(eventType: QueueEventType, handler: QueueEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit a queue event
   */
  private emitEvent(eventType: QueueEventType, item: QueueItem | null): void {
    const event: QueueEvent = {
      type: eventType,
      item,
      timestamp: Date.now(),
    };

    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error('Error in queue event handler:', error);
        }
      });
    }
  }

  /**
   * Update queue configuration
   */
  public updateConfig(newConfig: Partial<QueueConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get queue configuration
   */
  public getConfig(): QueueConfig {
    return { ...this.config };
  }
}

// Create a singleton instance
export const transactionQueue = new TransactionQueue();
