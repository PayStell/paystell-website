# withAuth Higher-Order Component

The `withAuth` HOC (Higher-Order Component) provides authentication protection for routes and components in the application. It ensures that only authenticated users can access protected content.

## Features

- Route protection for authenticated content
- Automatic redirection to login page for unauthenticated users
- Loading state during authentication check
- TypeScript support with proper type inference

## Usage

```tsx
import { withAuth } from '@/components/Auth/withAuth';

interface MyComponentProps {
  data: string;
  onAction: () => void;
}

function MyComponent({ data, onAction }: MyComponentProps) {
  return (
    <div>
      <h1>Protected Content</h1>
      <p>{data}</p>
      <button onClick={onAction}>Action</button>
    </div>
  );
}

// Wrap the component with authentication protection
export default withAuth(MyComponent);
```

## Type Definition

```typescript
function withAuth<P extends object>(
  Component: React.ComponentType<P>,
): (props: P) => React.ReactElement | null;
```

## Implementation Details

1. **Authentication Check**

   - Verifies the presence of an authentication token in localStorage
   - Redirects to login page if no token is found
   - Maintains authentication state using React hooks

2. **Loading State**

   - Displays a loading spinner during authentication check
   - Prevents content flash for unauthenticated users

3. **Type Safety**
   - Preserves component prop types
   - Provides proper type inference for wrapped components

## States

The HOC manages three main states:

1. **Loading**: Initial authentication check
2. **Authenticated**: Component is rendered
3. **Unauthenticated**: Redirect to login page

## Example with Next.js Page

```tsx
import { withAuth } from '@/components/Auth/withAuth';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Protected dashboard content */}
    </div>
  );
}

export default withAuth(DashboardPage);
```

## Dependencies

- next/navigation for routing
- React hooks (useState, useEffect)
- Local storage for token management

## Best Practices

1. **Usage Guidelines**

   - Apply to components that require authentication
   - Use at the page level for route protection
   - Combine with role-based access control when needed

2. **Performance Considerations**

   - Minimal impact on component rendering
   - Efficient token checking
   - Smart caching of authentication state

3. **Security Notes**
   - Token storage in localStorage
   - Proper token validation
   - Secure redirect handling
