/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRetry } from '@/hooks/use-retry';
import { RefreshCw, AlertCircle } from 'lucide-react';

// Example API call that might fail
async function fetchUserData(userId: string) {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate random failure for demo
  if (Math.random() < 0.7) {
    throw new Error('Network request failed');
  }

  return { id: userId, name: 'John Doe', email: 'john@example.com' };
}

export function RetryExample() {
  const [userData, setUserData] = useState<any>(null);

  const { execute, isRetrying, retryCount, lastError } = useRetry(fetchUserData, {
    maxRetries: 3,
    initialDelay: 1000,
  });

  const handleFetchUser = async () => {
    try {
      const data = await execute('user-123');
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user after retries:', error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Retry Example</h3>

      <Button onClick={handleFetchUser} disabled={isRetrying} className="w-full mb-4">
        {isRetrying ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Retrying... ({retryCount}/3)
          </>
        ) : (
          'Fetch User Data'
        )}
      </Button>

      {userData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-medium text-green-800">Success!</h4>
          <p className="text-green-700">User: {userData.name}</p>
          <p className="text-green-700">Email: {userData.email}</p>
        </div>
      )}

      {lastError && !isRetrying && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Failed after {retryCount} attempts</span>
          </div>
          <p className="text-red-700 mt-1">{lastError.message}</p>
        </div>
      )}
    </div>
  );
}
