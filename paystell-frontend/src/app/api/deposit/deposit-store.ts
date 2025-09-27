import { DepositRequest } from "@/lib/types/deposit";

// Shared in-memory store for deposit requests
// In production, use a database
export const depositRequests = new Map<string, DepositRequest>();

// Helper functions for deposit management
export const depositStore = {
  create: (id: string, deposit: DepositRequest) => {
    depositRequests.set(id, deposit);
    return deposit;
  },

  get: (id: string) => {
    return depositRequests.get(id);
  },

  update: (id: string, updates: Partial<DepositRequest>) => {
    const existing = depositRequests.get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...updates };
    depositRequests.set(id, updated);
    return updated;
  },

  delete: (id: string) => {
    return depositRequests.delete(id);
  },

  getAll: () => {
    return Array.from(depositRequests.values());
  },

  getByUser: (userId: string) => {
    return Array.from(depositRequests.values())
      .filter(deposit => deposit.ownerId === userId);
  }
};
