-- Insert categorias pré-cadastradas
INSERT INTO categorias (nome) VALUES
  ('Evangelho'),
  ('Mediunidade'),
  ('Reforma Íntima'),
  ('Família'),
  ('Ansiedade e Emoções'),
  ('Vida após a Morte'),
  ('Estudos'),
  ('Infantil'),
  ('Romance'),
  ('Autoconhecimento'),
  ('Palestras e Apostilas')
ON CONFLICT (nome) DO NOTHING;

-- Insert super_admin user (robsonbrock@gmail.com)
-- Senha: ConVEL@2024 (hash: $2a$10$...) - será gerada via aplicação na primeira execução
-- Por agora, deixaremos vazio e o usuário deve ser criado via app
-- INSERT INTO usuarios (cpf, nome, email, senha, role) VALUES
--   ('12345678901', 'Robson Brock', 'robsonbrock@gmail.com', '', 'super_admin');
