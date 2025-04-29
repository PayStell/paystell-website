import { Router } from 'express';
import { AuthController } from '../../../modules/auth/controllers/auth.controller';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { AppDataSource } from '../../../utils/database';
import { User } from '../../user/entities/User';
import { EmailService } from '../../../services/email.service';
import { rateLimiterMiddleware } from '../../../middlewares/rate-limiter.middleware';

/**
 * Sets up authentication routes
 * @returns Express router
 */
export function setupAuthRoutes(): Router {
  const router = Router();

  // Repositories and services
  const userRepository = AppDataSource.getRepository(User);
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  // Routes
  /**
   * @openapi
   * /auth/login:
   *   post:
   *     description: Login a user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: secretpassword
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Invalid credentials
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/login',
    rateLimiterMiddleware({ windowMs: 60000, max: 5 }),
    authController.loginUser
  );


  /**
   * @openapi
   * /auth/signup:
   *   post:
   *     description: Signup a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 example: johndoe@example.com
   *               password:
   *                 type: string
   *                 example: password123
  *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Invalid credentials
   *       409:
   *        description: User already exists
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/signup',
    rateLimiterMiddleware({ windowMs: 60000, max: 3 }),
    authController.signUpUser
  );

  return router;
}
