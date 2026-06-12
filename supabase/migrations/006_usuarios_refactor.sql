-- Tornar CPF e senha opcionais (mantém as colunas, apenas remove NOT NULL)
ALTER TABLE usuarios ALTER COLUMN cpf DROP NOT NULL;
ALTER TABLE usuarios ALTER COLUMN senha DROP NOT NULL;

-- Adicionar novos campos
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS apelido TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'ativo', 'inativo')),
  ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES usuarios(id);
