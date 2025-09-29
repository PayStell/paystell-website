/**
 * Simple error prevention utilities
 */

// Safe JSON parsing with fallback
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  onError?: (error: Error) => void,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const err = error as Error;
    if (onError) {
      onError(err);
    }
    return fallback;
  }
}

// Input validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Network error detection
export function isNetworkError(error: Error): boolean {
  const networkErrorMessages = [
    'fetch',
    'network',
    'connection',
    'timeout',
    'offline',
    'failed to fetch',
  ];

  return networkErrorMessages.some((msg) => error.message.toLowerCase().includes(msg));
}

// Retry with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Error categorization
export function categorizeError(error: Error): {
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userMessage: string;
} {
  const message = error.message.toLowerCase();

  // Network errors
  if (isNetworkError(error)) {
    return {
      type: 'network',
      severity: 'medium',
      userMessage: 'Connection issue. Please check your internet connection and try again.',
    };
  }

  // Authentication errors
  if (
    message.includes('auth') ||
    message.includes('unauthorized') ||
    message.includes('forbidden')
  ) {
    return {
      type: 'auth',
      severity: 'high',
      userMessage: 'Authentication required. Please log in again.',
    };
  }

  // Validation errors
  if (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required')
  ) {
    return {
      type: 'validation',
      severity: 'low',
      userMessage: 'Please check your input and try again.',
    };
  }

  // Server errors
  if (message.includes('500') || message.includes('server error') || message.includes('internal')) {
    return {
      type: 'server',
      severity: 'high',
      userMessage: 'Server error. Please try again later.',
    };
  }

  // Default
  return {
    type: 'unknown',
    severity: 'medium',
    userMessage: 'Something went wrong. Please try again.',
  };
}
