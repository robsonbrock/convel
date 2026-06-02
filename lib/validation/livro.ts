import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const autorSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1, 'Nome do autor obrigatório'),
});

export const livroCreateSchema = z.object({
  titulo: z.string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(255, 'Título não pode exceder 255 caracteres'),

  editora: z.string().max(255).optional().nullable(),

  categoria_id: z.string().uuid().optional().nullable(),

  ano: z.number()
    .int('Ano deve ser um número inteiro')
    .min(1900, 'Ano deve ser maior que 1900')
    .max(currentYear + 5, `Ano não pode ser maior que ${currentYear + 5}`)
    .optional()
    .nullable(),

  isbn: z.string().max(20).optional().nullable(),

  codigo: z.string().max(100).optional().nullable(),

  quantidade_emprestimo: z.number()
    .int('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade não pode ser negativa')
    .default(0),

  quantidade_venda: z.number()
    .int('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade não pode ser negativa')
    .default(0),

  preco_venda: z.number()
    .positive('Preço deve ser positivo')
    .optional()
    .nullable(),

  detalhes: z.string()
    .optional()
    .nullable(),

  autores: z.array(autorSchema)
    .min(1, 'Pelo menos um autor é obrigatório'),
});

export const livroUpdateSchema = livroCreateSchema.partial();

export type LivroCreate = z.infer<typeof livroCreateSchema>;
export type LivroUpdate = z.infer<typeof livroUpdateSchema>;
export type Autor = z.infer<typeof autorSchema>;
