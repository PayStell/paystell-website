const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface InitiateWalletVerificationRequest {
  userId: number;
  walletAddress: string;
}

export interface InitiateWalletVerificationResponse {
  id: number;
  userId: number;
  walletAddress: string;
  verificationToken: string;
  expiresAt: string;
  status: string;
}

export interface VerifyWalletRequest {
  token: string;
  code: string;
}

export interface VerifyWalletResponse {
  success: boolean;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
}

export const walletVerificationAPI = {
  // Initiate wallet verification
  initiateVerification: async (
    data: InitiateWalletVerificationRequest,
  ): Promise<InitiateWalletVerificationResponse> => {
    const response = await fetch(`${API_BASE_URL}/wallet-verification/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json();
      throw new Error(error.message || 'Failed to initiate wallet verification');
    }

    return response.json();
  },

  // Verify wallet with token and code
  verifyWallet: async (data: VerifyWalletRequest): Promise<VerifyWalletResponse> => {
    const response = await fetch(`${API_BASE_URL}/wallet-verification/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json();
      throw new Error(error.message || 'Failed to verify wallet');
    }

    return response.json();
  },
};
