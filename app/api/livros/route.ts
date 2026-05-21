import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = request.nextUrl;

    const search = searchParams.get('search')?.toLowerCase() || '';
    const tipo = searchParams.get('tipo') || 'emprestimo'; // 'emprestimo' ou 'venda'
    const orderBy = searchParams.get('orderBy') || 'titulo';
    const orderDir = searchParams.get('orderDir') as 'asc' | 'desc' || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('livros')
      .select(`
        *,
        categoria:categoria_id(*),
        livro_autores(
          autor:autor_id(*)
        )
      `, { count: 'exact' });

    // Filtrar por disponibilidade baseado no tipo
    if (tipo === 'emprestimo') {
      // Para empréstimo: mostra todos (pois podem voltar)
      query = query.gt('quantidade_emprestimo', -1);
    } else if (tipo === 'venda') {
      // Para venda: mostra apenas os que têm quantidade disponível
      query = query.gt('quantidade_venda', 0);
    }

    // Busca por titulo, author ou editora
    if (search) {
      // Busca por título ou editora
      query = query.or(`titulo.ilike.%${search}%,editora.ilike.%${search}%`);
    }

    // Ordenação
    const isValidOrderBy = ['titulo', 'editora', 'ano', 'quantidade_emprestimo', 'quantidade_venda'].includes(orderBy);
    const sortBy = isValidOrderBy ? orderBy : 'titulo';

    query = query.order(sortBy, { ascending: orderDir === 'asc' });

    // Paginação
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Livros GET] Database error:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar livros' },
        { status: 500 }
      );
    }

    // Transformar dados para incluir autores e disponibilidade calculada
    const livros = (data || []).map((livro: any) => {
      const autores = livro.livro_autores?.map((la: any) => ({
        id: la.autor.id,
        nome: la.autor.nome,
      })) || [];

      return {
        ...livro,
        autores,
        disponivel_emprestimo: livro.quantidade_emprestimo,
        disponivel_venda: livro.quantidade_venda,
      };
    });

    return NextResponse.json(
      {
        livros,
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Livros GET] Error:', error);
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

    const { titulo, editora, categoria_id, ano, isbn, codigo, quantidade_emprestimo, quantidade_venda, preco_venda, detalhes, autores } = body;

    // Validar campos obrigatórios
    if (!titulo || !editora || !categoria_id || !autores || autores.length === 0) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Inserir livro
    const { data: livro, error: livroError } = await supabase
      .from('livros')
      .insert([
        {
          titulo,
          editora,
          categoria_id,
          ano: ano || null,
          isbn: isbn || null,
          codigo: codigo || null,
          quantidade_emprestimo: quantidade_emprestimo || 0,
          quantidade_venda: quantidade_venda || 0,
          preco_venda: preco_venda || null,
          detalhes: detalhes || null,
        },
      ])
      .select()
      .single();

    if (livroError || !livro) {
      console.error('[Livros POST] Livro insert error:', livroError);
      return NextResponse.json(
        { error: 'Erro ao criar livro' },
        { status: 500 }
      );
    }

    // Inserir autores
    if (autores.length > 0) {
      const livroAutores = autores.map((autor: any) => ({
        livro_id: livro.id,
        autor_id: autor.id,
      }));

      const { error: autoresError } = await supabase
        .from('livro_autores')
        .insert(livroAutores);

      if (autoresError) {
        console.error('[Livros POST] Autores insert error:', autoresError);
        // Não retornar erro, pois o livro foi criado
      }
    }

    return NextResponse.json(
      { livro, id: livro.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Livros POST] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
