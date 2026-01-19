import { createContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  const logout = async () => {
    console.log('Logout function called');
    try {
      // Call logout endpoint (session-based)
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear authentication state
      console.log('Clearing authentication state...');
      localStorage.removeItem('token');
      
      // Clear all React Query cache
      queryClient.clear();
      queryClient.removeQueries();
      
      // Force a hard redirect to ensure clean state
      window.location.href = '/';
    }
  };

  const value: AuthContextType = {
    user: user && typeof user === 'object' ? user as User : null,
    isLoading,
    isAuthenticated: !!user && typeof user === 'object',
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}