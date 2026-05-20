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
