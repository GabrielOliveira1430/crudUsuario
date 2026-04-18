import axios from "axios";
import { refreshTokenRequest } from "../services/auth.service";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

// 🔐 REQUEST → adiciona token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔁 CONTROLE GLOBAL
let isRefreshing = false;
let failedQueue: any[] = [];

// processa fila
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

// 🔁 RESPONSE → refresh automático
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) throw new Error("Sem refresh token");

      const data = await refreshTokenRequest(refreshToken);

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);