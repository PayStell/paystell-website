import { Router } from 'express';
import { WalletVerificationController } from '../controllers/wallet-verification.controller';
import { WalletVerificationService } from '../services/wallet-verification.service';
import { EmailService } from '../../../services/email.service';
import { WalletVerification } from '../entities/WalletVerification';
import { User } from '../../user/entities/User';
import { authMiddleware } from '../../auth/middlewares/auth.middleware'; 
import { rateLimiterMiddleware } from '../../../middlewares/rate-limiter.middleware';
import { AppDataSource } from '../../../utils/database';

/**
 * Sets up wallet verification routes
 * @returns Express router
 */
export function setupWalletVerificationRoutes(): Router {
  const router = Router();

  const walletVerificationRepository = AppDataSource.getRepository(WalletVerification);
  const userRepository = AppDataSource.getRepository(User);

  const emailService = new EmailService();

  const walletVerificationService = new WalletVerificationService(
    walletVerificationRepository,
    userRepository,
    emailService
  );

  const walletVerificationController = new WalletVerificationController(
    walletVerificationService
  );

  router.post(
    '/initiate',
    authMiddleware,
    // rateLimiterMiddleware({ windowMs: 60000, max: 3 }),
    walletVerificationController.initiateVerification
  );

  router.post(
    '/verify',
    authMiddleware,
    // rateLimiterMiddleware({ windowMs: 60000, max: 5 }),
    walletVerificationController.verifyWallet
  );

  router.get(
    '/status/:walletAddress',
    authMiddleware,
    walletVerificationController.checkWalletStatus
  );

  return router;
}
