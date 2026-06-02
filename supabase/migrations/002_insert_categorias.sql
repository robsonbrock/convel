-- Insert default categories
INSERT INTO categorias (nome) VALUES
  ('Evangelho'),
  ('Mediunidade'),
  ('Reforma Íntima'),
  ('Família'),
  ('Ansiedade e Emoções'),
  ('Vida Após a Morte'),
  ('Estudos'),
  ('Infantil'),
  ('Romance'),
  ('Autoconhecimento'),
  ('Palestras e Apóstillas')
ON CONFLICT (nome) DO NOTHING;
