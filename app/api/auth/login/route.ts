import { NextRequest, NextResponse } from 'next/server';
import { loginUsuario } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { cpf, email, senha } = await request.json();

    if (!cpf || !email || !senha) {
      return NextResponse.json(
        { message: 'CPF, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await loginUsuario({ cpf, email, senha });

    if (!result) {
      return NextResponse.json(
        { message: 'CPF, email ou senha inválidos' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { message: 'Login bem-sucedido', usuario: result.usuario },
      { status: 200 }
    );

    // Set token as httpOnly cookie
    response.cookies.set({
      name: 'token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Erro ao processar login' },
      { status: 500 }
    );
  }
}
