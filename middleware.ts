import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) { 
  const url = request.nextUrl.clone();
  
  const isAuthenticated = request.cookies.has('plane_session');

  // Protect root dashboard
  if (url.pathname === '/' && !isAuthenticated) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); 
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
