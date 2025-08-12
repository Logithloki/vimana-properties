import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { useState, useEffect } from 'react';

// Check if we're using demo mode
const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your-api-key' ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'demo-api-key';

export const signIn = async (email: string, password: string) => {
  try {
    // For demo mode, allow sign in with demo credentials
    if (isDemoMode && email === 'admin@example.com' && password === 'password123') {
      console.log('Demo login successful');
      // Create mock user
      const mockUser = {
        uid: 'demo-user-id',
        email: 'admin@example.com',
        displayName: 'Demo Admin',
      };
      // Store in localStorage to persist the session
      localStorage.setItem('demo-user', JSON.stringify(mockUser));
      return mockUser;
    } else if (isDemoMode) {
      throw new Error('Invalid credentials. For demo use: admin@example.com / password123');
    } else {
      // Real Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    }
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    if (isDemoMode) {
      // Clear demo user from localStorage
      localStorage.removeItem('demo-user');
      return true;
    } else {
      await firebaseSignOut(auth);
      return true;
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Custom hook to handle auth state
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user on component mount (for page refreshes)
    if (isDemoMode) {
      const demoUser = localStorage.getItem('demo-user');
      if (demoUser) {
        try {
          const parsedUser = JSON.parse(demoUser);
          setUser(parsedUser as User);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing demo user:', error);
          localStorage.removeItem('demo-user');
        }
      }
      setLoading(false);
    } else {
      // Real Firebase authentication
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  return { user, loading };
};

// withAuth has been moved to its own file in withAuth.tsx
// This is just here for reference
/*
export const withAuth = (Component: any) => {
  return function AuthComponent(props: any) {
    // This function is implemented in withAuth.tsx
    console.warn('withAuth is not properly implemented as it requires JSX in a .tsx file');
    return null;
  };
};
*/
