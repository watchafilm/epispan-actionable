import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sisfogen';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.get('auth')?.value === ADMIN_PASSWORD;

  if (pathname.startsWith('/edit') && !pathname.startsWith('/edit/login')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/edit/login', request.url));
    }
  }

  if (pathname === '/edit/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/edit/dashboard', request.url));
    }
  }

  // Redirect root edit path to dashboard if logged in
  if (pathname === '/edit' && isLoggedIn) {
      return NextResponse.redirect(new URL('/edit/dashboard', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/edit/:path*'],
};
