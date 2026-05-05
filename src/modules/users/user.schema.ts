import { z } from "zod";
import { Role } from "@prisma/client";

/**
 * Criar usuário
 */
export const createUserSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha muito fraca"),
  role: z.nativeEnum(Role).optional(),
});

/**
 * Atualizar usuário (CORRIGIDO)
 */
export const updateUserSchema = z.object({
  name: z.string().min(3, "Nome muito curto").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Senha muito fraca").optional(),
  role: z.nativeEnum(Role).optional(), // 🔥 ESSENCIAL
});