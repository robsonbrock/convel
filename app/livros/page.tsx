'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Grid, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/DataTable';
import { Livro } from '@/lib/types';
import AddIcon from '@mui/icons-material/Add';

export default function LivrosPage() {
  const router = useRouter();
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ columnId: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchLivros();
  }, [searchTerm, sortConfig]);

  const fetchLivros = async () => {
    setLoading(true);
    try {
      let url = '/api/livros?page=1&limit=50';

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      if (sortConfig) {
        url += `&orderBy=${sortConfig.columnId}&orderDir=${sortConfig.direction}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLivros(data.livros || []);
      }
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    {
      id: 'titulo',
      label: 'Título',
      sortable: true,
      render: (value) => value,
    },
    {
      id: 'autores',
      label: 'Autores',
      render: (value: any, row: any) => {
        const autores = row.autores || [];
        return autores.length > 0 ? autores.map((a: any) => a.nome).join(', ') : '-';
      },
    },
    {
      id: 'editora',
      label: 'Editora',
      sortable: true,
      render: (value) => value,
    },
    {
      id: 'ano',
      label: 'Ano',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      id: 'categoria_id',
      label: 'Categoria',
      render: (value: any, row: any) => (row.categoria?.nome || '-'),
    },
  ];

  const handleEdit = (id: string) => {
    router.push(`/livro/${id}/editar`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este livro?')) {
      try {
        const response = await fetch(`/api/livros/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setLivros(livros.filter((l) => l.id !== id));
        }
      } catch (error) {
        console.error('Erro ao deletar livro:', error);
      }
    }
  };

  const handleLoan = (id: string) => {
    router.push(`/emprestimo?livro_id=${id}`);
  };

  const handleSale = (id: string) => {
    router.push(`/venda?livro_id=${id}`);
  };

  if (loading && livros.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Livros
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gerenciar livros do acervo
        </Typography>
      </Box>

      {/* Ações */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => router.push('/emprestimo')}
          sx={{ minWidth: 150 }}
        >
          Empréstimo
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => router.push('/venda')}
          sx={{ minWidth: 150 }}
        >
          Venda
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => router.push('/livro/novo')}
          sx={{ ml: { xs: 0, sm: 'auto' }, minWidth: 150 }}
        >
          Novo Livro
        </Button>
      </Box>

      {/* DataTable */}
      <DataTable<Livro>
        columns={columns}
        data={livros}
        loading={loading}
        onSearch={(term) => setSearchTerm(term)}
        onSort={(columnId, direction) => setSortConfig({ columnId, direction })}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onLoanClick={handleLoan}
        onSaleClick={handleSale}
        searchPlaceholder="Buscar por título, autor ou editora..."
        showActions={true}
        showLoanAction={true}
        showSaleAction={true}
      />
    </Container>
  );
}
