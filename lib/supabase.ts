import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase não configurado. Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

let supabaseClient: any = null;

export function getSupabase() {
  if (typeof window === 'undefined') {
    // Server-side: create new instance for each request to avoid state pollution
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  // Client-side: use singleton
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'sb-auth-token',
      },
    });
  }
  return supabaseClient;
}

export async function getSupabaseAsync() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; '),
      },
    },
  });
}
