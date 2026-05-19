import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/auth/login', '/api/auth/google', '/api/auth/callback'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Permitir rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Para /dashboard e rotas protegidas, o próprio componente fará a validação
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
