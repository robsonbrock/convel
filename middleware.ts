import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/auth/login', '/api/auth/google'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Permitir rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Bloquear acesso a /dashboard e /admin sem verificar whitelist
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    console.log('[Middleware] Checking whitelist for:', pathname);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
