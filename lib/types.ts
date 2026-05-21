export type UserRole = 'super_admin' | 'admin' | 'vendedor';

export interface Usuario {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  role: UserRole;
  telefone?: string;
  endereco?: string;
  created_at: string;
  updated_at: string;
}

export interface Leitor {
  id: string;
  cpf?: string;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: string;
  nome: string;
}

export interface Autor {
  id: string;
  nome: string;
}

export interface Livro {
  id: string;
  categoria_id: string;
  titulo: string;
  editora?: string;
  ano?: number;
  isbn?: string;
  codigo?: string;
  quantidade_venda: number;
  quantidade_emprestimo: number;
  preco_venda?: number;
  detalhes?: string;
  created_at: string;
  updated_at: string;
  categoria?: Categoria;
  autores?: Autor[];
}

export interface LivroAutor {
  id: string;
  livro_id: string;
  autor_id: string;
}

export interface Venda {
  id: string;
  livro_id: string;
  data_venda: string;
  quantidade_vendida: number;
  preco_original: number;
  preco_negociado?: number;
  tipo_pagamento?: 'pix' | 'credito' | 'debito' | 'dinheiro';
  observacoes?: string;
  created_at: string;
  updated_at: string;
  livro?: Livro;
}

export interface Emprestimo {
  id: string;
  livro_id: string;
  leitor_id: string;
  quantidade_emprestada: number;
  data_emprestimo: string;
  data_devolucao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  livro?: Livro;
  leitor?: Leitor;
}
