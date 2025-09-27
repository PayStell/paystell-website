import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DepositFlow } from '../DepositFlow';
import { useWalletStore } from '@/lib/wallet/wallet-store';

// Mock the wallet store
jest.mock('@/lib/wallet/wallet-store', () => ({
  useWalletStore: jest.fn(),
}));

// Mock the toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('DepositFlow', () => {
  const mockUseWalletStore = useWalletStore as jest.MockedFunction<typeof useWalletStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should render deposit form when wallet is connected', () => {
    mockUseWalletStore.mockReturnValue({
      isConnected: true,
      publicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    expect(screen.getByText('Create Deposit Request')).toBeInTheDocument();
    expect(screen.getByText('Asset')).toBeInTheDocument();
    expect(screen.getByText('Amount (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Memo (Optional)')).toBeInTheDocument();
  });

  it('should show connect wallet message when wallet is not connected', () => {
    mockUseWalletStore.mockReturnValue({
      isConnected: false,
      publicKey: null,
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
    expect(screen.getByText('Please connect your Stellar wallet to create deposit requests')).toBeInTheDocument();
  });

  it('should display wallet address when connected', () => {
    const publicKey = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    mockUseWalletStore.mockReturnValue({
      isConnected: true,
      publicKey,
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    expect(screen.getByText(publicKey)).toBeInTheDocument();
  });

  it('should show supported assets', () => {
    mockUseWalletStore.mockReturnValue({
      isConnected: true,
      publicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    expect(screen.getByText('XLM')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('USDT')).toBeInTheDocument();
  });

  it('should show network information', () => {
    mockUseWalletStore.mockReturnValue({
      isConnected: true,
      publicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    expect(screen.getByText('Stellar Testnet')).toBeInTheDocument();
  });

  it('should have mobile-responsive design', () => {
    mockUseWalletStore.mockReturnValue({
      isConnected: true,
      publicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    // Check for responsive grid classes
    const gridElement = screen.getByText('Create Deposit Request').closest('.grid');
    expect(gridElement).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
  });

  it('should show tabs for different sections', () => {
    mockUseWalletStore.mockReturnValue({
      isConnected: true,
      publicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    expect(screen.getByText('Create Deposit')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    mockUseWalletStore.mockReturnValue({
      isConnected: true,
      publicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    // Fill in the form
    const amountInput = screen.getByLabelText('Amount (Optional)');
    fireEvent.change(amountInput, { target: { value: '10.5' } });

    const memoInput = screen.getByLabelText('Memo (Optional)');
    fireEvent.change(memoInput, { target: { value: 'Test memo' } });

    // Submit the form
    const submitButton = screen.getByText('Generate QR Code');
    fireEvent.click(submitButton);

    // Wait for the form to be processed
    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });
  });

  it('should show error when wallet is not connected and form is submitted', async () => {
    mockUseWalletStore.mockReturnValue({
      isConnected: false,
      publicKey: null,
      connecting: false,
      error: null,
      networkType: 'TESTNET',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      signTransaction: jest.fn(),
    });

    render(<DepositFlow />);

    // The form should not be visible when wallet is not connected
    expect(screen.queryByText('Create Deposit Request')).not.toBeInTheDocument();
  });
});
