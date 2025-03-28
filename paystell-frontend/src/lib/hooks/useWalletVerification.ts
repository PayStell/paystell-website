import { useState } from 'react';
import getPublicKey, { isConnected, signMessage } from '@stellar/freighter-api';

interface VerificationState {
    isLoading: boolean;
    error: string | null;
    isVerified: boolean;
}

export const useWalletVerification = () => {
    const [state, setState] = useState<VerificationState>({
        isLoading: false,
        error: null,
        isVerified: false,
    });

    const initiateVerification = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // Check if Freighter is connected
            const connected = await isConnected();
            if (!connected) {
                throw new Error('Please connect your Freighter wallet');
            }

            // Get user's public key
            const publicKey = await getPublicKey.getAddress();

            // Request nonce from backend
            const response = await fetch('/api/auth/nonce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ publicKey: publicKey.address }),
            });

            if (!response.ok) {
                throw new Error('Failed to get verification nonce');
            }

            const { nonce } = await response.json();

            // Sign the nonce message
            const signedMessage = await signMessage(nonce);

            // Verify the signature with backend
            const verifyResponse = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicKey: publicKey.address,
                    signedMessage,
                }),
            });

            if (!verifyResponse.ok) {
                throw new Error('Verification failed');
            }

            const { token } = await verifyResponse.json();

            // Store the JWT token
            localStorage.setItem('auth_token', token);

            setState({
                isLoading: false,
                error: null,
                isVerified: true,
            });

            return true;
        } catch (error) {
            setState({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Verification failed',
                isVerified: false,
            });
            return false;
        }
    };

    return {
        ...state,
        initiateVerification,
    };
}; 