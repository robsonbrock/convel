import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const categorias = [
  'Evangelho',
  'Mediunidade',
  'Reforma Íntima',
  'Família',
  'Ansiedade e Emoções',
  'Vida Após a Morte',
  'Estudos',
  'Infantil',
  'Romance',
  'Autoconhecimento',
  'Palestras e Apóstillas',
];

export async function POST(request: NextRequest) {
  try {
    // Usar service role key se disponível, senão usar anon key
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const key = serviceKey || anonKey;

    if (!key) {
      return NextResponse.json(
        { error: 'Chave Supabase não configurada' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key
    );

    console.log('🌱 Iniciando seed de categorias...');

    // Verificar quais categorias já existem
    const { data: existentes } = await supabase
      .from('categorias')
      .select('nome');

    const nomesExistentes = (existentes || []).map((c) => c.nome);
    const novasCategorias = categorias.filter((c) => !nomesExistentes.includes(c));

    if (novasCategorias.length === 0) {
      return NextResponse.json(
        {
          message: '✅ Todas as categorias já estão cadastradas!',
          inserted: 0,
          total: categorias.length,
        },
        { status: 200 }
      );
    }

    console.log(`📝 Inserindo ${novasCategorias.length} categorias...`);

    const { data, error } = await supabase
      .from('categorias')
      .insert(novasCategorias.map((nome) => ({ nome })))
      .select();

    if (error) {
      console.error('❌ Erro ao inserir categorias:', error);
      return NextResponse.json(
        { error: `Erro ao inserir categorias: ${error.message}` },
        { status: 500 }
      );
    }

    const insertedNames = (data || []).map((c) => c.nome);

    return NextResponse.json(
      {
        message: '✅ Seed de categorias concluído com sucesso!',
        inserted: insertedNames.length,
        categories: insertedNames,
        total: categorias.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    return NextResponse.json(
      { error: `Erro ao fazer seed: ${String(error)}` },
      { status: 500 }
    );
  }
}
