import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSuperAdmin() {
  try {
    const email = 'robsonbrock@gmail.com';
    const nome = 'Robson Brock';
    const role = 'super_admin';

    // Check if user already exists
    const { data: existing } = await supabase
      .from('usuarios')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existing) {
      console.log(`✓ Super admin já existe: ${email}`);
      return;
    }

    // Insert super admin
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          email,
          nome,
          role,
          status: 'ativo',
          cpf: null,
          senha: null,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`✓ Super admin criado com sucesso:`);
    console.log(`  ID: ${data.id}`);
    console.log(`  Email: ${data.email}`);
    console.log(`  Nome: ${data.nome}`);
    console.log(`  Role: ${data.role}`);
    console.log(`  Status: ${data.status}`);
  } catch (error) {
    console.error('Erro ao criar super admin:', error);
    process.exit(1);
  }
}

seedSuperAdmin();
