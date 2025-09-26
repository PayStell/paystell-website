"use client";

import { DepositTransaction, OptimisticTransaction } from "@/lib/types/deposit";

export interface WebSocketMessage {
  type: 'transaction' | 'deposit' | 'balance' | 'error' | 'ping' | 'pong';
  data?: unknown;
  timestamp: number;
}

export interface TransactionMessage extends WebSocketMessage {
  type: 'transaction';
  data: DepositTransaction;
}

export interface DepositMessage extends WebSocketMessage {
  type: 'deposit';
  data: {
    id: string;
    status: string;
    transactionHash?: string;
  };
}

export interface BalanceMessage extends WebSocketMessage {
  type: 'balance';
  data: {
    address: string;
    asset: string;
    balance: string;
  };
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  data: {
    message: string;
    code?: string;
  };
}

export type WebSocketEventCallback = (message: WebSocketMessage) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private isConnected = false;
  private eventCallbacks: Map<string, WebSocketEventCallback[]> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || this.isConnected) {
        resolve();
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startPing();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.isConnecting = false;
          this.stopPing();
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    this.stopPing();
    this.clearReconnectTimeout();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.isConnected = false;
    this.isConnecting = false;
  }

  /**
   * Send a message to the server
   */
  public send(message: Partial<WebSocketMessage>): void {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket not connected, cannot send message');
      return;
    }

    const fullMessage: WebSocketMessage = {
      type: 'ping',
      timestamp: Date.now(),
      ...message,
    };

    try {
      this.ws.send(JSON.stringify(fullMessage));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  }

  /**
   * Subscribe to a specific message type
   */
  public on(type: string, callback: WebSocketEventCallback): void {
    if (!this.eventCallbacks.has(type)) {
      this.eventCallbacks.set(type, []);
    }
    this.eventCallbacks.get(type)!.push(callback);
  }

  /**
   * Unsubscribe from a specific message type
   */
  public off(type: string, callback: WebSocketEventCallback): void {
    const callbacks = this.eventCallbacks.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Get connection status
   */
  public getStatus(): {
    isConnected: boolean;
    isConnecting: boolean;
    reconnectAttempts: number;
  } {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: WebSocketMessage): void {
    // Handle pong messages
    if (message.type === 'pong') {
      return;
    }

    // Call registered callbacks
    const callbacks = this.eventCallbacks.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in WebSocket callback:', error);
        }
      });
    }

    // Call general callbacks
    const generalCallbacks = this.eventCallbacks.get('*');
    if (generalCallbacks) {
      generalCallbacks.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in WebSocket general callback:', error);
        }
      });
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Start ping interval
   */
  private startPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Clear reconnect timeout
   */
  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}

// Create a singleton instance
export const websocketClient = new WebSocketClient(
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001'
);
