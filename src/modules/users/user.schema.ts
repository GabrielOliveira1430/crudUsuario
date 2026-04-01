import { z } from 'zod';

/**
 * 🔐 Regra de senha forte
 */
const strongPassword = z
  .string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres')
  .regex(/[A-Z]/, 'Deve conter pelo menos 1 letra maiúscula')
  .regex(/[0-9]/, 'Deve conter pelo menos 1 número')
  .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos 1 caractere especial');

/**
 * Criar usuário
 */
export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: strongPassword
});

/**
 * Login
 */
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha inválida')
});

/**
 * Atualizar usuário
 */
export const updateUserSchema = z.object({
  name: z.string().min(3, 'Nome muito curto').optional(),
  email: z.string().email('Email inválido').optional(),
  password: strongPassword.optional(),
  role: z.enum(['USER', 'ADMIN']).optional()
});