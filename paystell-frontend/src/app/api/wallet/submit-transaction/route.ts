import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';

// In-memory store for transaction hashes to prevent replay attacks
// In production, use Redis or a database
const processedTransactions = new Set<string>();

export async function POST(request: Request) {
  let errorMessage = 'Unknown error';

  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { signedXdr } = await request.json();

    if (!signedXdr) {
      return NextResponse.json({ error: 'Missing signed transaction XDR' }, { status: 400 });
    }

    // 2. Check for replay attacks
    const transactionHash = crypto.createHash('sha256').update(signedXdr).digest('hex');
    if (processedTransactions.has(transactionHash)) {
      return NextResponse.json({ error: 'Transaction already processed' }, { status: 409 });
    }

    // 3. Submit to the network
    const response = await fetch(`${HORIZON_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `tx=${encodeURIComponent(signedXdr)}`,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Transaction submission failed:', result);
      let errorMessage = 'Failed to submit transaction';
      let errorDetails = null;
      let resultCodes = null;

      if (result.extras?.result_codes) {
        resultCodes = result.extras.result_codes;
        errorMessage = resultCodes.transaction || errorMessage;
        errorDetails = resultCodes.operations || null;
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
          resultCodes: resultCodes,
          message: result.title || result.detail || 'Unknown error',
        },
        { status: 400 },
      );
    }

    // 4. Mark transaction as processed to prevent replay
    processedTransactions.add(transactionHash);

    console.log('Transaction submitted successfully:', result);

    return NextResponse.json({
      success: true,
      hash: result.hash,
      ledger: result.ledger,
    });
  } catch (error) {
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error submitting transaction:', error.message);
    } else {
      console.error('Error submitting transaction:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to submit transaction',
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}
