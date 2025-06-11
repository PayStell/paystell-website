import { WalletVerificationService } from '../services/wallet-verification.service';
import { AppError } from '../../../utils/error-handler';
import { VerificationStatus } from '../entities/WalletVerification';
import { StellarValidator, TokenGenerator } from '../../../utils/validators';

jest.mock('../../../utils/validators', () => ({
  StellarValidator: {
    isValidStellarAddress: jest.fn(),
  },
  TokenGenerator: {
    generateVerificationToken: jest.fn(() => 'mocked-token'),
    generateVerificationCode: jest.fn(() => '123456'),
  },
}));

describe('WalletVerificationService - initiateVerification', () => {
  const mockWalletVerificationRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn(),
  };

  const service = new WalletVerificationService(
    mockWalletVerificationRepository as any,
    mockUserRepository as any,
    mockEmailService as any
  );

  const validUser = {
    id: 'user-123',
    email: 'user@example.com',
  };

  const validWallet = 'GVALIDSTELLARADDRESS12345';

  beforeEach(() => {
    jest.clearAllMocks();
    (StellarValidator.isValidStellarAddress as jest.Mock).mockReturnValue(true);
  });

  it('throws if wallet address is invalid', async () => {
    (StellarValidator.isValidStellarAddress as jest.Mock).mockReturnValue(false);

    await expect(
      service.initiateVerification(validUser.id, 'invalid-wallet')
    ).rejects.toThrow(AppError);
  });

  it('throws if user is not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(
      service.initiateVerification(validUser.id, validWallet)
    ).rejects.toThrow('User not found');
  });

  it('throws if a pending verification exists and was requested too recently', async () => {
    mockUserRepository.findOne.mockResolvedValue(validUser);

    const recentAttempt = new Date(Date.now() - 30 * 1000); // 30 seconds ago
    const expiresLater = new Date(Date.now() + 3600 * 1000); // 1 hour later

    mockWalletVerificationRepository.findOne.mockResolvedValue({
      walletAddress: validWallet,
      status: VerificationStatus.PENDING,
      expiresAt: expiresLater,
      lastAttemptAt: recentAttempt,
    });

    await expect(
      service.initiateVerification(validUser.id, validWallet)
    ).rejects.toThrow('Please wait before requesting another verification code');
  });

  it('updates pending verification and sends email if enough time has passed', async () => {
    mockUserRepository.findOne.mockResolvedValue(validUser);

    const oldAttempt = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
    const expiresLater = new Date(Date.now() + 3600 * 1000);

    const existingVerification = {
      walletAddress: validWallet,
      status: VerificationStatus.PENDING,
      expiresAt: expiresLater,
      lastAttemptAt: oldAttempt,
      verificationAttempts: 0,
      userId: validUser.id,
    };

    mockWalletVerificationRepository.findOne.mockResolvedValue(existingVerification);
    mockWalletVerificationRepository.save.mockResolvedValue({});

    const response = await service.initiateVerification(validUser.id, validWallet);

    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
      validUser.email,
      '123456',
      validWallet
    );
    expect(response.success).toBe(true);
    expect(response.data.status).toBe(VerificationStatus.PENDING);
  });

  it('creates new verification and sends email if no existing one is found', async () => {
    mockUserRepository.findOne.mockResolvedValue(validUser);
    mockWalletVerificationRepository.findOne.mockResolvedValue(null);

    mockWalletVerificationRepository.create.mockImplementation((data) => data);
    mockWalletVerificationRepository.save.mockResolvedValue({});

    const response = await service.initiateVerification(validUser.id, validWallet);

    expect(mockWalletVerificationRepository.create).toHaveBeenCalled();
    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
      validUser.email,
      '123456',
      validWallet
    );
    expect(response.success).toBe(true);
    expect(response.message).toBe('Verification initiated successfully');
    expect(response.data.status).toBe(VerificationStatus.PENDING);
  });
});
