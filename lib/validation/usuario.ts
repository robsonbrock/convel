import { z } from 'zod';

export const usuarioSchema = z.object({
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos')
    .min(11, 'CPF inválido')
    .max(11, 'CPF inválido'),
  nome: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  senha: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(255, 'Senha deve ter no máximo 255 caracteres'),
  role: z
    .enum(['super_admin', 'admin', 'vendedor'], {
      errorMap: () => ({ message: 'Role inválido' }),
    }),
  telefone: z
    .string()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),
  endereco: z
    .string()
    .max(500, 'Endereço deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
});

export const usuarioUpdateSchema = usuarioSchema.omit({ senha: true }).extend({
  senha: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .optional()
    .nullable(),
});

export type UsuarioInput = z.infer<typeof usuarioSchema>;
export type UsuarioUpdateInput = z.infer<typeof usuarioUpdateSchema>;
