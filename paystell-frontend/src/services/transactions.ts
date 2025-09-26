import { api } from '@/lib/api';

export interface Transaction {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: 'paid' | 'pending' | 'failed';
  method: string;
  amount: number;
  date: string;
}

export interface TransactionsResponse {
  items: Transaction[];
  total: number;
  pages: number;
}

export const transactionsService = {
  getRecent: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<{ success: boolean; data?: TransactionsResponse; error?: string }> => {
    try {
      const response = await api.get<TransactionsResponse>(
        `/transactions/recent?page=${page}&limit=${limit}`,
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions',
      };
    }
  },
};
