// Schemas Zod para autenticacao.
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token obrigatório"),
});
