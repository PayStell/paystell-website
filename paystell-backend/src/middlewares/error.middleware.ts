import { Request, Response, NextFunction } from 'express';
import { AppError, errorTypes } from '../utils/error-handler';

export const errorMiddleware = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.statusCode,
        message: err.message
      }
    });
  } else {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: {
        code: 500,
        message: 'Internal server error'
      }
    });
  }
};