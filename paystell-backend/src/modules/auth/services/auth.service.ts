import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/User';
import { AppError, errorTypes } from '../../../utils/error-handler';
import { generateToken } from '../middlewares/auth.middleware';

export class AuthService {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

 
  async loginUser(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'password', 'active'] });

    if (!user || !user.active) {
      throw new AppError('Invalid credentials or inactive account', errorTypes.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', errorTypes.UNAUTHORIZED);
    }

    const token = generateToken(user.id, user.email);
    return { token };
  }

  /**
   * Sign up new user and return JWT token
   */
  async signUpUser(name: string, email: string, password: string): Promise<{ token: string }> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already in use', errorTypes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      active: true,
      isWalletVerified: false,
    });

    await this.userRepository.save(newUser);


    const token = generateToken(newUser.id, newUser.email);
    return { token };
  }
}
