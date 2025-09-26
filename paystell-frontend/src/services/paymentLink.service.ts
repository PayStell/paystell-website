import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  // Use the environment variable or fallback to the default backend URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
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
  if (process.env.NODE_ENV === 'development') {
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      baseURL: config.baseURL,
    });
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

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

export interface CreatePaymentLinkDto {
  /** Required, max length 100 characters */
  name: string;
  /** Required, must be positive number */
  amount: number;
  /** Required, max length 3 characters */
  currency: string;
  /** Required, must be unique, max length 50 characters */
  sku: string;
  /** Required, must be one of: "active", "inactive", "expired" */
  status: 'active' | 'inactive' | 'expired';
  /** Optional, max length 500 characters */
  description?: string;
  /** Optional, date string */
  expirationDate?: string;
}

export interface PaymentLink {
  id: string;
  name: string;
  amount: number;
  currency: string;
  sku?: string;
  status: string;
  slug: string;
  createdAt: string;
  description?: string;
  deletedAt?: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createPaymentLink = async (data: CreatePaymentLinkDto): Promise<PaymentLink> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending payment link data:', data);
    }
    const response = await api.post('/paymentlink', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment link creation failed:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config,
        });
      }
      throw new Error(error.response?.data?.message || 'Failed to create payment link');
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const getPaymentLinks = async (): Promise<PaginatedResponse<PaymentLink>> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching payment links...');
    }
    const response = await api.get('/paymentlink/user');
    if (process.env.NODE_ENV === 'development') {
      console.log('Payment links response:', response.data);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch payment links:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
      if (error.response?.status === 404) {
        return {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        };
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payment links');
    }
    throw error;
  }
};

export const updatePaymentLink = async (
  id: string,
  data: Partial<CreatePaymentLinkDto>,
): Promise<PaymentLink> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Updating payment link:', { id, data });
    }
    const response = await api.put(`/paymentlink/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment link update failed:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config,
        });
      }
      throw new Error(error.response?.data?.message || 'Failed to update payment link');
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const softDeletePaymentLink = async (id: string): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Soft deleting payment link:', id);
    }
    await api.patch(`/paymentlink/${id}/soft-delete`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment link deletion failed:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config,
        });
      }
      throw new Error(error.response?.data?.message || 'Failed to delete payment link');
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
