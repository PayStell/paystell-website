# Rate Limiting Middleware

The `rateLimitMiddleware` provides protection against abuse by limiting the number of requests that can be made from a single IP address within a specified time window.

## Features

- IP-based rate limiting
- Configurable request limits and time windows
- Standard rate limit headers
- In-memory storage (with notes for production scaling)
- TypeScript support

## API Reference

```typescript
async function rateLimitMiddleware(
  request: NextRequest,
  maxRequests?: number,
  windowMs?: number,
): Promise<NextResponse | undefined>;
```

### Parameters

- `request`: The incoming Next.js request object
- `maxRequests`: Maximum number of requests allowed in the time window (default: 5)
- `windowMs`: Time window in milliseconds (default: 60000 - 1 minute)

### Returns

- `NextResponse`: Rate limit exceeded response
- `undefined`: If within rate limits

## Implementation Details

The middleware uses an in-memory Map to track requests:

```typescript
const ipRequestMap = new Map<
  string,
  {
    count: number;
    resetTime: number;
  }
>();
```

### Rate Limit Headers

When rate limit is exceeded, the following headers are included:

```typescript
{
  'X-RateLimit-Limit': maxRequests.toString(),
  'X-RateLimit-Remaining': '0',
  'X-RateLimit-Reset': resetTime.toString(),
  'Retry-After': secondsToReset.toString()
}
```

## Usage Example

```typescript
import { rateLimitMiddleware } from '@/middleware/rateLimitMiddleware';

export async function POST(request: Request) {
  // Strict rate limiting: 3 requests per minute
  const rateLimitResponse = await rateLimitMiddleware(request as any, 3, 60 * 1000);
  if (rateLimitResponse) return rateLimitResponse;

  // Continue with route logic
  // ...
}
```

## Error Response

When rate limit is exceeded (429 Too Many Requests):

```json
{
  "success": false,
  "message": "Too many requests. Please try again in X seconds."
}
```

## Production Considerations

1. **Storage Options**
   - Replace in-memory Map with Redis
   - Use distributed rate limiting
   - Consider cluster-aware solutions

2. **Configuration**
   - Environment-based limits
   - Different limits per route
   - IP address validation

3. **Monitoring**
   - Rate limit metrics
   - Abuse detection
   - Alert thresholds

## Best Practices

1. **Rate Limit Design**
   - Set appropriate limits
   - Consider user experience
   - Plan for bursts

2. **Error Handling**
   - Clear user feedback
   - Proper retry guidance
   - Standard headers

3. **Security**
   - IP spoofing protection
   - Header validation
   - DoS prevention

## Dependencies

- next/server for Next.js types and utilities

## Example Configurations

### Basic Protection

```typescript
// 5 requests per minute
await rateLimitMiddleware(request);
```

### Strict API Limits

```typescript
// 2 requests per 5 minutes
await rateLimitMiddleware(request, 2, 5 * 60 * 1000);
```

### High-Volume Endpoints

```typescript
// 100 requests per minute
await rateLimitMiddleware(request, 100, 60 * 1000);
```
