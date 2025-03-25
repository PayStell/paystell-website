import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Higher Order Component that protects routes requiring authentication
 * Redirects unauthenticated users to the login page
 * 
 * @param Component The component to be wrapped with authentication protection
 * @returns A new component that includes authentication checks
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login page if not authenticated
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    }, [router]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="ml-4 text-lg">Authenticating...</p>
        </div>
      );
    }

    // Render the wrapped component if authenticated
    return isAuthenticated ? <Component {...props} /> : null;
  };
} 