import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptData, generateJWT } from '@/lib/auth';
import { Keypair } from 'stellar-sdk';

export async function POST(request: Request) {
    try {
        const { publicKey, signedMessage } = await request.json();

        if (!publicKey || !signedMessage) {
            return NextResponse.json(
                { error: 'Public key and signed message are required' },
                { status: 400 }
            );
        }

        // Get verification data from cookie
        const verificationCookie = cookies().get('users_data');
        if (!verificationCookie?.value) {
            return NextResponse.json(
                { error: 'Users data not found' },
                { status: 400 }
            );
        }

        // Decrypt and parse verification data
        const decryptedData = JSON.parse(decryptData(verificationCookie.value));
        const { nonce } = decryptedData;

        // Verify the message signature
        try {
            // Convert the signed message to a Buffer
            const signatureBuffer = Buffer.from(signedMessage, 'base64');

            // Verify the signature using the public key
            const keypair = Keypair.fromPublicKey(publicKey);
            const isValid = keypair.verify(
                Buffer.from(nonce),
                signatureBuffer
            );

            if (!isValid) {
                return NextResponse.json(
                    { error: 'Invalid signature' },
                    { status: 400 }
                );
            }
        } catch (error) {
            console.error('Signature verification error:', error);
            return NextResponse.json(
                { error: 'Invalid signature format' },
                { status: 400 }
            );
        }

        // Generate JWT token
        const token = await generateJWT({ publicKey });

        // Clear verification cookie
        cookies().delete('users_data');

        return NextResponse.json({ token });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
} 