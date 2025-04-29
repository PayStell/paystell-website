import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { handleError, AppError, errorTypes } from '../../../utils/error-handler';
import { ApiResponse } from '../../../modules/wallet/dtos/response.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto, SignUpDto } from '../dtos/auth.dto';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handles user login
   */
  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginDto = plainToClass(LoginDto, req.body);
      if (!loginDto) {
        throw new AppError('Invalid request body', errorTypes.BAD_REQUEST);
      }

      const errors = await validate(loginDto);

      if (errors.length > 0) {
        const errorMsg = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
        throw new AppError(`Validation failed: ${errorMsg}`, errorTypes.BAD_REQUEST);
      }

      const result = await this.authService.loginUser(loginDto.email, loginDto.password);

      res.status(200).json(ApiResponse.success('Login successful', result));
    } catch (error) {
      handleError(error, res);
    }
  };

  /**
   * Handles new user registration
   */
  signUpUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const signUpDto = plainToClass(SignUpDto, req.body);
      if (!signUpDto) {
        throw new AppError('Invalid request body', errorTypes.BAD_REQUEST);
      }

      const errors = await validate(signUpDto);

      if (errors.length > 0) {
        const errorMsg = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
        throw new AppError(`Validation failed: ${errorMsg}`, errorTypes.BAD_REQUEST);
      }

      const result = await this.authService.signUpUser(signUpDto.name, signUpDto.email, signUpDto.password);

      res.status(201).json(ApiResponse.success('User registered successfully', result));
    } catch (error) {
      handleError(error, res);
    }
  };
}
