import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AppError, errorTypes } from '../utils/error-handler';

/**
 * Interface for rate limiter options
 */
interface RateLimitOptions {
  windowMs: number;      // Time window in milliseconds
  max: number;           // Maximum number of requests in the time window
  message?: string;      // Custom error message
  keyGenerator?: (req: Request) => string;  // Custom key generator function
}

/**
 * Creates a rate limiter middleware with the provided options
 * @param options Rate limiter configuration options
 * @returns Express middleware function
 */
export const rateLimiterMiddleware = (options: RateLimitOptions) => {
  // Default key generator uses IP address
  const defaultKeyGenerator = (req: Request): string => {
    return req.ip || '127.0.0.1';
  };

  // Use custom key generator if provided, otherwise use the default
  const keyGenerator = options.keyGenerator || defaultKeyGenerator;

  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    skip: (req: Request) => {
      // Skip rate limiting for certain conditions if needed
      // Example: Skip for certain user roles or in development
      return process.env.NODE_ENV === 'test';
    },
    handler: (req: Request, res: Response) => {
      const error = new AppError(
        options.message || 'Too many requests, please try again later',
        errorTypes.TOO_MANY_REQUESTS
      );
      
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: {
          code: error.statusCode,
          message: 'Rate limit exceeded'
        }
      });
    }
  });
};

/**
 * Creates a rate limiter that uses user ID for rate limiting
 * Useful for endpoints that require authentication
 * @param options Rate limiter options
 * @returns Express middleware function
 */
export const userRateLimiterMiddleware = (options: RateLimitOptions) => {
  return rateLimiterMiddleware({
    ...options,
    keyGenerator: (req: Request): string => {
      // Use user ID from authenticated request, fallback to IP if not available
      return req.user?.id || req.ip || '127.0.0.1';
    }
  });
};

/**
 * General API rate limiter - applies to all endpoints
 * Less strict limits as it's a global limiter
 */
export const globalRateLimiter = rateLimiterMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                  // 500 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

/**
 * Stricter rate limiter for authentication-related endpoints
 * Helps prevent brute force attacks
 */
export const authRateLimiter = rateLimiterMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                  // 10 requests per hour
  message: 'Too many authentication attempts, please try again after an hour'
});

/**
 * Rate limiter specifically for wallet verification endpoints
 */
export const walletVerificationRateLimiter = rateLimiterMiddleware({
  windowMs: 5 * 60 * 1000,  // 5 minutes
  max: 5,                   // 5 requests per 5 minutes
  message: 'Too many wallet verification attempts, please try again after 5 minutes'
});