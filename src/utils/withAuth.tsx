import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';
import { User } from 'firebase/auth';

interface WithAuthProps {
  user: User | null;
  [key: string]: unknown;
}

// Auth context protection for admin routes
export const withAuth = <P extends object>(Component: React.ComponentType<P & WithAuthProps>) => {
  return function AuthComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      // If not loading and no user, redirect to login
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);
    
    // If the authentication is still loading
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center bg-emerald-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    
    // If the user is not authenticated, show redirecting message
    if (!user) {
      return (
        <div className="flex h-screen items-center justify-center bg-emerald-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      );
    }
    
    // If the user is authenticated, render the protected component
    return <Component {...props as P} user={user} />;
  };
};
