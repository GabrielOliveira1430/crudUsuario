import { useState, useEffect } from "react";
import { useVerify2FA } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import CodeInput from "../components/CodeInput";
import toast from "react-hot-toast";

export default function Verify2FA() {
  const { mutate, isPending } = useVerify2FA();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { login } = useAuth();

  const [code, setCode] = useState("");

  const email = localStorage.getItem("auth_email");

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Sessão expirada");
      navigate("/");
      return;
    }

    if (code.length < 6) {
      toast.error("Código incompleto");
      return;
    }

    mutate(
      { email, code },
      {
        onSuccess: async (data: any) => {
          try {
            // 🔥 IMPORTANTE: backend precisa retornar tokens aqui
            const { accessToken, refreshToken } = data?.data || {};

            if (!accessToken || !refreshToken) {
              toast.error("Erro ao autenticar");
              navigate("/");
              return;
            }

            await login(accessToken, refreshToken);

            localStorage.removeItem("auth_email");

            toast.success("Login realizado com sucesso");

            navigate("/dashboard");
          } catch (err) {
            toast.error("Erro ao finalizar login");
            navigate("/");
          }
        },

        onError: () => {
          toast.error("Código inválido");
        },
      }
    );
  };

  return (
    <div style={container}>
      <div style={{ ...card, background: theme.colors.card }}>
        <div style={header}>
          <h1 style={title}>Verificação</h1>
          <p style={subtitle}>Digite o código enviado para seu email</p>
        </div>

        <form style={form} onSubmit={handleSubmit}>
          <CodeInput value={code} onChange={setCode} />

          <Button loading={isPending} fullWidth>
            Verificar
          </Button>
        </form>

        <span style={back} onClick={() => navigate("/")}>
          Voltar para login
        </span>
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #6366f10f, transparent)",
};

const card: React.CSSProperties = {
  width: 360,
  padding: 32,
  borderRadius: 14,
  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

const header: React.CSSProperties = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const title: React.CSSProperties = {
  fontSize: 22,
};

const subtitle: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 18,
  alignItems: "center",
};

const back: React.CSSProperties = {
  textAlign: "center",
  fontSize: 13,
  cursor: "pointer",
  color: "#6366f1",
};