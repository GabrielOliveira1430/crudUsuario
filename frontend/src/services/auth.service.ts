import { api } from "../api/client";

// 1️⃣ LOGIN (envia código 2FA)
export const loginRequest = async (email: string, password: string) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// 2️⃣ VERIFY 2FA (retorna tokens)
export const verify2FARequest = async (email: string, code: string) => {
  const response = await api.post("/auth/verify-2fa", {
    email,
    code,
  });

  return response.data;
};

// 3️⃣ REFRESH TOKEN (gera novo accessToken)
export const refreshTokenRequest = async (refreshToken: string) => {
  const response = await api.post("/auth/refresh", {
    refreshToken,
  });

  return response.data;
};