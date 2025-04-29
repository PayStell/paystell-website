import { VerificationStatus } from '../entities/WalletVerification';

export interface IWalletVerification {
  id: string;
  userId: string;
  walletAddress: string;
  verificationToken: string;
  verificationCode: string;
  status: VerificationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  verificationAttempts: number;
  lastAttemptAt: Date;
}

export interface IWalletVerificationService {
  initiateVerification(userId: string, walletAddress: string): Promise<IWalletVerificationResponse>;
  verifyWallet(userId: string, verificationCode: string, walletAddress: string): Promise<IWalletVerificationResponse>;
  isWalletVerified(userId: string, walletAddress: string): Promise<boolean>;
  cleanupExpiredVerifications(): Promise<void>;
}

export interface IWalletVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    walletAddress?: string;
    status?: VerificationStatus;
    expiresAt?: Date;
  };
  error?: any;
}