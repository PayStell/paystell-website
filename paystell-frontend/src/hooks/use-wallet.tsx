// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { fetchAccountBalances, fetchPaymentOperations } from '@/lib/wallet/stellar-service';
import type { AssetType, EnhancedPaymentOperation } from '@/lib/wallet/types';

// Define the state types with XLM price properties
type StellarState = {
  balances: AssetType[];
  payments: EnhancedPaymentOperation[];
  isLoadingBalances: boolean;
  isLoadingPayments: boolean;
  balanceError: string | null;
  paymentError: string | null;
  paymentCursor: string | null;
  prevCursors: string[];
  xlmPrice: number | null;
  isLoadingPrice: boolean;
  priceError: string | null;
};
interface RawOperation {
  id: string;
  type: string;
  paging_token: string;
  transaction_successful: boolean;
  source_account: string;
  from?: string;
  to?: string;
  account?: string;
  amount?: string;
  starting_balance?: string;
  asset_type?: string;
  asset_code?: string;
  transaction_hash: string;
  created_at: string;
}

// Define the action types including price actions
type StellarAction =
  | { type: 'FETCH_BALANCES_START' }
  | { type: 'FETCH_BALANCES_SUCCESS'; payload: AssetType[] }
  | { type: 'FETCH_BALANCES_FAILURE'; payload: string }
  | { type: 'FETCH_PAYMENTS_START' }
  | {
      type: 'FETCH_PAYMENTS_SUCCESS';
      payload: { records: EnhancedPaymentOperation[]; next: string | null };
    }
  | { type: 'FETCH_PAYMENTS_FAILURE'; payload: string }
  | { type: 'SET_PAYMENT_CURSOR'; payload: string | null }
  | { type: 'ADD_PREV_CURSOR'; payload: string }
  | { type: 'POP_PREV_CURSOR' }
  | { type: 'FETCH_PRICE_START' }
  | { type: 'FETCH_PRICE_SUCCESS'; payload: number }
  | { type: 'FETCH_PRICE_FAILURE'; payload: string };

// Initial state with XLM price properties
const initialState: StellarState = {
  balances: [],
  payments: [],
  isLoadingBalances: false,
  isLoadingPayments: false,
  balanceError: null,
  paymentError: null,
  paymentCursor: null,
  prevCursors: [],
  xlmPrice: null,
  isLoadingPrice: false,
  priceError: null,
};

// Reducer function with price actions
function stellarReducer(state: StellarState, action: StellarAction): StellarState {
  switch (action.type) {
    case 'FETCH_BALANCES_START':
      return { ...state, isLoadingBalances: true, balanceError: null };
    case 'FETCH_BALANCES_SUCCESS':
      return { ...state, balances: action.payload, isLoadingBalances: false };
    case 'FETCH_BALANCES_FAILURE':
      return { ...state, balanceError: action.payload, isLoadingBalances: false };
    case 'FETCH_PAYMENTS_START':
      return { ...state, isLoadingPayments: true, paymentError: null };
    case 'FETCH_PAYMENTS_SUCCESS':
      return {
        ...state,
        payments: action.payload.records,
        paymentCursor: action.payload.next,
        isLoadingPayments: false,
      };
    case 'FETCH_PAYMENTS_FAILURE':
      return { ...state, paymentError: action.payload, isLoadingPayments: false };
    case 'SET_PAYMENT_CURSOR':
      return { ...state, paymentCursor: action.payload };
    case 'ADD_PREV_CURSOR':
      return { ...state, prevCursors: [...state.prevCursors, action.payload] };
    case 'POP_PREV_CURSOR': {
      const newPrevCursors = [...state.prevCursors];
      newPrevCursors.pop();
      return { ...state, prevCursors: newPrevCursors };
    }
    case 'FETCH_PRICE_START':
      return { ...state, isLoadingPrice: true, priceError: null };
    case 'FETCH_PRICE_SUCCESS':
      return { ...state, xlmPrice: action.payload, isLoadingPrice: false };
    case 'FETCH_PRICE_FAILURE':
      return { ...state, priceError: action.payload, isLoadingPrice: false };
    default:
      return state;
  }
}

// Context type with fetchXLMPrice
type StellarContextType = {
  state: StellarState;
  fetchBalances: (publicKey: string) => Promise<void>;
  fetchPayments: (publicKey: string, cursor?: string | null) => Promise<void>;
  fetchXLMPrice: () => Promise<void>;
  goToNextPage: () => void;
  goToPrevPage: () => void;
};

export const StellarContext = createContext<StellarContextType | null>(null);

