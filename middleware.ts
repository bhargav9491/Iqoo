import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/projects',
  '/resume',
  '/decisions',
  '/procedures',
  '/graph',
];

const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('aurevex_auth_token')?.value;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // If accessing a protected route without an auth token cookie, redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and visiting /login or /signup, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/resume/:path*',
    '/decisions/:path*',
    '/procedures/:path*',
    '/graph/:path*',
    '/login',
    '/signup',
  ],
};
