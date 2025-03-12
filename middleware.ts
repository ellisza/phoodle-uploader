import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip API routes except for uploadthing endpoint
  if (
    request.nextUrl.pathname.startsWith('/api') && 
    !request.nextUrl.pathname.startsWith('/api/uploadthing')
  ) {
    return NextResponse.next();
  }

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.get('authenticated')?.value === 'true';
  
  // If accessing the uploadthing API or the main page while not authenticated, redirect to login
  if (
    !isAuthenticated && 
    (request.nextUrl.pathname.startsWith('/api/uploadthing') || 
     request.nextUrl.pathname === '/')
  ) {
    // Don't redirect on auth requests to avoid loops
    if (request.nextUrl.pathname === '/login') {
      return NextResponse.next();
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login page, redirect to main page
  if (isAuthenticated && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 