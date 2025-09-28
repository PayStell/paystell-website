'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

export function ErrorFallback({ error, retry }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  const handleRetry = async () => {
    setIsRetrying(true);
    // Add a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRetrying(false);
    retry();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  const isAuthError = error.message.includes('auth') || error.message.includes('unauthorized');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Oops! Something went wrong</CardTitle>
          <CardDescription className="text-gray-600">
            {isNetworkError &&
              "We're having trouble connecting to our servers. Please check your internet connection."}
            {isAuthError && 'There was an authentication issue. Please try logging in again.'}
            {!isNetworkError &&
              !isAuthError &&
              "An unexpected error occurred. Don't worry, we're here to help!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full"
              variant="default"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>

            <Button onClick={handleGoBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>

            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
                className="w-full text-gray-500"
              >
                {showDetails ? 'Hide' : 'Show'} Error Details
              </Button>

              {showDetails && (
                <div className="mt-3 p-3 bg-gray-100 rounded-md">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-32">
                    {error.message}
                    {error.stack && `\n\nStack trace:\n${error.stack}`}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
