import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../services/auth.service";
import { useTheme } from "../hooks/useTheme";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Register() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      await registerRequest(name, email, password);

      alert("Conta criada com sucesso!");
      navigate("/");
    } catch {
      alert("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={{ ...card, background: theme.colors.card }}>
        <h1 style={title}>Criar conta</h1>
        <p style={subtitle}>Comece agora</p>

        <div style={form}>
          <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button onClick={handleRegister} loading={loading} fullWidth>
            Criar conta
          </Button>
        </div>

        <span style={link} onClick={() => navigate("/")}>
          Já tem conta? Entrar
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