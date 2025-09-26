import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting
// In production, use Redis or a database
const rateLimitStore: RateLimitStore = {};

const defaultConfig: RateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};

export function createRateLimit(config: RateLimitConfig = defaultConfig) {
  return function rateLimit(request: NextRequest): NextResponse | null {
    const clientId = getClientId(request);
    const now = Date.now();

    // Get or create rate limit entry for this client
    if (!rateLimitStore[clientId]) {
      rateLimitStore[clientId] = {
        count: 0,
        resetTime: now + config.windowMs,
      };
    }

    const entry = rateLimitStore[clientId];

    // Reset if window has passed
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + config.windowMs;
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
          },
        },
      );
    }

    // Increment counter
    entry.count++;

    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (config.maxRequests - entry.count).toString());
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());

    return null;
  };
}

function getClientId(request: NextRequest): string {
  // Use IP address as client identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';

  // In production, you might want to use a more sophisticated method
  // like API keys or user sessions
  return ip;
}

// Specific rate limit for payment endpoint (more restrictive)
export const paymentRateLimit = createRateLimit({
  windowMs: 60000, // 1 minute
  maxRequests: 10, // 10 requests per minute
});

// General rate limit for other endpoints
export const generalRateLimit = createRateLimit();
