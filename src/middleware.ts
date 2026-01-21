import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from './lib/auth';

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.has(AUTH_COOKIE_NAME);
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/new') || 
    request.nextUrl.pathname.startsWith('/edit');

  if (isProtectedRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/new', '/edit/:path*'],
};
