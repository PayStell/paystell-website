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

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const formattedData = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role
    };
    const response = await axios.post(`${API_URL}/auth/register`, formattedData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
    return response.data;
  }

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/auth/logout`);
  }
}

export const authService = new AuthService(); 