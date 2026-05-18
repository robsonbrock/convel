import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Não autenticado' },
        { status: 401 }
      );
    }

    const session = getSessionFromToken(token);

    if (!session) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json({ usuario: session }, { status: 200 });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { message: 'Erro ao obter sessão' },
      { status: 500 }
    );
  }
}
