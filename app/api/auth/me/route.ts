import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();

    // Get the session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      console.log('[ME] No session found:', error?.message);
      return NextResponse.json(
        { message: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Get user info from database
    const { data: usuario, error: dbError } = await supabase
      .from('usuarios')
      .select('id, cpf, nome, email, role')
      .eq('email', session.user.email)
      .single();

    if (dbError || !usuario) {
      console.log('[ME] User not found in database:', dbError?.message);
      // Create user if not exists
      const { data: newUsuario, error: createError } = await supabase
        .from('usuarios')
        .insert([
          {
            email: session.user.email,
            nome: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            cpf: session.user.id, // Use Supabase user ID as placeholder
            role: 'vendedor', // Default role
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

      return NextResponse.json(
        {
          usuario: newUsuario,
        },
        { status: 200 }
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
