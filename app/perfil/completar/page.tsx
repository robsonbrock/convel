'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { usuarioPerfilSchema } from '@/lib/validation/usuario';
import { ZodError } from 'zod';

interface FormErrors {
  [key: string]: string;
}

export default function CompletarPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [userFullName, setUserFullName] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    apelido: '',
  });

  useEffect(() => {
    // Get user info from Supabase Auth metadata
    const getUser = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        const fullName = user.user_metadata?.full_name || '';
        setUserFullName(fullName);
        setFormData((prev) => ({
          ...prev,
          nome: fullName,
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error getting user:', error);
        router.push('/auth/login');
      }
    };

    getUser();
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setGeneralError('');
    setErrors({});

    try {
      const validatedData = usuarioPerfilSchema.parse(formData);

      const response = await fetch('/api/perfil/completar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const data = await response.json();
        setGeneralError(data.error || 'Erro ao atualizar perfil');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const fieldName = err.path[0] as string;
          newErrors[fieldName] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error:', error);
        setGeneralError('Erro ao atualizar perfil');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Completar Perfil
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Por favor, complete suas informações para finalizar o cadastro
        </Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {generalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={!!errors.nome}
                helperText={errors.nome}
                disabled={submitting}
                placeholder="Como você é chamado oficialmente"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Apelido / Como prefere ser chamado"
                name="apelido"
                value={formData.apelido}
                onChange={handleChange}
                error={!!errors.apelido}
                helperText={errors.apelido || 'Como você gosta de ser chamado'}
                disabled={submitting}
                placeholder="Ex: Brock, Pedrinho, etc"
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitting}
                sx={{ minWidth: 200 }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Salvar e Continuar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
