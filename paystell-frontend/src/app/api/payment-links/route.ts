import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import axios from 'axios';
import { headers } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Default to 3001 since frontend is on 3000

export async function GET() {
  try {
    // Get the authorization header
    const headersList = headers();
    const authHeader = headersList.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Get user data from localStorage in the component and pass token here
    const response = await axios.get(`${API_URL}/paymentlink/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching payment links:', error);
    if (axios.isAxiosError(error)) {
      return new NextResponse(error.response?.data?.message || 'Failed to fetch payment links', {
        status: error.response?.status || 500,
      });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Try to get the session first
    const session = await getServerSession(authOptions);
    let userId: string | undefined;

    // If no session, try to get the token from the Authorization header
    if (!session?.user) {
      const headersList = headers();
      const authHeader = headersList.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      // Here you would typically verify the token and extract user ID
      // For now, we'll just check if it exists
      if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    } else {
      userId = session.user.id;
    }

    // If we still don't have a user ID, return an error
    if (!userId) {
      return new NextResponse('User ID not found', { status: 400 });
    }

    // Make sure userId is a number
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      return new NextResponse('Invalid user ID', { status: 400 });
    }

    const body = await request.json();
    const response = await axios.post(`${API_URL}/paymentlink`, {
      ...body,
      userId: numericUserId,
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating payment link:', error);
    if (axios.isAxiosError(error)) {
      // Forward the error message from the backend
      return new NextResponse(error.response?.data?.message || 'Internal Server Error', {
        status: error.response?.status || 500,
      });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
