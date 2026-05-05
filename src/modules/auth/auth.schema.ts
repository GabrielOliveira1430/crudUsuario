import { z } from 'zod';

// 🔐 LOGIN
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// 🔐 2FA
export const verify2FASchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  code: z.string().regex(/^\d{6}$/, 'Código deve conter 6 números'),
});

// 📩 FORGOT PASSWORD
export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
});

// 🔐 RESET PASSWORD
export const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Token inválido'),

  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .regex(/[A-Za-z]/, 'Deve conter letras')
    .regex(/[0-9]/, 'Deve conter números'),
});