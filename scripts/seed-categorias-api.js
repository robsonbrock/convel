const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
  console.log('🌱 Iniciando seed de categorias via API...');
  console.log(`📍 Conectando a: ${baseUrl}`);

  let sucessos = 0;
  let erros = 0;

  for (const categoria of categorias) {
    try {
      const response = await fetch(`${baseUrl}/api/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: categoria }),
      });

      const responseText = await response.text();
      let errorMsg = responseText;

      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          console.log(`✅ ${categoria}`);
          sucessos++;
        } else if (response.status === 409) {
          // Já existe
          console.log(`⏭️  ${categoria} (já existe)`);
          sucessos++;
        } else {
          errorMsg = data.error || `HTTP ${response.status}`;
          console.error(`❌ ${categoria} - ${errorMsg}`);
          erros++;
        }
      } catch {
        if (response.ok) {
          console.log(`✅ ${categoria}`);
          sucessos++;
        } else {
          console.error(`❌ ${categoria} - ${response.status} ${errorMsg}`);
          erros++;
        }
      }
    } catch (error) {
      console.error(`❌ ${categoria} - ${error.message}`);
      erros++;
    }
  }

  console.log(`\n📊 Resultado: ${sucessos} categorias OK, ${erros} erros`);

  if (erros === 0) {
    console.log('✅ Seed de categorias concluído com sucesso!');
    process.exit(0);
  } else {
    console.error('⚠️  Alguns erros ocorreram ao fazer seed');
    process.exit(1);
  }
}

seedCategorias();
