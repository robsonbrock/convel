import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { usuarioUpdateSchema } from '@/lib/validation/usuario';
import * as bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const { data, error } = await getSupabase()
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const { senha, ...usuarioSemSenha } = data;
    return NextResponse.json(usuarioSemSenha);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const validatedData = usuarioUpdateSchema.parse(body);

    const updateData: any = {
      nome: validatedData.nome,
      email: validatedData.email,
      role: validatedData.role,
      telefone: validatedData.telefone,
      endereco: validatedData.endereco,
      apelido: validatedData.apelido,
      updated_at: new Date().toISOString(),
    };

    if (validatedData.senha) {
      const hashedPassword = await bcrypt.hash(validatedData.senha, 10);
      updateData.senha = hashedPassword;
    }

    const { data, error } = await getSupabase()
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar usuário' },
        { status: 500 }
      );
    }

    const { senha, ...usuarioSemSenha } = data;
    return NextResponse.json(usuarioSemSenha);
  } catch (error: any) {
    console.error('Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['ativo', 'inativo'].includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Buscar usuário para verificar permissões
    const { data: userToUpdate } = await getSupabase()
      .from('usuarios')
      .select('role')
      .eq('id', id)
      .single();

    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Admin não pode inativar super_admin
    if (session.role === 'admin' && userToUpdate.role === 'super_admin') {
      return NextResponse.json(
        { error: 'Você não tem permissão para inativar um super_admin' },
        { status: 403 }
      );
    }

    const { data, error } = await getSupabase()
      .from('usuarios')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Erro ao atualizar status' },
        { status: 500 }
      );
    }

    const { senha, ...usuarioSemSenha } = data;
    return NextResponse.json(usuarioSemSenha);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session || session.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const { error } = await getSupabase()
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar usuário' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar usuário' },
      { status: 500 }
    );
  }
}
