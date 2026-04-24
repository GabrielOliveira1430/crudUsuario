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

// 3️⃣ REFRESH TOKEN
export const refreshTokenRequest = async (refreshToken: string) => {
  const response = await api.post("/auth/refresh", {
    refreshToken,
  });

  return response.data;
};

// 🆕 REGISTER
export const registerRequest = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post("/users", {
    name,
    email,
    password,
  });

  return response.data;
};

// 🆕 FORGOT PASSWORD
export const forgotPasswordRequest = async (email: string) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

// 🆕 RESET PASSWORD
export const resetPasswordRequest = async (
  token: string,
  newPassword: string
) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });

  return response.data;
};

// 🔐 RBAC
export const getPermissions = async () => {
  try {
    const response = await api.get("/auth/permissions");
    return response.data;
  } catch {
    return [];
  }
};