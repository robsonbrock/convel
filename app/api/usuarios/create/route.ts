import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromToken, criarUsuario } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const session = getSessionFromToken(token);

    if (!session || session.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { cpf, nome, email, senha, role, telefone, endereco } = await request.json();

    if (!cpf || !nome || !email || !senha || !role) {
      return NextResponse.json(
        { message: 'CPF, nome, email, senha e role são obrigatórios' },
        { status: 400 }
      );
    }

    const usuario = await criarUsuario(cpf, nome, email, senha, role, telefone, endereco);

    if (!usuario) {
      return NextResponse.json(
        { message: 'Falha ao criar usuário' },
        { status: 400 }
      );
    }

    return NextResponse.json({ usuario }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { message: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}
