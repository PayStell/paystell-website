"use client";

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  type ReactNode 
} from "react";
import type { User } from "@/lib/types/user";
import { UserRole, type Permission, ROLE_PERMISSIONS } from "@/lib/types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  getUserRole: () => UserRole | null;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Check for token in localStorage
        const token = localStorage.getItem("token");
        if (token) {
          // In a real app, validate token with backend
          // For now, we'll use mock data
          const mockUser: User = {
            id: "1",
            email: "user@example.com",
            name: "John Doe",
            role: UserRole.USER,
            twoFactorEnabled: false,
          };
          setUser(mockUser);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError("Failed to initialize authentication");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, call your API
      // For now, use mock data
      const response = await mockLoginAPI(email, password);
      
      // Store token
      localStorage.setItem("token", response.token);
      
      // Set user
      setUser(response.user);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, call your API
      // For now, use mock data
      const response = await mockRegisterAPI(userData, password);
      
      // Store token
      localStorage.setItem("token", response.token);
      
      // Set user
      setUser(response.user);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return userPermissions.includes(permission);
  };

  // Get user role
  const getUserRole = (): UserRole | null => {
    return user ? user.role : null;
  };

  // Update user role (admin function)
  const updateUserRole = async (userId: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, call your API
      // For now, use mock implementation
      await mockUpdateUserRoleAPI(userId, role);
      
      // If updating the current user, update local state
      if (user && user.id === userId) {
        setUser({ ...user, role });
      }
    } catch (err) {
      console.error("Update role error:", err);
      setError("Failed to update user role");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    hasPermission,
    getUserRole,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Mock API functions (to be replaced with real API calls)
async function mockLoginAPI(email: string, password: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (email === "admin@example.com" && password === "admin123") {
    return {
      token: "mock-admin-token",
      user: {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: UserRole.ADMIN,
        twoFactorEnabled: false,
      },
    };
  }
  
  if (email === "merchant@example.com" && password === "merchant123") {
    return {
      token: "mock-merchant-token",
      user: {
        id: "2",
        email: "merchant@example.com",
        name: "Merchant User",
        businessName: "Example Store",
        role: UserRole.MERCHANT,
        twoFactorEnabled: false,
      },
    };
  }
  
  if (email === "user@example.com" && password === "user123") {
    return {
      token: "mock-user-token",
      user: {
        id: "3",
        email: "user@example.com",
        name: "Regular User",
        role: UserRole.USER,
        twoFactorEnabled: false,
      },
    };
  }
  
  throw new Error("Invalid credentials");
}

async function mockRegisterAPI(
  userData: Partial<User>, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _password: string
) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Default to USER role if not specified
  const role = userData.role || UserRole.USER;
  
  return {
    token: "mock-register-token",
    user: {
      id: "new-user-id",
      email: userData.email || "",
      name: userData.name || "",
      role,
      businessName: userData.businessName,
      profileImage: userData.profileImage,
      twoFactorEnabled: false,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function mockUpdateUserRoleAPI(_userId: string, _role: UserRole) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, you would call your backend API
  // For now, just return success
  return { success: true };
} 