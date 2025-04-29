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

  /**
 * @openapi
 * /wallet-verification/initiate:
 *   post:
 *     summary: Initiate wallet verification
 *     description: Starts the wallet verification process and sends a code to the user's email.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 example: "GDLU4Y7G7KENDOMXJLFENSG4TENUP2YXZZOIDFRN4YCNDGPAOSALJWA3"
 *     responses:
 *       200:
 *         description: Verification initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Verification initiated successfully. Check your email for the verification code."
 *                 data:
 *                   type: object
 *                   properties:
 *                     walletAddress:
 *                       type: string
 *                       example: "GDLU4Y7G7KENDOMXJLFENSG4TENUP2YXZZOIDFRN4YCNDGPAOSALJWA3"
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-30T14:38:34.287Z"
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
  router.post(
    '/initiate',
    authMiddleware,
    // rateLimiterMiddleware({ windowMs: 60000, max: 3 }),
    walletVerificationController.initiateVerification
  );

  /**
 * @openapi
 * /wallet-verification/verify:
 *   post:
 *     summary: Verify wallet
 *     description: Confirms a wallet using a verification code sent to the user's email.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 example: "GDLU4Y7G7KENDOMXJLFENSG4TENUP2YXZZOIDFRN4YCNDGPAOSALJWA3"
 *               verificationCode:
 *                 type: string
 *                 example: "251014"
 *     responses:
 *       200:
 *         description: Wallet verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Wallet verified successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     walletAddress:
 *                       type: string
 *                       example: "GDLU4Y7G7KENDOMXJLFENSG4TENUP2YXZZOIDFRN4YCNDGPAOSALJWA3"
 *                     status:
 *                       type: string
 *                       example: "verified"
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
  router.post(
    '/verify',
    authMiddleware,
    // rateLimiterMiddleware({ windowMs: 60000, max: 5 }),
    walletVerificationController.verifyWallet
  );

  /**
 * @openapi
 * /wallet-verification/status/{walletAddress}:
 *   get:
 *     summary: Check wallet verification status
 *     description: Returns whether the given wallet address is verified for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         required: true
 *         schema:
 *           type: string
 *         example: "GDLU4Y7G7KENDOMXJLFENSG4TENUP2YXZZOIDFRN4YCNDGPAOSALJWA3"
 *     responses:
 *       200:
 *         description: Status response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Wallet is verified"
 *                 data:
 *                   type: object
 *                   properties:
 *                     verified:
 *                       type: boolean
 *                       example: true
 *                     walletAddress:
 *                       type: string
 *                       example: "GDLU4Y7G7KENDOMXJLFENSG4TENUP2YXZZOIDFRN4YCNDGPAOSALJWA3"
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Missing or invalid wallet address
 *       500:
 *         description: Server error
 */
  router.get(
    '/status/:walletAddress',
    authMiddleware,
    walletVerificationController.checkWalletStatus
  );

  return router;
}
