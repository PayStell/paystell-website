import { render, screen, fireEvent } from '@testing-library/react';
import { WithdrawFlow } from '../components/withdraw/WithdrawFlow';
import { useWallet } from '@creit.tech/stellar-wallets-kit';

jest.mock('@creit.tech/stellar-wallets-kit');

describe('WithdrawFlow', () => {
  const mockClose = jest.fn();
  
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      wallet: { address: 'G123' },
      balance: '100.00',
      signTransaction: jest.fn().mockResolvedValue({ submit: jest.fn().mockResolvedValue({}) }),
    });
  });

  it('should navigate through stepper steps', () => {
    render(<WithdrawFlow onClose={mockClose} />);
    
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '10' } });
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Destination Stellar Address')).toBeInTheDocument();
  });

  it('should show error for insufficient balance', () => {
    render(<WithdrawFlow onClose={mockClose} />);
    
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '1000' } });
    
    expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
  });
});
