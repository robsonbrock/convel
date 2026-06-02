'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/DataTable';
import AddIcon from '@mui/icons-material/Add';

interface Usuario {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  role: 'super_admin' | 'admin' | 'vendedor';
  telefone?: string;
  endereco?: string;
  created_at: string;
  updated_at: string;
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, [searchTerm]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      let url = '/api/usuarios?limit=50&offset=0';

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    {
      id: 'nome',
      label: 'Nome',
      sortable: true,
      render: (value) => value,
    },
    {
      id: 'email',
      label: 'Email',
      render: (value) => value,
    },
    {
      id: 'cpf',
      label: 'CPF',
      render: (value) => {
        if (!value) return '-';
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      },
    },
    {
      id: 'role',
      label: 'Função',
      render: (value) => {
        const roleLabels: Record<string, string> = {
          super_admin: 'Super Admin',
          admin: 'Admin',
          vendedor: 'Vendedor',
        };
        return roleLabels[value] || value;
      },
    },
    {
      id: 'created_at',
      label: 'Data de Cadastro',
      render: (value) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('pt-BR');
      },
    },
  ];

  const handleEdit = (id: string) => {
    router.push(`/admin/usuarios/${id}/editar`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        const response = await fetch(`/api/usuarios/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsuarios(usuarios.filter((u) => u.id !== id));
        } else {
          alert('Erro ao deletar usuário');
        }
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao deletar usuário');
      }
    }
  };

  if (loading && usuarios.length === 0) {
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
          Usuários
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gerenciar usuários do sistema
        </Typography>
      </Box>

      {/* Ações */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/usuarios/novo')}
        >
          Novo Usuário
        </Button>
      </Box>

      {/* DataTable */}
      <DataTable<Usuario>
        columns={columns}
        data={usuarios}
        loading={loading}
        onSearch={(term) => setSearchTerm(term)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar por nome, email ou CPF..."
        showActions={true}
      />
    </Container>
  );
}
