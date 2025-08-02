import axios from "axios";

export interface ProductData {
  id: string;
  name: string;
  sku: string;
  price: number;
  serviceFee: number;
  features: string[];
  merchantWalletAddress: string;
  description?: string;
  image?: string;
  currency?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ProductService {
  /**
   * Get product data by ID
   * @param productId - The product ID
   * @param merchantWalletAddress - The merchant wallet address
   * @returns Product data
   */
  static async getProductData(
    productId: string,
    merchantWalletAddress: string | null
  ): Promise<ProductData> {
    try {
      // In development mode, use mock data if API is not available
      if (
        process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
      ) {
        return this.getMockProductData(productId, merchantWalletAddress);
      }

      // Make real API call
      const response = await api.get(`/products/${productId}`, {
        params: { merchantWalletAddress },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching product data:", error);

      // Fallback to mock data in development
      if (process.env.NODE_ENV === "development") {
        console.warn("Falling back to mock product data");
        return this.getMockProductData(productId, merchantWalletAddress);
      }

      throw new Error("Failed to fetch product data");
    }
  }

  /**
   * Get mock product data for development
   * @param productId - The product ID
   * @param merchantWalletAddress - The merchant wallet address
   * @returns Mock product data
   */
  private static getMockProductData(
    productId: string,
    merchantWalletAddress: string | null
  ): ProductData {
    const productName = decodeURIComponent(productId.replace(/-/g, " "));

    return {
      id: productId,
      name: productName,
      sku: "SKU-WH-PRO-2023",
      price: 79.99,
      serviceFee: 10.0,
      features: [
        "Noise cancellation technology",
        "40-hour battery life",
        "Premium sound quality",
        "1-year warranty",
      ],
      merchantWalletAddress: merchantWalletAddress || "",
      description: `Premium ${productName} with advanced features`,
      currency: "USDC",
    };
  }

  /**
   * Validate product exists and is active
   * @param productId - The product ID
   * @returns True if product is valid
   */
  static async validateProduct(productId: string): Promise<boolean> {
    try {
      if (
        process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
      ) {
        return true; // Mock validation for development
      }

      const response = await api.get(`/products/${productId}/validate`);
      return response.data.isValid;
    } catch (error) {
      console.error("Error validating product:", error);
      return false;
    }
  }

  /**
   * Get product price by ID
   * @param productId - The product ID
   * @returns Product price
   */
  static async getProductPrice(productId: string): Promise<number> {
    try {
      if (
        process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
      ) {
        return 79.99; // Mock price for development
      }

      const response = await api.get(`/products/${productId}/price`);
      return response.data.price;
    } catch (error) {
      console.error("Error fetching product price:", error);
      throw new Error("Failed to fetch product price");
    }
  }
}
