'use client';

import { Container, Typography, Box } from '@mui/material';
import { FormLivro } from '@/components/FormLivro';

export default function NovoLivroPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Novo Livro
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Adicionar um novo livro ao acervo
        </Typography>
      </Box>

      <FormLivro mode="create" />
    </Container>
  );
}
