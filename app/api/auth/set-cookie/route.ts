import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token não fornecido' },
        { status: 400 }
      );
    }

    console.log('[SetCookie] Setting token cookie...');

    const response = NextResponse.json(
      { message: 'Cookie setado com sucesso' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('[SetCookie] Error:', error);
    return NextResponse.json(
      { message: 'Erro ao set cookie' },
      { status: 500 }
    );
  }
}
