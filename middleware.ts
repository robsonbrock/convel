import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/auth/login', '/api/auth/google', '/api/auth/callback'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Permitir rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Just pass through - let the app handle auth
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
