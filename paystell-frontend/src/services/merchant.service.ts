import axios from 'axios';

export interface MerchantData {
  id: string;
  name: string;
  walletAddress: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
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

export class MerchantService {
  /**
   * Validate merchant wallet address
   * @param walletAddress - The merchant wallet address
   * @returns True if merchant is valid and active
   */
  static async validateMerchant(walletAddress: string): Promise<boolean> {
    try {
      // In development mode, use mock validation if API is not available
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'
      ) {
        return this.validateMockMerchant(walletAddress);
      }

      // Make real API call to validate merchant
      const response = await api.get(`/merchants/validate`, {
        params: { walletAddress },
      });

      return response.data.isValid;
    } catch (error) {
      console.error('Error validating merchant:', error);

      // Fallback to mock validation in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Falling back to mock merchant validation');
        return this.validateMockMerchant(walletAddress);
      }

      return false;
    }
  }

  /**
   * Get merchant data by wallet address
   * @param walletAddress - The merchant wallet address
   * @returns Merchant data
   */
  static async getMerchantByWallet(walletAddress: string): Promise<MerchantData | null> {
    try {
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'
      ) {
        return this.getMockMerchantData(walletAddress);
      }

      const response = await api.get(`/merchants/wallet/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching merchant data:', error);

      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Falling back to mock merchant data');
        return this.getMockMerchantData(walletAddress);
      }

      return null;
    }
  }

  /**
   * Validate Stellar public key format
   * @param walletAddress - The wallet address to validate
   * @returns True if format is valid
   */
  static isValidStellarPublicKey(walletAddress: string): boolean {
    return /^G[A-Z2-7]{55}$/.test(walletAddress);
  }

  /**
   * Mock merchant validation for development
   * @param walletAddress - The merchant wallet address
   * @returns True if mock validation passes
   */
  private static validateMockMerchant(walletAddress: string): boolean {
    // Basic format validation
    if (!this.isValidStellarPublicKey(walletAddress)) {
      return false;
    }

    // Mock validation logic for development
    // In production, this would be replaced with actual database validation
    return walletAddress.startsWith('G') && walletAddress.length === 56;
  }

  /**
   * Get mock merchant data for development
   * @param walletAddress - The merchant wallet address
   * @returns Mock merchant data
   */
  private static getMockMerchantData(walletAddress: string): MerchantData | null {
    // Mock merchant data for development
    return {
      id: 'mock-merchant-1',
      name: 'Mock Merchant',
      walletAddress,
      isActive: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
