import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordRequest } from "../services/auth.service";
import { useTheme } from "../hooks/useTheme";
import Button from "../components/Button";
import Input from "../components/Input";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert("Digite seu email");
      return;
    }

    try {
      setLoading(true);
      await forgotPasswordRequest(email);

      alert("Se o email existir, enviaremos instruções.");
      navigate("/");
    } catch {
      alert("Erro ao solicitar recuperação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={{ ...card, background: theme.colors.card }}>
        <h1 style={title}>Recuperar senha</h1>
        <p style={subtitle}>Enviaremos um link para seu email</p>

        <div style={form}>
          <Input
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button onClick={handleSubmit} loading={loading} fullWidth>
            Enviar
          </Button>
        </div>

        <span style={link} onClick={() => navigate("/")}>
          Voltar para login
        </span>
      </div>
    </div>
  );
}

// estilos (mesmos do Register)
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