import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  isWalletVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  twoFactorAuth?: {
    isEnabled: boolean;
  };
}

export interface AuthResponse {
  user: UserResponse;
  tokens: TokenResponse;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const formattedData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      };
      const response = await axios.post(`${API_URL}/auth/register`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 