import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAsync } from '@/lib/supabase';
import { jwtDecode } from 'jwt-decode';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('[ME] No authorization token');
      return NextResponse.json(
        { message: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Decode token to get user email (no signature validation needed)
    let userEmail: string | undefined;
    try {
      const decoded: any = jwtDecode(token);
      userEmail = decoded.email;
    } catch (e) {
      console.log('[ME] Failed to decode token:', e);
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    if (!userEmail) {
      console.log('[ME] No email in token');
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    const supabase = await getSupabaseAsync();

    // Get user info from database
    const { data: usuario, error: dbError } = await supabase
      .from('usuarios')
      .select('id, cpf, nome, email, role')
      .eq('email', userEmail)
      .single();

    if (dbError) {
      console.log('[ME] Database error:', dbError);
      console.log('[ME] Error code:', dbError?.code);
      console.log('[ME] Error message:', dbError?.message);

      if (dbError?.code === 'PGRST116') {
        // User not found - create it
        console.log('[ME] User not found, creating new user...');
        const { data: newUsuario, error: createError } = await supabase
          .from('usuarios')
          .insert([
            {
              email: userEmail,
              nome: userEmail.split('@')[0],
              cpf: '00000000000', // Placeholder CPF (11 zeros)
              role: 'vendedor',
            },
          ])
          .select('id, cpf, nome, email, role')
          .single();

        if (createError) {
          console.error('[ME] Error creating user:', createError);
          return NextResponse.json(
            { message: 'Erro ao criar usuário' },
            { status: 500 }
          );
        }

        console.log('[ME] User created successfully');
        return NextResponse.json(
          {
            usuario: newUsuario,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: 'Erro ao buscar usuário' },
        { status: 500 }
      );
    }

    if (!usuario) {
      console.log('[ME] User is null');
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        usuario,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ME] Error:', error);
    return NextResponse.json(
      { message: 'Erro ao obter sessão' },
      { status: 500 }
    );
  }
}
