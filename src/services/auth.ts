import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Login user with email and password
 * @param email User email
 * @param password User password
 * @returns User data
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    // In development mode, use mock authentication
    if (process.env.NODE_ENV === 'development' || !API_URL) {
      console.log('Using mock authentication for login');
      return getMockUser(email);
    }
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }
    
    const data = await response.json();
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('pasa_token', data.token);
    }
    
    // Store authentication state in Chrome storage
    if (chrome && chrome.storage) {
      chrome.storage.local.set({ isAuthenticated: true, user: data.user });
    }
    
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register a new user
 * @param email User email
 * @param password User password
 * @param name User full name
 * @returns User data
 */
export async function register(email: string, password: string, name: string): Promise<User> {
  try {
    // In development mode, use mock authentication
    if (process.env.NODE_ENV === 'development' || !API_URL) {
      console.log('Using mock authentication for registration');
      return getMockUser(email, name);
    }
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }
    
    const data = await response.json();
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('pasa_token', data.token);
    }
    
    // Store authentication state in Chrome storage
    if (chrome && chrome.storage) {
      chrome.storage.local.set({ isAuthenticated: true, user: data.user });
    }
    
    return data.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  try {
    // In development mode, use mock authentication
    if (process.env.NODE_ENV === 'development' || !API_URL) {
      console.log('Using mock authentication for logout');
      localStorage.removeItem('pasa_token');
      
      // Clear Chrome storage
      if (chrome && chrome.storage) {
        chrome.storage.local.set({ isAuthenticated: false, user: null });
      }
      
      return;
    }
    
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to logout');
    }
    
    // Remove the token from localStorage
    localStorage.removeItem('pasa_token');
    
    // Clear Chrome storage
    if (chrome && chrome.storage) {
      chrome.storage.local.set({ isAuthenticated: false, user: null });
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Get the current user data
 * @returns User data
 */
export async function getMe(): Promise<User> {
  try {
    // In development mode, use mock authentication
    if (process.env.NODE_ENV === 'development' || !API_URL) {
      console.log('Using mock authentication for getMe');
      
      // Check if there's a token (mock auth)
      const token = localStorage.getItem('pasa_token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Get the stored email from the token (in a real app this would be decoded)
      const email = token.split(':')[0];
      return getMockUser(email);
    }
    
    // Get the token from localStorage
    const token = localStorage.getItem('pasa_token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('pasa_token');
        if (chrome && chrome.storage) {
          chrome.storage.local.set({ isAuthenticated: false, user: null });
        }
        throw new Error('Not authenticated');
      }
      
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user data');
    }
    
    const data = await response.json();
    
    // Store authentication state in Chrome storage
    if (chrome && chrome.storage) {
      chrome.storage.local.set({ isAuthenticated: true, user: data.user });
    }
    
    return data.user;
  } catch (error) {
    console.error('GetMe error:', error);
    throw error;
  }
}

/**
 * Get a mock user for development
 * @param email User email
 * @param name User name (optional)
 * @returns Mock user data
 */
function getMockUser(email: string, name?: string): User {
  // Create a token using email
  const token = `${email}:mock-token-${Date.now()}`;
  localStorage.setItem('pasa_token', token);
  
  // Store in Chrome storage if available
  if (chrome && chrome.storage) {
    const user = {
      id: `user-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      hasResume: false,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };
    
    chrome.storage.local.set({ isAuthenticated: true, user });
    return user;
  }
  
  return {
    id: `user-${Date.now()}`,
    email,
    name: name || email.split('@')[0],
    hasResume: false,
    role: 'user' as const,
    createdAt: new Date().toISOString(),
  };
} 