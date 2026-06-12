'use client';

import { useEffect, useState } from 'react';
import { useRouter, redirect } from 'next/navigation';
import { Box, Container } from '@mui/material';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { UsuarioSession } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  console.log('[Dashboard] RENDER - loading:', loading, 'usuario:', usuario?.email);

  useEffect(() => {
    console.log('[Dashboard] 🔍 useEffect iniciado - verificando autenticação');
    console.log('[Dashboard] VERSION: 2025-06-12-v5');
    let isMounted = true;

    async function checkAuth() {
      try {
        const supabase = getSupabase();
        console.log('[Dashboard] Supabase client obtained');

        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session?.user) {
          console.log('[Dashboard] No session found, throwing error');
          throw new Error('UNAUTHORIZED: No session found');
        }

        console.log('[Dashboard] Session found:', session.user.email);

        // Get user data from database
        console.log('[Dashboard] Querying usuarios table for email:', session.user.email);
        const queryResult = await supabase
          .from('usuarios')
          .select('id, cpf, nome, email, role, apelido, status')
          .eq('email', session.user.email)
          .single();

        const { data: usuarioDB, error: dbError } = queryResult;

        console.log('[Dashboard] ⚠️ RAW Query result:', queryResult);
        console.log('[Dashboard] ⚠️ usuarioDB:', usuarioDB);
        console.log('[Dashboard] ⚠️ dbError:', dbError);
        console.log('[Dashboard] ⚠️ Condition check - dbError:', !!dbError, '- !usuarioDB:', !usuarioDB);

        if (!isMounted) return;

        if (dbError || !usuarioDB) {
          console.error('[Dashboard] ❌ BLOQUEADO - User NOT in whitelist:', session.user.email);
          console.error('[Dashboard] Error details:', dbError);
          // Throw error to trigger error boundary - this prevents ANY rendering
          throw new Error(`UNAUTHORIZED: ${session.user.email} not in whitelist. ${dbError?.message || 'User not found'}`);
        }

        console.log('[Dashboard] ✅ User found in whitelist:', usuarioDB.email);

        if (usuarioDB.status === 'inativo') {
          console.log('[Dashboard] User is inactive:', session.user.email);
          throw new Error(`UNAUTHORIZED: User ${session.user.email} is inactive`);
        }

        // If first time logging in (status pendente), redirect to profile completion
        if (usuarioDB.status === 'pendente') {
          console.log('[Dashboard] First login - redirecting to profile completion');
          await supabase
            .from('usuarios')
            .update({ status: 'ativo' })
            .eq('id', usuarioDB.id);
          router.push('/perfil/completar');
          setLoading(false);
          return;
        }

        if (!isMounted) return;

        // Create a user object from the session/database
        const usuarioData: UsuarioSession = {
          id: usuarioDB.id,
          cpf: usuarioDB.cpf || '',
          nome: usuarioDB.nome || session.user.user_metadata?.full_name || '',
          email: session.user.email || '',
          role: usuarioDB.role,
          apelido: usuarioDB.apelido,
        };

        setUsuario(usuarioData);
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        if (isMounted) {
          router.push('/auth/login');
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
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
