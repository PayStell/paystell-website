'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRetry } from '@/hooks/use-retry';
import { safeAsync, categorizeError } from '@/utils/error-prevention';
import { toast } from 'sonner';

// Example: How to use error handling in a real component
export function ErrorHandlingExample() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Example API call with retry logic
  const { execute: fetchDataWithRetry, isRetrying } = useRetry(
    async () => {
      const response = await fetch('/api/example-data');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    { maxRetries: 3, initialDelay: 1000 },
  );

  // Example: Safe async operation
  const handleSafeOperation = async () => {
    setLoading(true);

    const result = await safeAsync(
      async () => {
        // Simulate an operation that might fail
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (Math.random() < 0.5) {
          throw new Error('Random failure for demo');
        }
        return { success: true, data: 'Operation completed' };
      },
      { success: false, data: 'Operation failed' }, // fallback
      (error) => {
        // Error handler
        const { type, severity, userMessage } = categorizeError(error);
        toast.error(userMessage);
        console.error('Operation failed:', error);
      },
    );

    setData(result);
    setLoading(false);
  };

  // Example: Retry mechanism
  const handleRetryOperation = async () => {
    try {
      const result = await fetchDataWithRetry();
      setData(result);
      toast.success('Data fetched successfully!');
    } catch (error) {
      const { userMessage } = categorizeError(error as Error);
      toast.error(`Failed to fetch data: ${userMessage}`);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Error Handling Examples</h3>

      <div className="space-y-2">
        <Button onClick={handleSafeOperation} disabled={loading} className="w-full">
          {loading ? 'Processing...' : 'Safe Operation (with fallback)'}
        </Button>

        <Button
          onClick={handleRetryOperation}
          disabled={isRetrying}
          variant="outline"
          className="w-full"
        >
          {isRetrying ? 'Retrying...' : 'Retry Operation (with backoff)'}
        </Button>
      </div>

      {data && (
        <div className="p-4 bg-gray-50 rounded-md">
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
