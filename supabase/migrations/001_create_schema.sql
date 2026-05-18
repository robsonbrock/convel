-- Create users table
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf VARCHAR(11) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'vendedor' CHECK (role IN ('super_admin', 'admin', 'vendedor')),
  telefone VARCHAR(20),
  endereco TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create leitores table
CREATE TABLE IF NOT EXISTS leitores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf VARCHAR(11) UNIQUE,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  endereco TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create categorias table
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) UNIQUE NOT NULL
);

-- Create autores table
CREATE TABLE IF NOT EXISTS autores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) UNIQUE NOT NULL
);

-- Create livros table
CREATE TABLE IF NOT EXISTS livros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  titulo VARCHAR(255) NOT NULL,
  editora VARCHAR(255),
  ano INTEGER,
  isbn VARCHAR(20),
  quantidade_venda INTEGER NOT NULL DEFAULT 0,
  quantidade_emprestimo INTEGER NOT NULL DEFAULT 0,
  preco_venda DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create livro_autores table (N-para-N)
CREATE TABLE IF NOT EXISTS livro_autores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livro_id UUID NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
  autor_id UUID NOT NULL REFERENCES autores(id) ON DELETE CASCADE,
  UNIQUE(livro_id, autor_id)
);

-- Create vendas table
CREATE TABLE IF NOT EXISTS vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livro_id UUID NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
  data_venda DATE NOT NULL DEFAULT CURRENT_DATE,
  quantidade_vendida INTEGER NOT NULL DEFAULT 0,
  preco_original DECIMAL(10, 2) NOT NULL,
  preco_negociado DECIMAL(10, 2),
  tipo_pagamento VARCHAR(20) CHECK (tipo_pagamento IN ('pix', 'credito', 'debito', 'dinheiro')),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create emprestimos table
CREATE TABLE IF NOT EXISTS emprestimos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livro_id UUID NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
  leitor_id UUID NOT NULL REFERENCES leitores(id) ON DELETE RESTRICT,
  quantidade_emprestada INTEGER NOT NULL DEFAULT 1,
  data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
  data_devolucao DATE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX idx_leitores_cpf ON leitores(cpf);
CREATE INDEX idx_livros_categoria ON livros(categoria_id);
CREATE INDEX idx_vendas_livro ON vendas(livro_id);
CREATE INDEX idx_vendas_data ON vendas(data_venda);
CREATE INDEX idx_emprestimos_livro ON emprestimos(livro_id);
CREATE INDEX idx_emprestimos_leitor ON emprestimos(leitor_id);
CREATE INDEX idx_emprestimos_data ON emprestimos(data_emprestimo);
