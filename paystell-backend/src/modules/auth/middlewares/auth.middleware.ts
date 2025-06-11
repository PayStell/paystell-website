import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError, errorTypes } from '../../../utils/error-handler';
import { getRepository } from 'typeorm';
import { User } from '../../user/entities/User';

/**
 * JWT payload interface
 */
interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role?: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Sets user information in req.user
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please provide a valid token.', errorTypes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'default_secret'
    ) as JwtPayload;
    
    // Check if token has expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      throw new AppError('Token has expired. Please login again.', errorTypes.UNAUTHORIZED);
    }
    
    // Add user to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token. Please login again.', errorTypes.UNAUTHORIZED));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token has expired. Please login again.', errorTypes.UNAUTHORIZED));
    }
    next(error);
  }
};

/**
 * Enhanced authentication middleware that also fetches user from database
 * Useful when you need additional user information beyond what's in the JWT
 */
export const enhancedAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // First run the basic auth middleware
    await new Promise<void>((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // If basic auth passed, fetch complete user from database
    if (req.user?.id) {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });
      
      if (!user) {
        throw new AppError('User not found or has been deactivated.', errorTypes.UNAUTHORIZED);
      }
      
      // Check if user is active
      if (!user.active) {
        throw new AppError('User account has been deactivated.', errorTypes.UNAUTHORIZED);
      }
      
      // Enhance user object with additional info
      req.user.name = user.name;
      // Add other user fields as needed
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param roles Array of roles allowed to access the route
 * @returns Middleware function
 */
export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // First ensure the user is authenticated
      await new Promise<void>((resolve, reject) => {
        enhancedAuthMiddleware(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Check if user has required role
      if (!req.user?.role || !roles.includes(req.user.role)) {
        throw new AppError('You do not have permission to perform this action', errorTypes.FORBIDDEN);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};


/**
 * Generate JWT token for a user
 * @param userId User ID
 * @param email User email
 * @param expiresIn Token expiration time (defaults to value in env or '7d')
 * @returns JWT token string
 */
export const generateToken = (
    userId: string,
    email: string,
    expiresIn?: SignOptions['expiresIn']
  ): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
  
    const token = jwt.sign(
      { id: userId, email },
      secret,
      {
        expiresIn: expiresIn ?? (process.env.JWT_EXPIRES_IN ?? '7d'),
      } as SignOptions
    );
  
    return token;
  };