import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('[Categorias] Database error:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar categorias' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { categorias: data || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Categorias] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabase();

    const { nome } = body;

    if (!nome || nome.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a categoria já existe
    const { data: existing } = await supabase
      .from('categorias')
      .select('*')
      .ilike('nome', `%${nome}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      // Categoria já existe
      return NextResponse.json(
        { categoria: existing[0] },
        { status: 409 }
      );
    }

    // Criar nova categoria
    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nome: nome.trim() }])
      .select()
      .single();

    if (error || !data) {
      console.error('[Categorias POST] Insert error:', error);
      return NextResponse.json(
        { error: 'Erro ao criar categoria' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { categoria: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Categorias POST] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
