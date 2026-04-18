import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔁 RESPONSE INTERCEPTOR (REFRESH TOKEN)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 evita loop infinito
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await axios.post(
          "http://localhost:3000/api/v1/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = response.data.data.accessToken;

        // salva novo token
        localStorage.setItem("accessToken", newAccessToken);

        // atualiza header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // refaz request original
        return api(originalRequest);
      } catch (err) {
        // 🚨 logout forçado
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;