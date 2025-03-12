import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Get the password from environment variable
    const correctPassword = process.env.AUTH_PASSWORD;
    
    if (!correctPassword) {
      console.error('AUTH_PASSWORD environment variable is not set');
      return NextResponse.json(
        { error: 'Authentication system is not properly configured' },
        { status: 500 }
      );
    }
    
    // Check if the password matches
    if (password === correctPassword) {
      // Set a cookie to indicate the user is authenticated
      const response = NextResponse.json({ success: true });
      response.cookies.set('authenticated', 'true', {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 