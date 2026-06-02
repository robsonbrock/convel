import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('autores')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('[Autores GET] Database error:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar autores' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { autores: data || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Autores GET] Error:', error);
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

    // Verificar se o autor já existe
    const { data: existing } = await supabase
      .from('autores')
      .select('*')
      .ilike('nome', `%${nome}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      // Autor já existe, retornar o existente
      return NextResponse.json(
        { autor: existing[0] },
        { status: 200 }
      );
    }

    // Criar novo autor
    const { data, error } = await supabase
      .from('autores')
      .insert([{ nome: nome.trim() }])
      .select()
      .single();

    if (error || !data) {
      console.error('[Autores POST] Insert error:', error);
      return NextResponse.json(
        { error: 'Erro ao criar autor' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { autor: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Autores POST] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
