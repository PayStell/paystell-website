import { DEV_CONFIG } from '@/config/development';

const USE_MOCK = process.env.NODE_ENV === 'development' && DEV_CONFIG.MOCK_API;

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  averageTransactionValue: number;
  salesByPeriod: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface SalesByPeriod {
  period: string;
  totalSales: number;
  transactionCount: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalSales: number;
  quantitySold: number;
  rank: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

class SalesService {
  private baseUrl = '/api/sales-summary';

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async getSalesSummary(): Promise<ApiResponse<SalesSummary>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.MOCK_DELAY));
      return {
        success: true,
        data: DEV_CONFIG.MOCK_SALES_DATA
      };
    }

    try {
      const response = await fetch(this.baseUrl);
      return this.handleResponse<SalesSummary>(response);
    } catch (error) {
      console.error('Error fetching sales summary:', error);
      throw error;
    }
  }

  async getSalesByTimePeriod(period: 'daily' | 'weekly' | 'monthly', startDate?: Date, endDate?: Date): Promise<ApiResponse<SalesByPeriod[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.MOCK_DELAY));
      const mockData = DEV_CONFIG.MOCK_CHART_DATA.map(item => ({
        period: item.month,
        totalSales: item.desktop + item.mobile,
        transactionCount: Math.floor((item.desktop + item.mobile) / 100)
      }));
      return {
        success: true,
        data: mockData
      };
    }

    try {
      const params = new URLSearchParams({
        period,
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      });

      const response = await fetch(`${this.baseUrl}/time-period/${period}?${params}`);
      return this.handleResponse<SalesByPeriod[]>(response);
    } catch (error) {
      console.error('Error fetching sales by time period:', error);
      throw error;
    }
  }

  async getTopProducts(limit: number = 10, startDate?: Date, endDate?: Date): Promise<ApiResponse<TopProduct[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.MOCK_DELAY));
      const mockProducts = [
        { id: '1', name: 'Product A', totalSales: 50000, quantitySold: 150, rank: 1 },
        { id: '2', name: 'Product B', totalSales: 35000, quantitySold: 100, rank: 2 },
        { id: '3', name: 'Product C', totalSales: 25000, quantitySold: 75, rank: 3 }
      ];
      return {
        success: true,
        data: mockProducts
      };
    }

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      });

      const response = await fetch(`${this.baseUrl}/top-products?${params}`);
      return this.handleResponse<TopProduct[]>(response);
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  }

  async getTotalSales(startDate?: Date, endDate?: Date): Promise<ApiResponse<{ totalSales: number; period: { start: string; end: string } }>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, DEV_CONFIG.MOCK_DELAY));
      return {
        success: true,
        data: {
          totalSales: DEV_CONFIG.MOCK_SALES_DATA.totalSales,
          period: {
            start: startDate?.toISOString() || new Date().toISOString(),
            end: endDate?.toISOString() || new Date().toISOString()
          }
        }
      };
    }

    try {
      const params = new URLSearchParams({
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      });

      const response = await fetch(`${this.baseUrl}/total?${params}`);
      return this.handleResponse<{ totalSales: number; period: { start: string; end: string } }>(response);
    } catch (error) {
      console.error('Error fetching total sales:', error);
      throw error;
    }
  }
}

export const salesService = new SalesService();