import { NextRequest, NextResponse } from 'next/server';

interface ErrorData {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const errorData: ErrorData = await request.json();

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error:', errorData);
    }

    // In production, you would typically:
    // 1. Send to error monitoring service (Sentry, LogRocket, etc.)
    // 2. Store in database for analysis
    // 3. Send alerts for critical errors

    // For now, we'll just log it
    console.log('Error logged:', {
      message: errorData.message,
      url: errorData.url,
      timestamp: errorData.timestamp,
    });

    // You can integrate with external services here:
    // await sendToSentry(errorData);
    // await storeInDatabase(errorData);
    // await sendAlertIfCritical(errorData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log error:', error);
    return NextResponse.json({ error: 'Failed to log error' }, { status: 500 });
  }
}
