'use client';

import { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { ZodError } from 'zod';
import { usuarioInviteSchema } from '@/lib/validation/usuario';

interface FormErrors {
  [key: string]: string;
}

interface Usuario {
  id: string;
  email: string;
  role: string;
  status: string;
  invited_by?: string;
  invite_sent_at?: string;
}

const roleLabels: { [key: string]: string } = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  operador: 'Operador',
  vendedor: 'Vendedor',
};

const statusLabels: { [key: string]: string } = {
  pendente: 'Convite enviado',
  ativo: 'Usuário ativo',
  inativo: 'Inativo',
};

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [userSession, setUserSession] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; userId?: string }>({
    open: false,
  });

  const [formData, setFormData] = useState({
    email: '',
    role: 'operador',
  });

  useEffect(() => {
    fetchSession();
    fetchUsuarios();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUserSession(data.usuario);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios?limit=100');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

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
      const validatedData = usuarioInviteSchema.parse(formData);

      const response = await fetch('/api/usuarios/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: 'Este e-mail já está cadastrado no sistema' });
        } else {
          setGeneralError(data.message || 'Erro ao enviar convite');
        }
        return;
      }

      setSuccessMessage('Convite enviado com sucesso!');
      setFormData({
        email: '',
        role: 'operador',
      });

      setTimeout(() => {
        fetchUsuarios();
      }, 500);
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
        setGeneralError('Erro ao enviar convite');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInativar = async () => {
    if (!confirmDialog.userId) return;

    try {
      const response = await fetch(`/api/usuarios/${confirmDialog.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'inativo' }),
      });

      if (response.ok) {
        fetchUsuarios();
        setConfirmDialog({ open: false });
      } else {
        setGeneralError('Erro ao inativar usuário');
      }
    } catch (error) {
      console.error('Error:', error);
      setGeneralError('Erro ao inativar usuário');
    }
  };

  const canInativar = (usuario: Usuario) => {
    if (!userSession) return false;
    if (userSession.role === 'super_admin') return true;
    if (userSession.role === 'admin' && usuario.role !== 'super_admin') return true;
    return false;
  };

  const getRoleOptions = () => {
    if (!userSession) return [];
    if (userSession.role === 'super_admin') {
      return ['super_admin', 'admin', 'operador'];
    }
    return ['admin', 'operador'];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Gerenciar Usuários
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Convidar novos usuários e gerenciar acessos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Enviar Convite
            </Typography>

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
                    label="E-mail"
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
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>Função</InputLabel>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      label="Função"
                      disabled={loading}
                    >
                      {getRoleOptions().map((role) => (
                        <MenuItem key={role} value={role}>
                          {roleLabels[role]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Enviar Convite'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>E-mail</strong></TableCell>
                  <TableCell><strong>Função</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Convidado por</strong></TableCell>
                  <TableCell align="center"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      Nenhum usuário cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{roleLabels[usuario.role] || usuario.role}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[usuario.status] || usuario.status}
                          size="small"
                          color={usuario.status === 'ativo' ? 'success' : usuario.status === 'inativo' ? 'error' : 'warning'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{usuario.invited_by || '—'}</TableCell>
                      <TableCell align="center">
                        {canInativar(usuario) && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setConfirmDialog({ open: true, userId: usuario.id })}
                            title="Inativar usuário"
                          >
                            <BlockIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false })}
      >
        <DialogTitle>Inativar Usuário</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja inativar este usuário?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false })}>
            Cancelar
          </Button>
          <Button onClick={handleInativar} color="error" variant="contained">
            Inativar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
