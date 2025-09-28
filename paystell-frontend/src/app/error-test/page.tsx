'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RetryExample } from '@/components/RetryExample';
import { useOffline } from '@/hooks/use-offline';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

// Component that throws an error for testing
function ErrorThrowingComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate the error boundary!');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Error Boundary Test
        </CardTitle>
        <CardDescription>
          Click the button below to trigger an error and see the error boundary in action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setShouldThrow(true)} variant="destructive">
          Throw Error
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ErrorTestPage() {
  const isOffline = useOffline();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Error Handling System Test</h1>
        <p className="text-gray-600">
          This page demonstrates the error handling capabilities of the application.
        </p>
      </div>

      {/* Offline Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOffline ? (
              <WifiOff className="w-5 h-5 text-red-500" />
            ) : (
              <Wifi className="w-5 h-5 text-green-500" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={isOffline ? 'text-red-600' : 'text-green-600'}>
            {isOffline ? 'You are currently offline' : 'You are currently online'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try disconnecting your internet to see the offline banner.
          </p>
        </CardContent>
      </Card>

      {/* Error Boundary Test */}
      <ErrorThrowingComponent />

      {/* Retry Mechanism Test */}
      <Card>
        <CardHeader>
          <CardTitle>Retry Mechanism Test</CardTitle>
          <CardDescription>Test the retry functionality with exponential backoff.</CardDescription>
        </CardHeader>
        <CardContent>
          <RetryExample />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            1. <strong>Error Boundary:</strong> Click "Throw Error" to see the error fallback UI
          </p>
          <p>
            2. <strong>Retry Logic:</strong> Click "Fetch User Data" to test retry with backoff
          </p>
          <p>
            3. <strong>Offline Detection:</strong> Disconnect your internet to see offline banner
          </p>
          <p>
            4. <strong>Error Recovery:</strong> Use the retry, go back, or go home buttons in error
            states
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
