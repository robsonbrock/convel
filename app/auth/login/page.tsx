'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Falha ao conectar com Google');
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Container maxWidth="sm">
        <Card elevation={3}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                margin: '0 auto 16px',
                bgcolor: 'primary.main',
                fontSize: '32px',
              }}
            >
              C
            </Avatar>

            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              ConVEL
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Sistema de Controle de Vendas e Empréstimos
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={24} color="inherit" />
                  Conectando...
                </Box>
              ) : (
                '🔐 Entrar com Google'
              )}
            </Button>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="textSecondary" display="block">
                Acesso restrito para usuários autorizados
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
