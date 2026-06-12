import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { usuarioPerfilSchema } from '@/lib/validation/usuario';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const session = verifyToken(token);

    if (!session) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = usuarioPerfilSchema.parse(body);

    const { data, error } = await getSupabase()
      .from('usuarios')
      .update({
        nome: validatedData.nome,
        apelido: validatedData.apelido,
      })
      .eq('id', session.id)
      .select('id, email, nome, apelido, role')
      .single();

    if (error || !data) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: 'Falha ao atualizar perfil' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    );
  }
}
