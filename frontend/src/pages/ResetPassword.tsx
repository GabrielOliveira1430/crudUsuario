import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordRequest } from "../services/auth.service";
import { useTheme } from "../hooks/useTheme";
import Button from "../components/Button";
import Input from "../components/Input";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      alert("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    if (!token) {
      alert("Token inválido");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordRequest(token, password);

      alert("Senha redefinida com sucesso!");
      navigate("/");
    } catch {
      alert("Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={{ ...card, background: theme.colors.card }}>
        <h1 style={title}>Nova senha</h1>
        <p style={subtitle}>Digite sua nova senha</p>

        <div style={form}>
          <Input
            placeholder="Nova senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            placeholder="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button onClick={handleReset} loading={loading} fullWidth>
            Redefinir senha
          </Button>
        </div>

        <span style={link} onClick={() => navigate("/")}>
          Voltar para login
        </span>
      </div>
    </div>
  );
}

// estilos
const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const card: React.CSSProperties = {
  width: 350,
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const title = { textAlign: "center" } as React.CSSProperties;

const subtitle: React.CSSProperties = {
  textAlign: "center",
  fontSize: 14,
  opacity: 0.7,
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const link: React.CSSProperties = {
  textAlign: "center",
  cursor: "pointer",
  color: "#6366f1",
};