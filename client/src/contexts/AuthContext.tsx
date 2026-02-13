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
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  const extractedUser = data && typeof data === 'object' 
    ? (data as any).user || data 
    : null;

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
        headers,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      queryClient.clear();
      queryClient.removeQueries();
      window.location.href = '/';
    }
  };

  const value: AuthContextType = {
    user: extractedUser && typeof extractedUser === 'object' && extractedUser.id ? extractedUser as User : null,
    isLoading,
    isAuthenticated: !!extractedUser && typeof extractedUser === 'object' && !!extractedUser.id,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}