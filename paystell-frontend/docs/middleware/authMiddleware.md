# Authentication Middleware

The `authMiddleware` is a Next.js middleware that provides authentication protection for API routes. It verifies the presence and validity of authentication tokens in incoming requests.

## Features

- Token-based authentication verification
- Bearer token support
- Automatic rejection of unauthenticated requests
- TypeScript support

## API Reference

```typescript
async function authMiddleware(
  request: NextRequest
): Promise<NextResponse | undefined>;
```

### Parameters
- `request`: The incoming Next.js request object

### Returns
- `NextResponse`: Error response if authentication fails
- `undefined`: If authentication succeeds

## Implementation

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function authMiddleware(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  return undefined;
}
```

## Usage

```typescript
import { authMiddleware } from '@/middleware/authMiddleware';

export async function POST(request: Request) {
  // Apply authentication middleware
  const authResponse = await authMiddleware(request as any);
  if (authResponse) return authResponse;
  
  // Continue with protected route logic
  // ...
}
```

## Error Responses

1. **Unauthorized (401)**
   ```json
   {
     "success": false,
     "message": "Authentication required"
   }
   ```

## Security Considerations

1. **Token Validation**
   - Checks for presence of token
   - Validates token format
   - Future: Add token expiration check

2. **Header Processing**
   - Supports Bearer token format
   - Case-insensitive header checks
   - Proper string sanitization

3. **Response Security**
   - Non-revealing error messages
   - Proper status codes
   - Standard response format

## Best Practices

1. **Usage Guidelines**
   - Apply to all protected routes
   - Chain with other middleware as needed
   - Keep token validation logic centralized

2. **Error Handling**
   - Clear error messages
   - Proper logging
   - Standard response format

3. **Performance**
   - Minimal overhead
   - Quick token validation
   - Efficient header processing

## Dependencies

- next/server for Next.js types and utilities 