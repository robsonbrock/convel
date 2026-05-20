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
