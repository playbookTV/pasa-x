// Authentication service for Pasa
import axios from 'axios';
import * as db from './db';
import { compare, hash } from 'bcryptjs';

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  currentRole?: string;
  hasResume: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API endpoints for authentication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pasa.app';
const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
};

// For temporary mock authentication during development
const MOCK_USER: User = {
  id: 'user-123',
  email: 'demo@pasa.app',
  fullName: 'Demo User',
  currentRole: 'Software Engineer',
  hasResume: true,
};

// Local storage keys
const TOKEN_KEY = 'pasa_auth_token';
const USER_KEY = 'pasa_user';

// Helper functions
const saveToStorage = (key: string, value: any) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    // Chrome extension storage
    chrome.storage.local.set({ [key]: value });
  } else {
    // Regular local storage (for web development)
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const getFromStorage = async (key: string): Promise<any> => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    // Chrome extension storage
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  } else {
    // Regular local storage (for web development)
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
};

const removeFromStorage = (key: string) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    // Chrome extension storage
    chrome.storage.local.remove(key);
  } else {
    // Regular local storage (for web development)
    localStorage.removeItem(key);
  }
};

// Generate a JWT token (simplified for demo)
const generateToken = (userId: string): string => {
  // In a real app, use a proper JWT library
  const payload = { userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }; // 7 days
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// Main authentication functions
export const login = async (email: string, password: string): Promise<User> => {
  try {
    // If API URL is set, use external API
    if (import.meta.env.VITE_API_URL) {
      const response = await axios.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      saveToStorage(TOKEN_KEY, response.data.token);
      saveToStorage(USER_KEY, response.data.user);
      return response.data.user;
    }
    
    // Otherwise, use Prisma DB directly (for development)
    const user = await db.getUserByEmail(email);
    
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }
    
    const isPasswordValid = await compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    const userData: User = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      currentRole: user.currentRole || undefined,
      hasResume: user.hasResume,
    };
    
    const token = generateToken(user.id);
    
    saveToStorage(TOKEN_KEY, token);
    saveToStorage(USER_KEY, userData);
    
    return userData;
  } catch (error) {
    // Fallback to mock auth if DB isn't available yet
    if (email === 'demo@pasa.app' && password === 'password') {
      const mockResponse: AuthResponse = {
        user: MOCK_USER,
        token: 'mock-token-123',
      };
      saveToStorage(TOKEN_KEY, mockResponse.token);
      saveToStorage(USER_KEY, mockResponse.user);
      return mockResponse.user;
    }
    
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData: {
  email: string;
  password: string;
  fullName: string;
  currentRole?: string;
}): Promise<User> => {
  try {
    // If API URL is set, use external API
    if (import.meta.env.VITE_API_URL) {
      const response = await axios.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, userData);

      saveToStorage(TOKEN_KEY, response.data.token);
      saveToStorage(USER_KEY, response.data.user);
      return response.data.user;
    }
    
    // Otherwise, use Prisma DB directly (for development)
    const existingUser = await db.getUserByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const passwordHash = await hash(userData.password, 10);
    
    const newUser = await db.createUser({
      email: userData.email,
      fullName: userData.fullName,
      passwordHash,
      currentRole: userData.currentRole,
    });
    
    const userResponse: User = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      currentRole: newUser.currentRole || undefined,
      hasResume: newUser.hasResume,
    };
    
    const token = generateToken(newUser.id);
    
    saveToStorage(TOKEN_KEY, token);
    saveToStorage(USER_KEY, userResponse);
    
    return userResponse;
  } catch (error) {
    // Fallback to mock auth if DB isn't available yet
    if (!process.env.DATABASE_URL) {
      const mockUser: User = {
        ...MOCK_USER,
        email: userData.email,
        fullName: userData.fullName,
        currentRole: userData.currentRole,
        hasResume: false,
      };
      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-token-456',
      };
      saveToStorage(TOKEN_KEY, mockResponse.token);
      saveToStorage(USER_KEY, mockResponse.user);
      return mockResponse.user;
    }
    
    console.error('Registration error:', error);
    throw error;
  }
};

export const googleSignIn = async (): Promise<User> => {
  try {
    // For development, use mock authentication if API URL is not set
    if (!import.meta.env.VITE_API_URL) {
      const mockResponse: AuthResponse = {
        user: MOCK_USER,
        token: 'mock-token-789',
      };
      saveToStorage(TOKEN_KEY, mockResponse.token);
      saveToStorage(USER_KEY, mockResponse.user);
      return mockResponse.user;
    }

    // In a real implementation, this would redirect to Google OAuth
    // and handle the callback, but for now we'll just simulate it
    const response = await axios.get<AuthResponse>(AUTH_ENDPOINTS.GOOGLE_AUTH);

    saveToStorage(TOKEN_KEY, response.data.token);
    saveToStorage(USER_KEY, response.data.user);
    return response.data.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    if (!import.meta.env.VITE_API_URL) {
      // Mock success for development
      console.log(`Password reset email would be sent to ${email}`);
      return;
    }

    await axios.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    if (!import.meta.env.VITE_API_URL) {
      // Mock success for development
      console.log('Password would be reset with token:', token);
      return;
    }

    await axios.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export const logout = (): void => {
  removeFromStorage(TOKEN_KEY);
  removeFromStorage(USER_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const user = await getFromStorage(USER_KEY);
  return user;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getFromStorage(TOKEN_KEY);
  return !!token;
};

export const getAuthToken = async (): Promise<string | null> => {
  return getFromStorage(TOKEN_KEY);
}; 