// Helper function to enhance payment operations with direction and counterparty
const enhancePaymentOperations = (
  operations: RawOperation[],
  publicKey: string,
): EnhancedPaymentOperation[] => {
  return operations
    .filter((op) => {
      return (
        ['payment', 'create_account', 'path_payment', 'path_payment_strict_send'].includes(
          op.type,
        ) &&
        (op.from !== undefined ||
          op.to !== undefined ||
          op.account !== undefined ||
          op.source_account !== undefined)
      );
    })
    .map((op) => {
      let from = op.from;
      let to = op.to;
      let amount = op.amount;
      let assetType = op.asset_type;
      const assetCode = op.asset_code;

      if (op.type === 'create_account') {
        from = op.source_account;
        to = op.account;
        amount = op.starting_balance;
        assetType = 'native';
      }

      const isSender = from === publicKey;
      const direction: 'sent' | 'received' = isSender ? 'sent' : 'received';
      const counterparty = isSender ? (to ?? '') : (from ?? '');
      const displayAsset = assetType === 'native' ? 'XLM' : assetCode || 'Unknown';

      // Assign type_i based on some logic, here as a simple example:
      const type_i = op.type === 'payment' ? 1 : op.type === 'create_account' ? 2 : 3;

      return {
        ...op,
        from,
        to,
        amount,
        asset_type: assetType,
        asset_code: assetCode,
        direction,
        counterparty,
        displayAsset,
        type_i, // Add the missing property
      };
    });
};

// Provider with fetchXLMPrice implementation
export function StellarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stellarReducer, initialState);

  const fetchBalances = useCallback(async (publicKey: string) => {
    if (!publicKey) return;

    dispatch({ type: 'FETCH_BALANCES_START' });
    try {
      const balances = await fetchAccountBalances(publicKey);
      dispatch({ type: 'FETCH_BALANCES_SUCCESS', payload: balances });
    } catch (error: unknown) {
      console.error('Error fetching balances:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balances';
      dispatch({ type: 'FETCH_BALANCES_FAILURE', payload: errorMessage });
    }
  }, []);

  const fetchPayments = useCallback(async (publicKey: string, cursor: string | null = null) => {
    if (!publicKey) return;

    dispatch({ type: 'FETCH_PAYMENTS_START' });
    try {
      const { records, next } = await fetchPaymentOperations(publicKey, cursor);

      // Enhance payment operations with direction and counterparty
      const enhancedRecords = enhancePaymentOperations(records, publicKey);

      dispatch({
        type: 'FETCH_PAYMENTS_SUCCESS',
        payload: { records: enhancedRecords, next },
      });
    } catch (error: unknown) {
      console.error('Error fetching payments:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payments';
      dispatch({ type: 'FETCH_PAYMENTS_FAILURE', payload: errorMessage });
    }
  }, []);

  const fetchXLMPrice = useCallback(async () => {
    dispatch({ type: 'FETCH_PRICE_START' });
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd',
        { headers: { Accept: 'application/json' } },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API responded with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      if (!data.stellar || !data.stellar.usd) {
        throw new Error('Invalid API response format');
      }
      const price = data.stellar.usd;
      dispatch({ type: 'FETCH_PRICE_SUCCESS', payload: price });
    } catch (error: unknown) {
      console.error('Error fetching XLM price:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch XLM price';
      dispatch({ type: 'FETCH_PRICE_FAILURE', payload: errorMessage });
    }
  }, []);

  // Fetch XLM price on mount
  useEffect(() => {
    fetchXLMPrice();

    // Refresh price every 5 minutes
    const intervalId = setInterval(fetchXLMPrice, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchXLMPrice]);

  const goToNextPage = useCallback(() => {
    if (state.paymentCursor) {
      dispatch({ type: 'ADD_PREV_CURSOR', payload: state.paymentCursor });
      // The current cursor becomes the next page's cursor
      dispatch({ type: 'SET_PAYMENT_CURSOR', payload: state.paymentCursor });
    }
  }, [state.paymentCursor]);

  const goToPrevPage = useCallback(() => {
    if (state.prevCursors.length > 0) {
      const prevCursor = state.prevCursors[state.prevCursors.length - 1];
      dispatch({ type: 'POP_PREV_CURSOR' });
      dispatch({ type: 'SET_PAYMENT_CURSOR', payload: prevCursor });
    }
  }, [state.prevCursors]);

  return (
    <StellarContext.Provider
      value={{
        state,
        fetchBalances,
        fetchPayments,
        fetchXLMPrice,
        goToNextPage,
        goToPrevPage,
      }}
    >
      {children}
    </StellarContext.Provider>
  );
}

// Create the hook
export function useStellar() {
  const context = useContext(StellarContext);
  if (!context) {
    throw new Error('useStellar must be used within a StellarProvider');
  }
  return context;
}
