import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Handle unauthorized error (e.g., redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export interface CreateDepositRequest {
  amount?: string;
  asset: string;
  memo?: string;
  customAddress?: string;
}

export interface DepositResponse {
  success: boolean;
  deposit: unknown;
  message?: string;
}

export interface DepositsResponse {
  success: boolean;
  deposits: unknown[];
  total: number;
}

export interface MonitoringConfig {
  address: string;
  asset: string;
  minAmount?: string;
  maxAmount?: string;
  memo?: string;
}

export interface MonitoringResponse {
  success: boolean;
  config?: MonitoringConfig;
  configs?: MonitoringConfig[];
  total?: number;
  message?: string;
}

export const createDepositRequest = async (
  data: CreateDepositRequest,
): Promise<DepositResponse> => {
  try {
    const response = await api.post('/api/deposit', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create deposit request');
    }
    throw error;
  }
};

export const getDepositRequests = async (
  userId?: string,
  status?: string,
): Promise<DepositsResponse> => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (status) params.append('status', status);

    const response = await api.get(`/api/deposit?${params.toString()}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get deposit requests');
    }
    throw error;
  }
};

export const getDepositRequest = async (id: string): Promise<DepositResponse> => {
  try {
    const response = await api.get(`/api/deposit/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get deposit request');
    }
    throw error;
  }
};

export const updateDepositRequest = async (
  id: string,
  updates: Record<string, unknown>,
): Promise<DepositResponse> => {
  try {
    const response = await api.put(`/api/deposit/${id}`, updates);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update deposit request');
    }
    throw error;
  }
};

export const deleteDepositRequest = async (id: string): Promise<DepositResponse> => {
  try {
    const response = await api.delete(`/api/deposit/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete deposit request');
    }
    throw error;
  }
};

export const startMonitoring = async (config: MonitoringConfig): Promise<MonitoringResponse> => {
  try {
    const response = await api.post('/api/deposit/monitor', config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to start monitoring');
    }
    throw error;
  }
};

export const getMonitoringConfigs = async (
  address?: string,
  asset?: string,
): Promise<MonitoringResponse> => {
  try {
    const params = new URLSearchParams();
    if (address) params.append('address', address);
    if (asset) params.append('asset', asset);

    const response = await api.get(`/api/deposit/monitor?${params.toString()}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get monitoring configs');
    }
    throw error;
  }
};

export const stopMonitoring = async (
  address: string,
  asset: string,
): Promise<MonitoringResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('address', address);
    params.append('asset', asset);

    const response = await api.delete(`/api/deposit/monitor?${params.toString()}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to stop monitoring');
    }
    throw error;
  }
};
