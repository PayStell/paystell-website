
import { Repository } from 'typeorm';

import bcrypt from 'bcrypt';
import { User } from '../../user/entities/User';
import { AuthService } from '../services/auth.service';
import { generateToken } from '../middlewares/auth.middleware';
import { AppError, errorTypes } from '../../../utils/error-handler';


// Create mock functions
const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
} as unknown as Repository<User>;

// Mock bcrypt and token
jest.mock('bcrypt');
jest.mock('../middlewares/auth.middleware', () => ({
  generateToken: jest.fn(() => 'mocked-token'),
}));

describe('AuthService - signUpUser', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(mockUserRepository);
    jest.clearAllMocks();
  });

  it('should sign up a new user and return a token', async () => {
    const name = 'John Doe';
    const email = 'john@example.com';
    const password = 'securePassword';

    // Set mock responses
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null); // no existing user
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (mockUserRepository.create as jest.Mock).mockReturnValue({
      id: 'user-id',
      name,
      email,
      password: 'hashedPassword',
      active: true,
      isWalletVerified: false,
    });
    (mockUserRepository.save as jest.Mock).mockResolvedValue(undefined);

    const result = await authService.signUpUser(name, email, password);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(generateToken).toHaveBeenCalledWith('user-id', email);
    expect(result).toEqual({ token: 'mocked-token' });
  });

  it('should throw error if email is already in use', async () => {
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue({ id: 'existing-id' });

    await expect(
      authService.signUpUser('Jane', 'jane@example.com', 'pass123')
    ).rejects.toThrow(AppError);

    expect(mockUserRepository.findOne).toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should login a user and return a token', async () => {
    const email = 'john@example.com';
    const password = 'securePassword';

    // Mock user data
    const user = {
      id: 'user-id',
      email,
      password: 'hashedPassword', // This would be a hashed password
      active: true,
    };

    // Set mock responses
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Password is correct

    const result = await authService.loginUser(email, password);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email },
      select: ['id', 'email', 'password', 'active'],
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    expect(generateToken).toHaveBeenCalledWith(user.id, user.email);
    expect(result).toEqual({ token: 'mocked-token' });
  });

it('should throw error if user is not found', async () => {
    const email = 'nonexistent@example.com';
    const password = 'password123';

    // Set mock response for no user found
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(authService.loginUser(email, password)).rejects.toThrow(
      new AppError('Invalid credentials or inactive account', errorTypes.UNAUTHORIZED)
    );

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email },
      select: ['id', 'email', 'password', 'active'],
    });
  });

it('should throw error if password is incorrect', async () => {
    const email = 'john@example.com';
    const password = 'wrongPassword';
    
    // Mock user data
    const user = {
      id: 'user-id',
      email,
      password: 'hashedPassword', // This would be a hashed password
      active: true,
    };

    // Set mock responses
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Incorrect password

    await expect(authService.loginUser(email, password)).rejects.toThrow(
      new AppError('Invalid credentials', errorTypes.UNAUTHORIZED)
    );

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email },
      select: ['id', 'email', 'password', 'active'],
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
  });

it('should throw error if user is inactive', async () => {
    const email = 'john@example.com';
    const password = 'securePassword';

    // Mock user data with inactive account
    const user = {
      id: 'user-id',
      email,
      password: 'hashedPassword', // This would be a hashed password
      active: false,
    };

    // Set mock responses
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Password is correct

    await expect(authService.loginUser(email, password)).rejects.toThrow(
      new AppError('Invalid credentials or inactive account', errorTypes.UNAUTHORIZED)
    );

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email },
      select: ['id', 'email', 'password', 'active'],
    });
  });
});
