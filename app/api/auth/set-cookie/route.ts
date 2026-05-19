import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      console.warn('[SetCookie] Token não fornecido');
      return NextResponse.json(
        { message: 'Token não fornecido' },
        { status: 400 }
      );
    }

    console.log('[SetCookie] Configurando cookie com token de', token.substring(0, 20) + '...');

    const response = NextResponse.json(
      { message: 'Cookie setado com sucesso' },
      { status: 200 }
    );

    const cookieConfig = {
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    };

    console.log('[SetCookie] Cookie config:', {
      name: cookieConfig.name,
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      maxAge: cookieConfig.maxAge,
    });

    response.cookies.set(cookieConfig);

    console.log('[SetCookie] Cookie setado com sucesso');
    return response;
  } catch (error) {
    console.error('[SetCookie] Fatal error:', error);
    return NextResponse.json(
      { message: 'Erro ao set cookie' },
      { status: 500 }
    );
  }
}
