import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // MSW runs in the browser and cannot set HttpOnly cookies.
  // We use a regular (non-HttpOnly) cookie set via document.cookie after login.
  const isAuthenticated = request.cookies.has('plane_session');

  const isAuthPage = [
    '/sign-in',
    '/sign-up',
    '/login',
    '/signup',
    '/forgot-password',
  ].includes(url.pathname);

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && !isAuthPage) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages (already logged in)
  if (isAuthenticated && isAuthPage) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)'] };
