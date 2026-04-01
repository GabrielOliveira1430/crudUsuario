import { z } from 'zod';

/**
 * Criar usuário
 */
export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
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
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  role: z.enum(['USER', 'ADMIN']).optional()
});