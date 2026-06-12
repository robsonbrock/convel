import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromToken } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { usuarioInviteSchema } from '@/lib/validation/usuario';
import { sendInviteEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const session = getSessionFromToken(token);

    if (!session || !['super_admin', 'admin'].includes(session.role)) {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role } = body;

    // Validação básica
    if (!email || !role) {
      return NextResponse.json(
        { message: 'Email e role são obrigatórios' },
        { status: 400 }
      );
    }

    // Se o usuário logado é admin, não pode criar super_admin
    if (session.role === 'admin' && role === 'super_admin') {
      return NextResponse.json(
        { message: 'Você não tem permissão para criar um super_admin' },
        { status: 403 }
      );
    }

    // Verificar se usuário já existe
    const { data: existing } = await getSupabase()
      .from('usuarios')
      .select('id, email, status')
      .eq('email', email)
      .single();

    if (existing) {
      // Se existe e está ativo ou pendente, rejeita
      if (existing.status === 'ativo' || existing.status === 'pendente') {
        return NextResponse.json(
          { message: 'Este e-mail já está cadastrado no sistema' },
          { status: 409 }
        );
      }

      // Se está inativo, reativa e reenvia convite
      if (existing.status === 'inativo') {
        const { data: updated, error } = await getSupabase()
          .from('usuarios')
          .update({
            status: 'pendente',
            invite_sent_at: new Date().toISOString(),
            invited_by: session.id,
          })
          .eq('id', existing.id)
          .select('id, email, nome, role, status')
          .single();

        if (error) {
          return NextResponse.json(
            { message: 'Falha ao reativar usuário' },
            { status: 400 }
          );
        }

        // Enviar e-mail de convite
        try {
          await sendInviteEmail(email, role);
        } catch (emailError) {
          console.error('Email send error:', emailError);
        }

        return NextResponse.json(
          { usuario: updated, message: 'Usuário reativado e convite reenviado' },
          { status: 200 }
        );
      }
    }

    // Inserir novo usuário
    const { data, error } = await getSupabase()
      .from('usuarios')
      .insert([
        {
          email,
          role,
          status: 'pendente',
          invited_by: session.id,
          invite_sent_at: new Date().toISOString(),
        },
      ])
      .select('id, email, nome, role, status')
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { message: 'Falha ao criar usuário' },
        { status: 400 }
      );
    }

    // Enviar e-mail de convite
    try {
      await sendInviteEmail(email, role);
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }

    return NextResponse.json({ usuario: data }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { message: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}
