'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { UsuarioSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export default function LivrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
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

        setUsuario({
          id: session.user.id,
          cpf: session.user.id,
          nome: session.user.user_metadata?.full_name || session.user.email || 'Usuário',
          email: session.user.email || '',
          role: 'vendedor',
        });
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        Carregando...
      </Box>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header
        usuario={usuario}
        onMenuToggle={() => setDrawerOpen(!drawerOpen)}
      />

      <Box display="flex" flex={1}>
        <Sidebar
          usuario={usuario}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: { xs: 0, md: '250px' },
            mt: { xs: '56px', sm: '64px' },
          }}
        >
          <Container maxWidth="lg">
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
