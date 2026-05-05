import { api } from "../api/client";

// LOGIN
export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });
  return data;
};

// VERIFY 2FA
export const verify2FARequest = async (email: string, code: string) => {
  const { data } = await api.post("/auth/verify-2fa", {
    email,
    code,
  });
  return data;
};

// REFRESH
export const refreshTokenRequest = async (refreshToken: string) => {
  const { data } = await api.post("/auth/refresh", {
    refreshToken,
  });
  return data;
};

// 🔥 REGISTRO (CORRIGIDO)
export const registerRequest = async (
  name: string,
  email: string,
  password: string
) => {
  const { data } = await api.post("/users/register", {
    name,
    email,
    password,
  });
  return data;
};

// FORGOT
export const forgotPasswordRequest = async (email: string) => {
  const { data } = await api.post("/auth/forgot-password", {
    email,
  });
  return data;
};

// RESET
export const resetPasswordRequest = async (
  token: string,
  password: string
) => {
  const { data } = await api.post("/auth/reset-password", {
    token,
    password,
  });
  return data;
};