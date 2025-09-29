'use client';

import { useState, useCallback } from 'react';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
}

export function useRetry<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {},
) {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 10000, backoffFactor = 2 } = options;

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
  });

  const execute = useCallback(
    async (...args: T): Promise<R> => {
      let currentRetryCount = 0;
      let currentDelay = initialDelay;

      while (currentRetryCount <= maxRetries) {
        try {
          setState((prev) => ({
            ...prev,
            isRetrying: currentRetryCount > 0,
            retryCount: currentRetryCount,
            lastError: null,
          }));

          const result = await fn(...args);

          // Reset state on success
          setState({
            isRetrying: false,
            retryCount: 0,
            lastError: null,
          });

          return result;
        } catch (error) {
          const err = error as Error;
          currentRetryCount++;

          setState((prev) => ({
            ...prev,
            isRetrying: currentRetryCount <= maxRetries,
            retryCount: currentRetryCount,
            lastError: err,
          }));

          if (currentRetryCount > maxRetries) {
            throw err;
          }

          // Wait before retrying with exponential backoff
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay = Math.min(currentDelay * backoffFactor, maxDelay);
        }
      }

      throw new Error('Max retries exceeded');
    },
    [fn, maxRetries, initialDelay, maxDelay, backoffFactor],
  );

  const reset = useCallback(() => {
    setState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
    });
  }, []);

  return {
    execute,
    reset,
    ...state,
  };
}
