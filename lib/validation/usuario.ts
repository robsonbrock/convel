import { z } from 'zod';

// Schema para criar usuário via convite (apenas email e role)
export const usuarioInviteSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  role: z
    .enum(['super_admin', 'admin', 'operador'])
    .refine((role) => role !== 'super_admin', {
      message: 'Você não pode criar um super_admin',
      path: ['role'],
    }),
});

// Schema legado para criar usuário com todos os campos (mantém compatibilidade)
export const usuarioSchema = z.object({
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos')
    .min(11, 'CPF inválido')
    .max(11, 'CPF inválido')
    .optional()
    .nullable(),
  nome: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  senha: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(255, 'Senha deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
  role: z
    .enum(['super_admin', 'admin', 'vendedor', 'operador'])
    .default('operador'),
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
  apelido: z
    .string()
    .max(100, 'Apelido deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),
});

// Schema para completar perfil (nome + apelido após primeiro login)
export const usuarioPerfilSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  apelido: z
    .string()
    .min(1, 'Apelido é obrigatório')
    .max(100, 'Apelido deve ter no máximo 100 caracteres'),
});

export type UsuarioInviteInput = z.infer<typeof usuarioInviteSchema>;
export type UsuarioInput = z.infer<typeof usuarioSchema>;
export type UsuarioUpdateInput = z.infer<typeof usuarioUpdateSchema>;
export type UsuarioPerfilInput = z.infer<typeof usuarioPerfilSchema>;
