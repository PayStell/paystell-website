'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Permission } from '@/lib/types/user';

interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  isWalletVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MockAuthContextType {
  user: MockUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored auth data
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('mock_token');
        const storedUser = localStorage.getItem('mock_user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking mock auth:', error);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - accept any credentials
    const mockUser: MockUser = {
      id: 1,
      name: 'Test User',
      email: email,
      role: 'user',
      isEmailVerified: true,
      isWalletVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockToken = 'mock_jwt_token_' + Date.now();

    setToken(mockToken);
    setUser(mockUser);
    localStorage.setItem('mock_token', mockToken);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    // Mock registration
    const mockUser: MockUser = {
      id: 1,
      name: name,
      email: email,
      role: role,
      isEmailVerified: true,
      isWalletVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockToken = 'mock_jwt_token_' + Date.now();

    setToken(mockToken);
    setUser(mockUser);
    localStorage.setItem('mock_token', mockToken);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mock_token');
    localStorage.removeItem('mock_user');
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        loading,
        isLoading: loading,
        hasPermission: (permission: Permission) => {
          // Mock - always return true for testing
          return true;
        },
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};
