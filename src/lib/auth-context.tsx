import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextData } from '../types';
import * as authService from '../services/auth';

// Define the context interface
interface AuthContextType extends AuthContextData {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('pasa_token');
        
        if (token) {
          // Fetch the user data
          const userData = await authService.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear any invalid tokens
        localStorage.removeItem('pasa_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.register(email, password, name);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google sign in (mock implementation for the extension)
  const googleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would be implemented with actual Google OAuth
      // For now, we'll create a mock user
      const mockEmail = `user-${Date.now()}@gmail.com`;
      const userData = await authService.login(mockEmail, 'google-auth');
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password (mock implementation)
  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // This would call an API endpoint in production
      console.log(`Password reset requested for: ${email}`);
      // Mock successful response
      return Promise.resolve();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password (mock implementation)
  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // This would call an API endpoint in production
      console.log(`Password reset with token: ${token}`);
      // Mock successful response
      return Promise.resolve();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    googleSignIn,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, loading } = useAuthContext();
    
    // Show loading state
    if (loading) {
      return <div className="loading">Loading...</div>;
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // In a real app, you would likely use a router to navigate to login
      return (
        <div className="unauthorized">
          <h2>Please log in to view this page</h2>
          {/* You would typically include a login button or redirect here */}
        </div>
      );
    }
    
    // If authenticated, render the wrapped component
    return <Component {...props} />;
  };
} 