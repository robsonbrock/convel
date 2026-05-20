'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useParams } from 'next/navigation';
import { FormLivro } from '@/components/FormLivro';
import { Livro } from '@/lib/types';

export default function EditarLivroPage() {
  const params = useParams();
  const id = params.id as string;
  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLivro();
    }
  }, [id]);

  const fetchLivro = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/livros/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLivro(data.livro);
      }
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!livro) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography color="error">Livro não encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Editar Livro
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Modificar dados do livro
        </Typography>
      </Box>

      <FormLivro mode="edit" livro={livro} />
    </Container>
  );
}
