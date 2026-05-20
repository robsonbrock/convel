import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const livrosParaCadastrar = [
  {
    titulo: 'O Livro dos Espíritos',
    editora: 'EDICEL',
    ano: 2017,
    isbn: '978-85-207-1234-5',
    quantidade_emprestimo: 5,
    quantidade_venda: 5,
    preco_venda: 85.00,
    autores: ['Allan Kardec'],
  },
  {
    titulo: 'O Evangelho Segundo o Espiritismo',
    editora: 'EDICEL',
    ano: 2016,
    isbn: '978-85-207-5678-9',
    quantidade_emprestimo: 2,
    quantidade_venda: 5,
    preco_venda: 75.00,
    autores: ['Allan Kardec'],
  },
  {
    titulo: 'A Gênese',
    editora: 'EDICEL',
    ano: 2018,
    isbn: '978-85-207-9012-3',
    quantidade_emprestimo: 5,
    quantidade_venda: 2,
    preco_venda: 70.00,
    autores: ['Allan Kardec'],
  },
  {
    titulo: 'O Céu e o Inferno',
    editora: 'EDICEL',
    ano: 2017,
    isbn: '978-85-207-3456-7',
    quantidade_emprestimo: 2,
    quantidade_venda: 2,
    preco_venda: 68.00,
    autores: ['Allan Kardec'],
  },
  {
    titulo: 'Nosso Lar: A Vida no Mundo Espiritual',
    editora: 'FEB',
    ano: 2015,
    isbn: '978-85-209-0123-4',
    quantidade_emprestimo: 5,
    quantidade_venda: 5,
    preco_venda: 55.00,
    autores: ['André Luiz', 'Francisco Cândido Xavier'],
  },
];

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

    console.log('📚 Iniciando seed de livros espíritas...');

    // 1. Buscar categoria "Evangelho"
    const { data: categorias, error: categError } = await supabase
      .from('categorias')
      .select('id')
      .eq('nome', 'Evangelho')
      .single();

    if (categError || !categorias) {
      return NextResponse.json(
        { error: 'Categoria "Evangelho" não encontrada' },
        { status: 400 }
      );
    }

    const categoriaId = categorias.id;

    let sucessos = 0;
    let erros = 0;
    const livrosCadastrados = [];

    for (const livro of livrosParaCadastrar) {
      try {
        // 2. Buscar ou criar autores
        const autoresIds = [];

        for (const nomeAutor of livro.autores) {
          let { data: autor, error: autorError } = await supabase
            .from('autores')
            .select('id')
            .eq('nome', nomeAutor)
            .single();

          if (!autor && !autorError) {
            // Criar autor
            const { data: novoAutor, error: criarError } = await supabase
              .from('autores')
              .insert([{ nome: nomeAutor }])
              .select()
              .single();

            if (novoAutor) {
              autoresIds.push(novoAutor.id);
            }
          } else if (autor) {
            autoresIds.push(autor.id);
          }
        }

        // 3. Cadastrar livro
        const { data: novoLivro, error: livroError } = await supabase
          .from('livros')
          .insert([
            {
              titulo: livro.titulo,
              editora: livro.editora,
              ano: livro.ano,
              isbn: livro.isbn,
              categoria_id: categoriaId,
              quantidade_emprestimo: livro.quantidade_emprestimo,
              quantidade_venda: livro.quantidade_venda,
              preco_venda: livro.preco_venda,
            },
          ])
          .select()
          .single();

        if (livroError || !novoLivro) {
          console.error(`Erro ao cadastrar ${livro.titulo}:`, livroError);
          erros++;
          continue;
        }

        // 4. Associar autores
        if (autoresIds.length > 0) {
          await supabase.from('livro_autores').insert(
            autoresIds.map((autorId) => ({
              livro_id: novoLivro.id,
              autor_id: autorId,
            }))
          );
        }

        livrosCadastrados.push(livro.titulo);
        sucessos++;
        console.log(`✅ "${livro.titulo}"`);
      } catch (error) {
        console.error(`Erro ao cadastrar ${livro.titulo}:`, error);
        erros++;
      }
    }

    return NextResponse.json(
      {
        message: `✅ Seed de livros concluído: ${sucessos} cadastrados, ${erros} erros`,
        inserted: sucessos,
        livros: livrosCadastrados,
        total: livrosParaCadastrar.length,
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
