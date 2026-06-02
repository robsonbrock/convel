'use client';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';

export interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  loading?: boolean;
  onSearch: (term: string) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  onEdit?: (id: string, row: T) => void;
  onDelete?: (id: string, row: T) => void;
  onLoanClick?: (id: string, row: T) => void;
  onSaleClick?: (id: string, row: T) => void;
  searchPlaceholder?: string;
  showActions?: boolean;
  showLoanAction?: boolean;
  showSaleAction?: boolean;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  onSearch,
  onSort,
  onEdit,
  onDelete,
  onLoanClick,
  onSaleClick,
  searchPlaceholder = 'Buscar...',
  showActions = true,
  showLoanAction = true,
  showSaleAction = true,
}: DataTableProps<T>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const headerBg = isDark ? '#1f2937' : '#ffffff';
  const headerText = isDark ? '#f1f5f9' : '#1a1a1a';
  const headerBorder = isDark ? '#374151' : '#4f46e5';

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ columnId: string; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setPage(0);
    onSearch(value);
  };

  const handleSort = (columnId: string) => {
    const newDirection = sortConfig?.columnId === columnId && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ columnId, direction: newDirection });
    onSort?.(columnId, newDirection);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header com Busca */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          sx={{ flex: 1, maxWidth: 400 }}
          slotProps={{
            input: {
              sx: { borderRadius: 1 },
            },
          }}
        />
      </Box>

      {/* Tabela */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <Typography color="textSecondary">Nenhum registro encontrado</Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      backgroundColor: `${headerBg} !important`,
                      fontWeight: 700,
                      color: headerText,
                      cursor: column.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      width: column.width,
                      borderBottom: `3px solid ${headerBorder} !important`,
                      '&:hover': column.sortable ? { backgroundColor: isDark ? '#2d3748 !important' : '#f5f5f5 !important' } : {},
                    }}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    {column.label}
                    {column.sortable && sortConfig?.columnId === column.id && (
                      <span style={{ marginLeft: 8 }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </TableCell>
                ))}
                {showActions && <TableCell align="right" sx={{ backgroundColor: `${headerBg} !important`, fontWeight: 700, color: headerText, borderBottom: `3px solid ${headerBorder} !important` }}>Ações</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(79, 70, 229, 0.08)',
                      transition: 'background-color 150ms ease-in-out',
                    },
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ py: 1.5 }}>
                      {column.render ? column.render((row as any)[column.id], row) : (row as any)[column.id]}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        {showLoanAction && onLoanClick && (
                          <IconButton
                            size="small"
                            onClick={() => onLoanClick(row.id, row)}
                            title="Emprestar"
                            sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.1)' } }}
                          >
                            📦
                          </IconButton>
                        )}
                        {showSaleAction && onSaleClick && (
                          <IconButton
                            size="small"
                            onClick={() => onSaleClick(row.id, row)}
                            title="Vender"
                            sx={{ color: 'success.main', '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' } }}
                          >
                            ⓢ
                          </IconButton>
                        )}
                        {onEdit && (
                          <IconButton
                            size="small"
                            onClick={() => onEdit(row.id, row)}
                            title="Editar"
                            sx={{ color: 'info.main', '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' } }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            size="small"
                            onClick={() => onDelete(row.id, row)}
                            title="Deletar"
                            sx={{ color: 'error.main', '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Paginação */}
      {data.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      )}
    </Box>
  );
}
