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

// REGISTER
export const registerRequest = async (
  name: string,
  email: string,
  password: string
) => {
  const { data } = await api.post("/users", {
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
  newPassword: string
) => {
  const { data } = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return data;
};

// PERMISSIONS
export const getPermissions = async () => {
  try {
    const { data } = await api.get("/auth/permissions");
    return data;
  } catch {
    return [];
  }
};