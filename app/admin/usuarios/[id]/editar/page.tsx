'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { usuarioUpdateSchema } from '@/lib/validation/usuario';
import { ZodError } from 'zod';

interface FormErrors {
  [key: string]: string;
}

interface Usuario {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  role: 'super_admin' | 'admin' | 'vendedor';
  telefone?: string;
  endereco?: string;
}

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [formData, setFormData] = useState<Usuario>({
    id: '',
    cpf: '',
    nome: '',
    email: '',
    role: 'vendedor',
    telefone: '',
    endereco: '',
  });

  const [senha, setSenha] = useState('');

  useEffect(() => {
    fetchUsuario();
  }, [id]);

  const fetchUsuario = async () => {
    try {
      const response = await fetch(`/api/usuarios/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        setGeneralError('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Error:', error);
      setGeneralError('Erro ao carregar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'senha') {
      setSenha(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    setSuccessMessage('');
    setErrors({});

    try {
      const submitData = {
        nome: formData.nome,
        email: formData.email,
        role: formData.role,
        telefone: formData.telefone,
        endereco: formData.endereco,
        ...(senha && { senha }),
      };

      const validatedData = usuarioUpdateSchema.parse(submitData);

      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const data = await response.json();
        setGeneralError(data.error || 'Erro ao atualizar usuário');
        return;
      }

      setSuccessMessage('Usuário atualizado com sucesso!');
      setSenha('');

      setTimeout(() => {
        router.push('/admin/usuarios');
      }, 1500);
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as string;
          newErrors[fieldName] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Error:', error);
        setGeneralError('Erro ao atualizar usuário');
      }
    } finally {
      setSubmitting(false);
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

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Editar Usuário
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Atualizar informações do usuário
        </Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {generalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CPF"
                value={formData.cpf}
                disabled
                helperText="CPF não pode ser alterado"
              />
            </Grid>

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
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha (deixe vazio para não alterar)"
                name="senha"
                type="password"
                value={senha}
                onChange={handleChange}
                error={!!errors.senha}
                helperText={errors.senha || 'Mínimo 8 caracteres se preenchido'}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Função</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Função"
                  disabled={submitting}
                >
                  <MenuItem value="vendedor">Vendedor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefone (Opcional)"
                name="telefone"
                value={formData.telefone || ''}
                onChange={handleChange}
                error={!!errors.telefone}
                helperText={errors.telefone}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço (Opcional)"
                name="endereco"
                value={formData.endereco || ''}
                onChange={handleChange}
                error={!!errors.endereco}
                helperText={errors.endereco}
                disabled={submitting}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin/usuarios')}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitting}
                sx={{ minWidth: 120 }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Atualizar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
