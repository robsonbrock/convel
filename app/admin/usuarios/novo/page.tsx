'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { usuarioSchema } from '@/lib/validation/usuario';
import { ZodError } from 'zod';

interface FormErrors {
  [key: string]: string;
}

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    email: '',
    senha: '',
    role: 'vendedor',
    telefone: '',
    endereco: '',
  });

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
    setLoading(true);
    setGeneralError('');
    setSuccessMessage('');
    setErrors({});

    try {
      const validatedData = usuarioSchema.parse(formData);

      const response = await fetch('/api/usuarios/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'CPF já cadastrado') {
          setErrors({ cpf: 'CPF já cadastrado' });
        } else if (data.error === 'Email já cadastrado') {
          setErrors({ email: 'Email já cadastrado' });
        } else {
          setGeneralError(data.error || 'Erro ao criar usuário');
        }
        return;
      }

      setSuccessMessage('Usuário criado com sucesso!');
      setFormData({
        cpf: '',
        nome: '',
        email: '',
        senha: '',
        role: 'vendedor',
        telefone: '',
        endereco: '',
      });

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
        setGeneralError('Erro ao criar usuário');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Novo Usuário
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Criar um novo usuário no sistema
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
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="11111111111"
                error={!!errors.cpf}
                helperText={errors.cpf}
                disabled={loading}
                inputProps={{ maxLength: 11 }}
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
                disabled={loading}
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
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                error={!!errors.senha}
                helperText={errors.senha || 'Mínimo 8 caracteres'}
                disabled={loading}
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
                  disabled={loading}
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
                value={formData.telefone}
                onChange={handleChange}
                error={!!errors.telefone}
                helperText={errors.telefone}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço (Opcional)"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                error={!!errors.endereco}
                helperText={errors.endereco}
                disabled={loading}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin/usuarios')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Criar Usuário'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
