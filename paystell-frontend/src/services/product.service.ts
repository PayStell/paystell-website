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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
      // Check if API mocking is enabled
      const isMockingEnabled =
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

      // In development mode, use mock data if API is not available or mocking is enabled
      if (process.env.NODE_ENV === "development" && isMockingEnabled) {
        return this.getMockProductData(productId, merchantWalletAddress);
      }

      // Make real API call
      const response = await api.get(`/products/${productId}`, {
        params: { merchantWalletAddress },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching product data:", error);

      // Fallback to mock data in development only if API call fails
      if (process.env.NODE_ENV === "development") {
        console.warn("API call failed, falling back to mock product data");
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
    // Decode the product ID to get a meaningful name
    const productName = decodeURIComponent(productId.replace(/-/g, " "));

    // Generate different data based on product ID to simulate real API behavior
    const productIdHash = this.hashString(productId);
    const basePrice = 50 + (productIdHash % 200); // Price between 50-250
    const serviceFee = Math.round(basePrice * 0.1); // 10% service fee

    // Generate different SKUs based on product ID
    const skuPrefix = this.getSkuPrefix(productId);
    const sku = `${skuPrefix}-${productIdHash.toString().slice(-6)}`;

    // Generate different features based on product type
    const features = this.getFeaturesByProductType(productId);

    return {
      id: productId,
      name: productName,
      sku: sku,
      price: basePrice,
      serviceFee: serviceFee,
      features: features,
      merchantWalletAddress:
        merchantWalletAddress || "GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      description: `Premium ${productName} with advanced features`,
      currency: "USDC",
    };
  }

  /**
   * Generate a hash for consistent but varied data based on product ID
   * @param str - The string to hash
   * @returns Hash number
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get SKU prefix based on product type
   * @param productId - The product ID
   * @returns SKU prefix
   */
  private static getSkuPrefix(productId: string): string {
    const lowerId = productId.toLowerCase();

    if (lowerId.includes("headphone") || lowerId.includes("audio")) {
      return "AUD";
    } else if (lowerId.includes("phone") || lowerId.includes("mobile")) {
      return "MOB";
    } else if (lowerId.includes("laptop") || lowerId.includes("computer")) {
      return "COM";
    } else if (lowerId.includes("watch") || lowerId.includes("fitness")) {
      return "FIT";
    } else if (lowerId.includes("camera") || lowerId.includes("photo")) {
      return "CAM";
    } else {
      return "GEN";
    }
  }

  /**
   * Get features based on product type
   * @param productId - The product ID
   * @returns Array of features
   */
  private static getFeaturesByProductType(productId: string): string[] {
    const lowerId = productId.toLowerCase();

    if (lowerId.includes("headphone") || lowerId.includes("audio")) {
      return [
        "Noise cancellation technology",
        "40-hour battery life",
        "Premium sound quality",
        "1-year warranty",
        "Bluetooth 5.0",
        "Touch controls",
      ];
    } else if (lowerId.includes("phone") || lowerId.includes("mobile")) {
      return [
        "5G connectivity",
        "High-resolution camera",
        "Long battery life",
        "Water resistant",
        "Fast charging",
        "Security features",
      ];
    } else if (lowerId.includes("laptop") || lowerId.includes("computer")) {
      return [
        "High-performance processor",
        "SSD storage",
        "Backlit keyboard",
        "Multiple ports",
        "Long battery life",
        "Premium build quality",
      ];
    } else if (lowerId.includes("watch") || lowerId.includes("fitness")) {
      return [
        "Heart rate monitoring",
        "GPS tracking",
        "Water resistant",
        "Sleep tracking",
        "7-day battery life",
        "Health metrics",
      ];
    } else if (lowerId.includes("camera") || lowerId.includes("photo")) {
      return [
        "High-resolution sensor",
        "4K video recording",
        "Image stabilization",
        "Multiple lenses",
        "Professional quality",
        "Weather sealed",
      ];
    } else {
      return [
        "Premium quality",
        "Durable construction",
        "1-year warranty",
        "Customer support",
        "Fast shipping",
        "Money-back guarantee",
      ];
    }
  }

  /**
   * Validate product exists and is active
   * @param productId - The product ID
   * @returns True if product is valid
   */
  static async validateProduct(productId: string): Promise<boolean> {
    try {
      const isMockingEnabled =
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

      if (process.env.NODE_ENV === "development" && isMockingEnabled) {
        // In mock mode, validate that product ID is not empty and has reasonable length
        return (
          Boolean(productId) && productId.length > 0 && productId.length <= 100
        );
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
      const isMockingEnabled =
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

      if (process.env.NODE_ENV === "development" && isMockingEnabled) {
        // Generate consistent price based on product ID
        const productIdHash = this.hashString(productId);
        return 50 + (productIdHash % 200); // Price between 50-250
      }

      const response = await api.get(`/products/${productId}/price`);
      return response.data.price;
    } catch (error) {
      console.error("Error fetching product price:", error);
      throw new Error("Failed to fetch product price");
    }
  }
}
