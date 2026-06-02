const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function seedCategorias() {
  console.log('🌱 Iniciando seed de categorias...');

  try {
    // Verificar quais categorias já existem
    const { data: existentes, error: selectError } = await supabase
      .from('categorias')
      .select('nome');

    if (selectError) {
      console.error('❌ Erro ao verificar categorias existentes:', selectError);
      process.exit(1);
    }

    const nomesExistentes = (existentes || []).map((c) => c.nome);
    const novasCategorias = categorias.filter((c) => !nomesExistentes.includes(c));

    if (novasCategorias.length === 0) {
      console.log('✅ Todas as categorias já estão cadastradas!');
      return;
    }

    console.log(`📝 Inserindo ${novasCategorias.length} categorias...`);

    const { data, error } = await supabase
      .from('categorias')
      .insert(novasCategorias.map((nome) => ({ nome })))
      .select();

    if (error) {
      console.error('❌ Erro ao inserir categorias:', error);
      process.exit(1);
    }

    console.log('✅ Categorias inseridas com sucesso:');
    (data || []).forEach((cat) => {
      console.log(`   - ${cat.nome}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}

seedCategorias();
