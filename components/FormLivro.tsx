'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Typography,
  CircularProgress,
  Autocomplete,
  Chip,
  FormHelperText,
  Paper,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { Livro, Categoria, Autor } from '@/lib/types';
import { livroCreateSchema, livroUpdateSchema } from '@/lib/validation/livro';
import { DeleteDialog } from './DeleteDialog';

interface FormLivroProps {
  mode: 'create' | 'edit';
  livro?: Livro;
  onSubmit?: (data: any) => Promise<void>;
}

export function FormLivro({ mode, livro, onSubmit }: FormLivroProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [autoresDisponiveis, setAutoresDisponiveis] = useState<Autor[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    titulo: livro?.titulo || '',
    editora: livro?.editora || '',
    categoria_id: livro?.categoria_id || '',
    ano: livro?.ano || undefined,
    isbn: livro?.isbn || '',
    quantidade_emprestimo: livro?.quantidade_emprestimo || 0,
    quantidade_venda: livro?.quantidade_venda || 0,
    preco_venda: livro?.preco_venda || '',
  });

  const [autoresSelecionados, setAutoresSelecionados] = useState<Autor[]>(livro?.autores || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategorias();
    fetchAutores();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data.categorias);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchAutores = async () => {
    try {
      const response = await fetch('/api/autores');
      if (response.ok) {
        const data = await response.json();
        setAutoresDisponiveis(data.autores || []);
      }
    } catch (error) {
      console.error('Erro ao buscar autores:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleAutoresChange = (newValue: Autor[]) => {
    setAutoresSelecionados(newValue);
    if (errors.autores) {
      setErrors((prev) => ({
        ...prev,
        autores: '',
      }));
    }
  };

  const handleCategoriaChange = async (newValue: Categoria | string | null) => {
    if (typeof newValue === 'string') {
      // É uma nova categoria digitada
      const novaCategoria: Categoria = { id: '', nome: newValue };
      try {
        const response = await fetch('/api/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: newValue }),
        });
        if (response.ok) {
          const data = await response.json();
          const categoria = data.categoria || novaCategoria;
          handleInputChange('categoria_id', categoria.id);
          // Recarregar categorias para mostrar a nova
          await fetchCategorias();
          return;
        }
      } catch (error) {
        console.error('Erro ao criar categoria:', error);
      }
      handleInputChange('categoria_id', novaCategoria.id);
    } else if (newValue) {
      handleInputChange('categoria_id', newValue.id);
    } else {
      handleInputChange('categoria_id', '');
    }
    if (errors.categoria_id) {
      setErrors((prev) => ({
        ...prev,
        categoria_id: '',
      }));
    }
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    const dataToValidate = {
      ...formData,
      ano: formData.ano ? parseInt(String(formData.ano)) : undefined,
      quantidade_emprestimo: parseInt(String(formData.quantidade_emprestimo)) || 0,
      quantidade_venda: parseInt(String(formData.quantidade_venda)) || 0,
      preco_venda: formData.preco_venda ? parseFloat(String(formData.preco_venda)) : undefined,
      autores: autoresSelecionados,
    };

    const schema = mode === 'create' ? livroCreateSchema : livroUpdateSchema;

    try {
      schema.parse(dataToValidate);
      return true;
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          newErrors[field] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        ano: formData.ano ? parseInt(String(formData.ano)) : null,
        quantidade_emprestimo: parseInt(String(formData.quantidade_emprestimo)) || 0,
        quantidade_venda: parseInt(String(formData.quantidade_venda)) || 0,
        preco_venda: formData.preco_venda ? parseFloat(String(formData.preco_venda)) : null,
        autores: autoresSelecionados.map((a) => ({ id: a.id, nome: a.nome })),
      };

      const url = mode === 'create' ? '/api/livros' : `/api/livros/${livro?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar livro');
      }

      const result = await response.json();
      onSubmit?.(result);
      router.push('/livros');
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      setErrors({ submit: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/livros/${livro?.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar livro');
      }

      router.push('/livros');
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      setErrors({ delete: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Título */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título *"
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              error={!!errors.titulo}
              helperText={errors.titulo}
              placeholder="Digite o título do livro"
            />
          </Grid>

          {/* Autores */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              fullWidth
              freeSolo
              options={autoresDisponiveis}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.nome}
              value={autoresSelecionados}
              onChange={async (_, newValue) => {
                const processedValue = await Promise.all(
                  newValue.map(async (item: any) => {
                    if (typeof item === 'string') {
                      // É um novo autor digitado
                      const novoAutor = { id: '', nome: item };
                      // Tentar criar o autor no banco
                      try {
                        const response = await fetch('/api/autores', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ nome: item }),
                        });
                        if (response.ok) {
                          const data = await response.json();
                          return data.autor || novoAutor;
                        }
                      } catch (error) {
                        console.error('Erro ao criar autor:', error);
                      }
                      return novoAutor;
                    }
                    return item;
                  })
                );
                handleAutoresChange(processedValue.filter((a: any) => a.nome));
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Autores *"
                  placeholder="Digite para buscar ou criar novo autor"
                  error={!!errors.autores}
                  helperText={errors.autores || 'Digite um nome e pressione Enter para criar um novo autor'}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={typeof option === 'string' ? option : option.nome}
                    {...getTagProps({ index })}
                    variant="outlined"
                    size="small"
                  />
                ))
              }
              noOptionsText="Nenhum autor encontrado. Digite para criar novo."
            />
          </Grid>

          {/* Editora */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Editora *"
              value={formData.editora}
              onChange={(e) => handleInputChange('editora', e.target.value)}
              error={!!errors.editora}
              helperText={errors.editora}
              placeholder="Nome da editora"
            />
          </Grid>

          {/* Categoria */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              freeSolo
              options={categorias}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.nome}
              value={categorias.find((c) => c.id === formData.categoria_id) || null}
              onChange={(_, newValue) => handleCategoriaChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categoria *"
                  placeholder="Digite para buscar ou criar nova categoria"
                  error={!!errors.categoria_id}
                  helperText={errors.categoria_id || 'Digite um nome e pressione Enter para criar uma nova categoria'}
                />
              )}
              noOptionsText="Nenhuma categoria encontrada. Digite para criar nova."
            />
          </Grid>

          {/* Ano */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Ano"
              value={formData.ano || ''}
              onChange={(e) => handleInputChange('ano', e.target.value ? parseInt(e.target.value) : '')}
              error={!!errors.ano}
              helperText={errors.ano}
              placeholder="Ex: 2024"
            />
          </Grid>

          {/* ISBN */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ISBN"
              value={formData.isbn}
              onChange={(e) => handleInputChange('isbn', e.target.value)}
              error={!!errors.isbn}
              helperText={errors.isbn}
              placeholder="ISBN do livro"
            />
          </Grid>

          {/* Quantidade Empréstimo */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Quantidade para Empréstimo"
              value={formData.quantidade_emprestimo}
              onChange={(e) => handleInputChange('quantidade_emprestimo', e.target.value)}
              error={!!errors.quantidade_emprestimo}
              helperText={errors.quantidade_emprestimo}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Quantidade Venda */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Quantidade em Estoque"
              value={formData.quantidade_venda}
              onChange={(e) => handleInputChange('quantidade_venda', e.target.value)}
              error={!!errors.quantidade_venda}
              helperText={errors.quantidade_venda}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Preço Venda */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Preço de Venda"
              value={formData.preco_venda}
              onChange={(e) => handleInputChange('preco_venda', e.target.value)}
              error={!!errors.preco_venda}
              helperText={errors.preco_venda}
              inputProps={{ step: 0.01, min: 0 }}
              placeholder="0.00"
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Grid>

          {/* Error Message */}
          {errors.submit && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, backgroundColor: '#ffebee', borderRadius: 1, color: '#c62828' }}>
                <Typography variant="body2">{errors.submit}</Typography>
              </Box>
            </Grid>
          )}

          {/* Botões */}
          <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Voltar
            </Button>

            {mode === 'edit' && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={loading}
                sx={{ ml: 'auto' }}
              >
                Deletar
              </Button>
            )}
          </Grid>
        </Grid>
      </form>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        title="Deletar Livro"
        message={`Tem certeza que deseja deletar o livro "${livro?.titulo}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={loading}
      />
    </Paper>
  );
}
