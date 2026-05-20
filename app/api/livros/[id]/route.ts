import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('livros')
      .select(`
        *,
        categoria:categoria_id(*),
        livro_autores(
          autor:autor_id(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    const autores = data.livro_autores?.map((la: any) => ({
      id: la.autor.id,
      nome: la.autor.nome,
    })) || [];

    return NextResponse.json(
      {
        livro: {
          ...data,
          autores,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Livro GET] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = getSupabase();

    const { titulo, editora, categoria_id, ano, isbn, quantidade_emprestimo, quantidade_venda, preco_venda, autores } = body;

    // Atualizar livro
    const { data: livro, error: livroError } = await supabase
      .from('livros')
      .update({
        titulo,
        editora,
        categoria_id,
        ano: ano || null,
        isbn: isbn || null,
        quantidade_emprestimo: quantidade_emprestimo || 0,
        quantidade_venda: quantidade_venda || 0,
        preco_venda: preco_venda || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (livroError || !livro) {
      return NextResponse.json(
        { error: 'Erro ao atualizar livro' },
        { status: 500 }
      );
    }

    // Atualizar autores se fornecido
    if (autores && Array.isArray(autores)) {
      // Deletar autores antigos
      await supabase
        .from('livro_autores')
        .delete()
        .eq('livro_id', id);

      // Inserir novos autores
      if (autores.length > 0) {
        const livroAutores = autores.map((autor: any) => ({
          livro_id: id,
          autor_id: autor.id,
        }));

        await supabase
          .from('livro_autores')
          .insert(livroAutores);
      }
    }

    return NextResponse.json(
      { livro },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Livro PUT] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    // Deletar autores relacionados
    await supabase
      .from('livro_autores')
      .delete()
      .eq('livro_id', id);

    // Deletar livro
    const { error } = await supabase
      .from('livros')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao deletar livro' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Livro DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
