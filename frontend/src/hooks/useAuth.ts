import { useMutation } from "@tanstack/react-query";
import { loginRequest, verify2FARequest } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 🔐 LOGIN (envia código 2FA)
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: any) =>
      loginRequest(email, password),
  });
};

// 🔢 VERIFY 2FA (LOGIN REAL)
export const useVerify2FA = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: ({ email, code }: any) =>
      verify2FARequest(email, code),

    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;

      // 🔥 salva tokens no contexto/global
      login(accessToken, refreshToken);

      // 🔥 limpa email temporário
      localStorage.removeItem("auth_email");

      // 🔥 redireciona
      navigate("/dashboard");
    },
  });
};