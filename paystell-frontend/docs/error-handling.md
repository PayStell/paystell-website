# Error Handling System

This document describes the simple but effective error handling system implemented in the Paystell application.

## Components

### 1. Global Error Boundary (`ErrorBoundary.tsx`)

The main error boundary component that catches JavaScript errors in the component tree and provides fallback UI.

**Features:**

- Catches all unhandled errors in child components
- Provides user-friendly error recovery options
- Logs errors for monitoring
- Supports custom fallback components

**Usage:**

```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. Error Fallback UI (`ErrorFallback.tsx`)

A user-friendly error recovery interface that provides:

- Clear error messages
- Retry functionality
- Navigation options (Go Back, Go Home)
- Error details in development mode

### 3. Retry Hook (`use-retry.tsx`)

A custom hook for implementing retry logic with exponential backoff.

**Usage:**

```tsx
const { execute, isRetrying, retryCount, lastError } = useRetry(fetchData, {
  maxRetries: 3,
  initialDelay: 1000,
});

const handleFetch = async () => {
  try {
    const result = await execute();
    // Handle success
  } catch (error) {
    // Handle final failure
  }
};
```

### 4. Offline Detection (`use-offline.tsx`)

A hook that detects when the user goes offline/online.

**Usage:**

```tsx
const isOffline = useOffline();
```

### 5. Offline Banner (`OfflineBanner.tsx`)

Components that show offline/online status to users.

## Error Prevention Utilities (`error-prevention.ts`)

Helper functions for common error prevention patterns:

- `safeJsonParse()` - Safe JSON parsing with fallback
- `safeAsync()` - Safe async operation wrapper
- `isValidEmail()` - Email validation
- `isValidUrl()` - URL validation
- `isNetworkError()` - Network error detection
- `retryWithBackoff()` - Retry with exponential backoff
- `categorizeError()` - Error categorization

## Error Logging

Errors are automatically logged to:

- Console (development)
- API endpoint `/api/errors` (production)

The error logging API endpoint can be extended to integrate with external monitoring services like Sentry, LogRocket, etc.

## Best Practices

1. **Wrap critical components** with ErrorBoundary
2. **Use retry hooks** for network operations
3. **Validate inputs** before processing
4. **Provide fallback values** for failed operations
5. **Show user-friendly messages** instead of technical errors
6. **Log errors** for debugging and monitoring

## Integration

The error handling system is automatically integrated into the main app layout, providing:

- Global error boundary protection
- Offline/online status indicators
- Automatic error logging

## Testing

To test the error handling system:

1. **Error Boundary**: Throw an error in a component to see the fallback UI
2. **Retry Logic**: Use the `RetryExample` component to test retry functionality
3. **Offline Detection**: Disconnect your internet to see the offline banner

## Future Enhancements

The system is designed to be simple but extensible. Future enhancements could include:

- Integration with external error monitoring services
- More sophisticated error categorization
- User error reporting interface
- Error analytics dashboard
