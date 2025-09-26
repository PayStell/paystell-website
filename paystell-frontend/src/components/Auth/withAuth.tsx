import { useRouter } from 'next/navigation';
import { useEffect, useState, ComponentType } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Higher Order Component that protects routes requiring authentication
 * Redirects unauthenticated users to the login page
 *
 * @template P - The props type of the wrapped component
 * @param Component - The component to be wrapped with authentication protection
 * @returns A new component that includes authentication checks
 */
export function withAuth<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  function WithAuth(props: P): JSX.Element | null {
    const router = useRouter();
    const [authState, setAuthState] = useState<AuthState>({
      isAuthenticated: false,
      isLoading: true,
    });

    useEffect(() => {
      // Check if user is authenticated
      const token = localStorage.getItem('token');

      if (!token) {
        // Redirect to login page if not authenticated
        router.push('/login');
      } else {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
        });
      }
    }, [router]);

    // Show loading state while checking authentication
    if (authState.isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="ml-4 text-lg">Authenticating...</p>
        </div>
      );
    }

    // Render the wrapped component if authenticated
    return authState.isAuthenticated ? <Component {...props} /> : null;
  }

  // Set display name for debugging purposes
  WithAuth.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return WithAuth;
}
