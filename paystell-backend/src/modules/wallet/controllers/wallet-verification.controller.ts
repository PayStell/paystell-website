import { Request, Response } from 'express';
import { WalletVerificationService } from '../services/wallet-verification.service';
import { InitiateVerificationDto, VerifyWalletDto } from '../dtos/wallet-verification.dto';
import { ApiResponse } from '../dtos/response.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { handleError, AppError, errorTypes } from '../../../utils/error-handler';

export class WalletVerificationController {
  constructor(private walletVerificationService: WalletVerificationService) {}

  /**
   * Initiates wallet verification process
   * @param req Express request
   * @param res Express response
   */
  initiateVerification = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract user ID from authenticated session
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', errorTypes.UNAUTHORIZED);
      }

      // Validate request body
      const initiateDto = plainToClass(InitiateVerificationDto, req.body);

      // Check if the body is undefined or null
      if (!initiateDto || !initiateDto.walletAddress) {
        throw new AppError('Invalid request body', errorTypes.BAD_REQUEST);
      }

      const errors = await validate(initiateDto);

      if (errors.length > 0) {
        throw new AppError(
          `Validation failed: ${errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ')}`,
          errorTypes.BAD_REQUEST
        );
      }

      // Call service to initiate verification
      const result = await this.walletVerificationService.initiateVerification(
        userId,
        initiateDto.walletAddress
      );

      res.status(200).json(ApiResponse.success(
        'Verification initiated successfully. Check your email for the verification code.',
        result.data
      ));
    } catch (error) {
      handleError(error, res);
    }
  };

  /**
   * Verifies a wallet with provided verification code
   * @param req Express request
   * @param res Express response
   */
  verifyWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract user ID from authenticated session
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', errorTypes.UNAUTHORIZED);
      }

      // Validate request body
      const verifyDto = plainToClass(VerifyWalletDto, req.body);

      // Check if the body is undefined or null
      if (!verifyDto || !verifyDto.verificationCode || !verifyDto.walletAddress) {
        throw new AppError('Invalid request body', errorTypes.BAD_REQUEST);
      }

      const errors = await validate(verifyDto);

      if (errors.length > 0) {
        throw new AppError(
          `Validation failed: ${errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ')}`,
          errorTypes.BAD_REQUEST
        );
      }

      // Call service to verify wallet
      const result = await this.walletVerificationService.verifyWallet(
        userId,
        verifyDto.verificationCode,
        verifyDto.walletAddress
      );

      res.status(200).json(ApiResponse.success(
        'Wallet verified successfully',
        result.data
      ));
    } catch (error) {
      handleError(error, res);
    }
  };

  /**
   * Check if a wallet is verified for the current user
   * @param req Express request
   * @param res Express response
   */
  checkWalletStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract user ID from authenticated session
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', errorTypes.UNAUTHORIZED);
      }

      const walletAddress = req.params.walletAddress;
      if (!walletAddress) {
        throw new AppError('Wallet address is required', errorTypes.BAD_REQUEST);
      }

      const isVerified = await this.walletVerificationService.isWalletVerified(userId, walletAddress);
      
      res.status(200).json(ApiResponse.success(
        isVerified ? 'Wallet is verified' : 'Wallet is not verified',
        { verified: isVerified, walletAddress }
      ));
    } catch (error) {
      handleError(error, res);
    }
  };
}
