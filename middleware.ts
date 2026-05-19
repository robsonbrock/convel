import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/auth/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Verificar se é rota pública
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Se não tem token e não é rota pública, redirecionar para login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
