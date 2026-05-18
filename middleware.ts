import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

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

  // Verificar validade do token
  const session = verifyToken(token);
  if (!session) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
