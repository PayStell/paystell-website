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
  const emailService = new EmailService();
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  // Routes
  router.post(
    '/login',
    rateLimiterMiddleware({ windowMs: 60000, max: 5 }),
    authController.loginUser
  );

  router.post(
    '/signup',
    rateLimiterMiddleware({ windowMs: 60000, max: 3 }),
    authController.signUpUser
  );

  return router;
}
