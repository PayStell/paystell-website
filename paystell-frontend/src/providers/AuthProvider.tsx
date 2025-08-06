"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, AuthResponse } from "../services/auth.service";
import { ROLE_PERMISSIONS, Permission } from "@/lib/types/user";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check for stored token and user data
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Validate the user object has required fields
            if (
              parsedUser &&
              typeof parsedUser === "object" &&
              "id" in parsedUser &&
              "email" in parsedUser &&
              "name" in parsedUser
            ) {
              setToken(storedToken);
              setUser(parsedUser);
            } else {
              // If user data is invalid, clear it
              localStorage.removeItem("user");
              localStorage.removeItem("token");
            }
          } catch (error) {
            console.error("Error parsing stored user data:", error);
            // Clear invalid data
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        // localStorage might not be available (SSR)
      } finally {
        setLoading(false);
      }
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      initializeAuth();
    } else {
      // If we're on server side, just set loading to false
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setToken(response.tokens.accessToken);
      setUser(response.user);
      localStorage.setItem("token", response.tokens.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
      });
      setToken(response.tokens.accessToken);
      setUser(response.user);
      localStorage.setItem("token", response.tokens.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
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
          if (!user) return false;
          const userPermissions =
            ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS];
          return userPermissions?.includes(permission) || false;
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
