import { LessThan, Repository } from 'typeorm';
import { WalletVerification, VerificationStatus } from '../entities/WalletVerification';
import { User } from '../../user/entities/User';
import { IWalletVerificationService, IWalletVerificationResponse } from '../interfaces/wallet-verification.interface';
import { StellarValidator, TokenGenerator } from '../../../utils/validators';
import { AppError, errorTypes } from '../../../utils/error-handler';
import { EmailService } from '../../../services/email.service';

export class WalletVerificationService implements IWalletVerificationService {
  constructor(
    private walletVerificationRepository: Repository<WalletVerification>,
    private userRepository: Repository<User>,
    private emailService: EmailService
  ) {}

  /**
   * Initiates wallet verification process
   * @param userId The user ID
   * @param walletAddress The Stellar wallet address to verify
   * @returns Verification response
   */
  async initiateVerification(userId: string, walletAddress: string): Promise<IWalletVerificationResponse> {
    // Validate wallet address
    if (!StellarValidator.isValidStellarAddress(walletAddress)) {
      throw new AppError('Invalid Stellar wallet address', errorTypes.BAD_REQUEST);
    }

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', errorTypes.NOT_FOUND);
    }

    // Check if wallet is already being verified
    const existingVerification = await this.walletVerificationRepository.findOne({
      where: { 
        userId,
        walletAddress,
        status: VerificationStatus.PENDING
      }
    });

    // If there's an existing pending verification that hasn't expired
    if (existingVerification && existingVerification.expiresAt > new Date()) {
      // If last attempt was less than 1 minute ago, prevent spamming
      if (existingVerification.lastAttemptAt && 
          (new Date().getTime() - existingVerification.lastAttemptAt.getTime() < 60000)) {
        throw new AppError('Please wait before requesting another verification code', errorTypes.TOO_MANY_REQUESTS);
      }

      // Generate new verification code and update
      existingVerification.verificationCode = TokenGenerator.generateVerificationCode();
      existingVerification.verificationAttempts = 0;
      existingVerification.lastAttemptAt = new Date();
      
      // Update token expiration to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      existingVerification.expiresAt = expiresAt;

      await this.walletVerificationRepository.save(existingVerification);
      
      // Send email with verification code
      try {
        await this.emailService.sendVerificationEmail(
          user.email, 
          existingVerification.verificationCode,
          walletAddress
        );
      } catch (error) {
        console.error('Failed to send verification email:', error);
        throw new AppError('Failed to send verification email', errorTypes.INTERNAL_SERVER);
      }

      return {
        success: true,
        message: 'Verification code sent successfully',
        data: {
          walletAddress,
          status: VerificationStatus.PENDING,
          expiresAt: existingVerification.expiresAt
        }
      };
    }

    // Create new verification record
    const verificationToken = TokenGenerator.generateVerificationToken();
    const verificationCode = TokenGenerator.generateVerificationCode();
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const newVerification = this.walletVerificationRepository.create({
      userId,
      walletAddress,
      verificationToken,
      verificationCode,
      status: VerificationStatus.PENDING,
      expiresAt,
      verificationAttempts: 0,
      lastAttemptAt: new Date()
    });

    await this.walletVerificationRepository.save(newVerification);

    // Send email with verification code
    try {
      await this.emailService.sendVerificationEmail(
        user.email, 
        verificationCode,
        walletAddress
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new AppError('Failed to send verification email', errorTypes.INTERNAL_SERVER);
    }

    return {
      success: true,
      message: 'Verification initiated successfully',
      data: {
        walletAddress,
        status: VerificationStatus.PENDING,
        expiresAt
      }
    };
  }

  /**
   * Verifies a wallet with provided verification code
   * @param userId The user ID
   * @param verificationCode The verification code
   * @param walletAddress The wallet address to verify
   * @returns Verification response
   */
  async verifyWallet(
    userId: string, 
    verificationCode: string, 
    walletAddress: string
  ): Promise<IWalletVerificationResponse> {
    // Find the verification record
    const verification = await this.walletVerificationRepository.findOne({
      where: {
        userId,
        walletAddress,
        status: VerificationStatus.PENDING
      }
    });

    if (!verification) {
      throw new AppError('No pending verification found for this wallet address', errorTypes.NOT_FOUND);
    }

    // Check if verification has expired
    if (verification.expiresAt < new Date()) {
      verification.status = VerificationStatus.EXPIRED;
      await this.walletVerificationRepository.save(verification);
      throw new AppError('Verification has expired. Please request a new verification', errorTypes.BAD_REQUEST);
    }

    // Update attempt data
    verification.verificationAttempts += 1;
    verification.lastAttemptAt = new Date();

    // Check if too many attempts (limit to 5)
    if (verification.verificationAttempts > 5) {
      verification.status = VerificationStatus.FAILED;
      await this.walletVerificationRepository.save(verification);
      throw new AppError('Too many verification attempts. Please request a new verification', errorTypes.TOO_MANY_REQUESTS);
    }

    // Verify the code
    if (verification.verificationCode !== verificationCode) {
      await this.walletVerificationRepository.save(verification);
      throw new AppError('Invalid verification code', errorTypes.BAD_REQUEST);
    }

    // Update verification status to verified
    verification.status = VerificationStatus.VERIFIED;
    await this.walletVerificationRepository.save(verification);

    // Update user's wallet information if needed
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        // Assuming User entity has a walletAddress field and isWalletVerified flag
        user.walletAddress = walletAddress;
        user.isWalletVerified = true;
        await this.userRepository.save(user);
      }
    } catch (error) {
      console.error('Failed to update user wallet info:', error);
      // Don't fail the process if user update fails
    }

    return {
      success: true,
      message: 'Wallet verified successfully',
      data: {
        walletAddress,
        status: VerificationStatus.VERIFIED
      }
    };
  }

  /**
   * Checks if a wallet is verified for a user
   * @param userId The user ID
   * @param walletAddress The wallet address to check
   * @returns Boolean indicating if wallet is verified
   */
  async isWalletVerified(userId: string, walletAddress: string): Promise<boolean> {
    const verification = await this.walletVerificationRepository.findOne({
      where: {
        userId,
        walletAddress,
        status: VerificationStatus.VERIFIED
      }
    });

    return !!verification;
  }

  /**
   * Cleans up expired verification records
   * This should be run as a scheduled job
   */
  async cleanupExpiredVerifications(): Promise<void> {
    const now = new Date();
    
    const expiredVerifications = await this.walletVerificationRepository.find({
      where: {
        status: VerificationStatus.PENDING,
        expiresAt: LessThan(now)
      }
    });

    if (expiredVerifications.length > 0) {
      for (const verification of expiredVerifications) {
        verification.status = VerificationStatus.EXPIRED;
      }
      await this.walletVerificationRepository.save(expiredVerifications);
    }
  }
}