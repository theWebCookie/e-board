import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

interface AppConfig {
  jwtSecret: string;
  issuer: string;
  audience: string;
}

const appConfig: AppConfig = {
  jwtSecret: process.env.JWT_SECRET || '',
  issuer: process.env.JWT_ISSUER || '',
  audience: process.env.JWT_AUDIENCE || '',
};

const isAuthenticated = async (): Promise<boolean> => {
  const tokenCookie = (await cookies()).get('token');

  if (!tokenCookie || !tokenCookie.value) {
    return false;
  }

  const token = tokenCookie.value;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(appConfig.jwtSecret), {
      issuer: appConfig.issuer,
      audience: appConfig.audience,
    });

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('Błąd weryfikacji tokenu:', err);
    return false;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authenticated = await isAuthenticated();

  if (!authenticated && pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!authenticated && pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!authenticated && pathname.startsWith('/history')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!authenticated && pathname.startsWith('/board')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (authenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (authenticated) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
