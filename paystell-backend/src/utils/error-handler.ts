export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const errorTypes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER: 500
  };
  
  export const handleError = (err: any, res: any) => {
    if (err instanceof AppError && err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: {
          code: err.statusCode,
          message: err.message
        }
      });
    }
  
    // For unhandled errors
    console.error('ERROR ', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: {
        code: 500,
        message: 'Internal server error'
      }
    });
  };