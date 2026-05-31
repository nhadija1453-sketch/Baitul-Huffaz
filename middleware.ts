import { type NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/register', '/forgot-password', '/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) || pathname === '/';

  // For API routes, allow them to handle auth themselves
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute && !isPublicRoute) {
    // In production, check for session cookie or JWT
    // For demo, we'll let client-side handle auth
    const response = NextResponse.next();
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import { NextResponse } from 'next/server';