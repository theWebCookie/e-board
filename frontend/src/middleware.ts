import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const isAuthenticated = () => {
  const sessionId = cookies().get('sessionId');
  const userId = cookies().get('userId');
  return !!(sessionId && userId);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAuthenticated() && pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated() && pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated() && pathname.startsWith('/history')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated() && pathname.startsWith('/board')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAuthenticated() && pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (isAuthenticated()) {
    return NextResponse.next();
  }

  return NextResponse.next(new URL('/', request.url));
}
