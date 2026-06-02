const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const livros = [
  {
    titulo: 'O Livro dos Espíritos',
    editora: 'EDICEL',
    ano: 2017,
    isbn: '978-85-207-1234-5',
    categoria_id: null, // Será substituído pelo ID de "Evangelho"
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
    categoria_id: null,
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
    categoria_id: null,
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
    categoria_id: null,
    quantidade_emprestimo: 2,
    quantidade_venda: 2,
    preco_venda: 68.00,
    autores: ['Allan Kardec'],
  },
  {
    titulo: 'Nosso Lar: A Vida no Mundo Espiritual',
    editora: 'FEB - Federação Espírita Brasileira',
    ano: 2015,
    isbn: '978-85-209-0123-4',
    categoria_id: null,
    quantidade_emprestimo: 5,
    quantidade_venda: 5,
    preco_venda: 55.00,
    autores: ['André Luiz', 'Francisco Cândido Xavier'],
  },
];

async function seedLivros() {
  console.log('📚 Iniciando seed de livros espíritas...');
  console.log(`📍 Conectando a: ${baseUrl}`);

  try {
    // 1. Buscar o ID da categoria "Evangelho"
    console.log('\n🔍 Buscando categoria "Evangelho"...');
    const categoriasResponse = await fetch(`${baseUrl}/api/categorias`);
    if (!categoriasResponse.ok) {
      throw new Error('Erro ao buscar categorias');
    }

    const categoriasData = await categoriasResponse.json();
    const categoriaEvangelhoId = categoriasData.categorias?.find(
      (c) => c.nome === 'Evangelho'
    )?.id;

    if (!categoriaEvangelhoId) {
      throw new Error('Categoria "Evangelho" não encontrada. Crie as categorias primeiro!');
    }

    console.log(`✅ Categoria encontrada: ${categoriaEvangelhoId}`);

    // 2. Buscar autores existentes
    console.log('\n🔍 Buscando autores...');
    const autoresResponse = await fetch(`${baseUrl}/api/autores`);
    if (!autoresResponse.ok) {
      throw new Error('Erro ao buscar autores');
    }

    const autoresData = await autoresResponse.json();
    const autoresMap = new Map(autoresData.autores?.map((a) => [a.nome, a.id]) || []);

    console.log(`✅ Autores existentes: ${autoresData.autores?.length || 0}`);

    // 3. Cadastrar livros
    console.log('\n📝 Cadastrando livros...\n');

    let sucessos = 0;
    let erros = 0;

    for (const livro of livros) {
      try {
        // Processar autores
        const autoresParaCadastrar = await Promise.all(
          livro.autores.map(async (nomeAutor) => {
            if (autoresMap.has(nomeAutor)) {
              return { id: autoresMap.get(nomeAutor), nome: nomeAutor };
            }

            // Criar novo autor se não existir
            try {
              const response = await fetch(`${baseUrl}/api/autores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeAutor }),
              });

              if (response.ok || response.status === 409) {
                const data = await response.json();
                return data.autor || { id: '', nome: nomeAutor };
              }
            } catch (error) {
              console.error(`  ⚠️  Erro ao criar autor ${nomeAutor}: ${error.message}`);
            }

            return { id: '', nome: nomeAutor };
          })
        );

        // Cadastrar livro
        const response = await fetch(`${baseUrl}/api/livros`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...livro,
            categoria_id: categoriaEvangelhoId,
            autores: autoresParaCadastrar.filter((a) => a.id),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(
            `✅ "${livro.titulo}" (${livro.quantidade_emprestimo} emp. / ${livro.quantidade_venda} venda)`
          );
          sucessos++;
        } else {
          const errorData = await response.json();
          console.error(`❌ "${livro.titulo}" - ${errorData.error}`);
          erros++;
        }
      } catch (error) {
        console.error(`❌ "${livro.titulo}" - ${error.message}`);
        erros++;
      }
    }

    console.log(`\n📊 Resultado: ${sucessos} livros cadastrados, ${erros} erros`);

    if (erros === 0) {
      console.log('✅ Seed de livros concluído com sucesso!');
      process.exit(0);
    } else {
      console.error('⚠️  Alguns erros ocorreram ao fazer seed');
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Erro fatal: ${error.message}`);
    process.exit(1);
  }
}

seedLivros();
