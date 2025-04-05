import { useState, useEffect, useCallback } from 'react';
import * as authService from '@/lib/auth';
import { User } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'));
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.login(email, password);
      setUser(user);
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: {
    email: string;
    password: string;
    fullName: string;
    currentRole?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.register(userData);
      setUser(user);
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Registration failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Google sign-in function
  const googleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.googleSignIn();
      setUser(user);
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Google sign-in failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Forgot password function
  const forgotPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.forgotPassword(email);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Forgot password request failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(token, newPassword);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Password reset failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    googleSignIn,
    forgotPassword,
    resetPassword,
    logout,
  };
} 