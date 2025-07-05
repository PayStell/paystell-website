import { WalletData, Transaction } from '@/types/types';

export const mockWalletData: WalletData = {
  address: 'GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP',
  balance: '15,420.50',
  balanceUSD: '2,313.08',
  isActivated: true,
  trustlines: 3,
  transactions: 247,
  hasWallet: true
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    type: 'received',
    amount: '1000.00',
    currency: 'XLM',
    from: 'GCKFBEIYTKP56ZPBWJBZ5JDNK5QMK7OOWMZD4GVYOQ5LRJHQHKL6ZMKDJ',
    to:   'GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP',
    date: new Date().toISOString(),
    status: 'completed',
    fee: '0.00001',
    memo: 'Payment for services'
  },
  {
    id: '2',
    hash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    type: 'sent',
    amount: '250.00',
    currency: 'XLM',
    from: 'GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP',
    to:   'GALIE5H6VQVAHE6HDKSHZHDSJSH2DSHABNSHBDJAKVHDSJLKAJDSOQHDS',
    date: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
    fee: '0.00001',
    memo: 'Refund'
  }
];