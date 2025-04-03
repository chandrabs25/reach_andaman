"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// Define types for our context
type UserRole = 'admin' | 'user' | 'vendor';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: UserRole;
  } | null;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Handle the case where useSession might return undefined during SSR/static generation
  const session = useSession();
  const sessionData = session?.data;
  const sessionStatus = session?.status || 'loading';
  
  const [user, setUser] = useState<AuthContextType['user']>(null);
  
  useEffect(() => {
    if (sessionData?.user) {
      setUser({
        id: sessionData.user.id as string,
        name: sessionData.user.name || undefined,
        email: sessionData.user.email || undefined,
        role: (sessionData.user.role as UserRole) || 'user',
      });
    } else {
      setUser(null);
    }
  }, [sessionData]);

  const value = {
    isAuthenticated: !!sessionData,
    isLoading: sessionStatus === 'loading',
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
