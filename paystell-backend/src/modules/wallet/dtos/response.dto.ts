import { VerificationStatus } from '../entities/WalletVerification';

export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;

  constructor(success: boolean, message: string, data?: T, error?: any) {
    this.success = success;
    this.message = message;
    if (data) this.data = data;
    if (error) this.error = error;
  }

  static success<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error<T>(message: string, error?: any): ApiResponse<T> {
    return new ApiResponse<T>(false, message, undefined, error);
  }
}

export class VerificationResponseDto {
  walletAddress: string;
  status: VerificationStatus;
  expiresAt?: Date;
}