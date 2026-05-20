'use client';

import { Box, Typography, Grid } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UsuarioSession } from '@/lib/auth';
import { StatCard } from '@/components/StatCard';
import { ActionCard } from '@/components/ActionCard';
import { RecentActivity } from '@/components/RecentActivity';

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [totalLivros, setTotalLivros] = useState('0');

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUsuario(data.usuario);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function fetchTotalLivros() {
      try {
        const response = await fetch('/api/livros?limit=1');
        if (response.ok) {
          const data = await response.json();
          setTotalLivros(String(data.total || 0));
        }
      } catch (error) {
        console.error('Error fetching total livros:', error);
      }
    }

    fetchSession();
    fetchTotalLivros();
  }, []);

  const stats = [
    {
      label: 'Total de Livros',
      value: totalLivros,
      icon: 'menu_book',
      color: 'primary' as const,
    },
    {
      label: 'Vendas Mês',
      value: '0',
      icon: 'trending_up',
      color: 'success' as const,
    },
    {
      label: 'Empréstimos Ativos',
      value: '0',
      icon: 'assignment',
      color: 'info' as const,
    },
    {
      label: 'Usuários',
      value: '0',
      icon: 'people',
      color: 'secondary' as const,
    },
  ];

  const handleNovoLivro = useCallback(() => {
    router.push('/livro/novo');
  }, [router]);

  const handleNovaVenda = useCallback(() => {
    router.push('/venda');
  }, [router]);

  const handleNovoEmprestimo = useCallback(() => {
    router.push('/emprestimo');
  }, [router]);

  const handleNovoUsuario = useCallback(() => {
    // TODO: Implement when users page is ready
    console.log('Novo Usuário clicked');
  }, []);

  const actions = [
    { title: 'Novo Livro', icon: 'add_circle', color: 'primary' as const, onClick: handleNovoLivro },
    { title: 'Nova Venda', icon: 'add_shopping_cart', color: 'success' as const, onClick: handleNovaVenda },
    { title: 'Novo Empréstimo', icon: 'library_add', color: 'info' as const, onClick: handleNovoEmprestimo },
    { title: 'Novo Usuário', icon: 'person_add', color: 'secondary' as const, onClick: handleNovoUsuario },
  ];

  return (
    <Box sx={{ animation: 'fadeIn 300ms ease-in', '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Dashboard
        </Typography>
        {usuario && (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ fontSize: '1rem' }}
          >
            Bem-vindo de volta,{' '}
            <Typography component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {usuario.nome}
            </Typography>
            !
          </Typography>
        )}
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map(stat => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'text.primary',
          }}
        >
          Ações Rápidas
        </Typography>
        <Grid container spacing={3}>
          {actions.map(action => (
            <Grid item xs={12} sm={6} md={3} key={action.title}>
              <ActionCard
                title={action.title}
                icon={action.icon}
                color={action.color}
                onClick={action.onClick}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Activity */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'text.primary',
          }}
        >
          Atividade Recente
        </Typography>
        <RecentActivity />
      </Box>
    </Box>
  );
}
