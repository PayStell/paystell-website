import { NextResponse } from 'next/server';
import { generateNonce, encryptData } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { publicKey } = await request.json();

        if (!publicKey) {
            return NextResponse.json(
                { error: 'Public key is required' },
                { status: 400 }
            );
        }

        // Generate nonce
        const nonce = generateNonce();

        // Encrypt nonce and public key
        const encryptedData = encryptData(JSON.stringify({ nonce, publicKey }));

        // Set cookie with encrypted data
        cookies().set('users_data', encryptedData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 5, // 5 minutes
        });

        return NextResponse.json({ nonce });
    } catch (error) {
        console.error('Nonce generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate nonce' },
            { status: 500 }
        );
    }
} 