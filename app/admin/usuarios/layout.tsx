'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { UsuarioSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export default function AdminUsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          router.push('/auth/login');
          return;
        }

        // Get user role from database
        const { data: usuarioDB, error } = await supabase
          .from('usuarios')
          .select('id, nome, email, role, cpf')
          .eq('id', session.user.id)
          .single();

        if (error || !usuarioDB) {
          router.push('/auth/login');
          return;
        }

        const usuarioData: UsuarioSession = {
          id: usuarioDB.id,
          cpf: usuarioDB.cpf,
          nome: usuarioDB.nome,
          email: usuarioDB.email,
          role: usuarioDB.role,
        };

        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }

    checkPermission();
  }, [router]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        Verificando permissões...
      </Box>
    );
  }

  if (!usuario || usuario.role !== 'super_admin') {
    return null;
  }

  return children;
}
