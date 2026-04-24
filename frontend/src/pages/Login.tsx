import { useState } from "react";
import { useLogin } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  onSuccess?: (email: string) => void;
};

export default function Login({ onSuccess }: LoginProps) {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert("Preencha email e senha");
      return;
    }

    mutate(
      { email, password },
      {
        onSuccess: () => {
          localStorage.setItem("auth_email", email);
          onSuccess?.(email);
          navigate("/verify-2fa");
        },
        onError: () => {
          alert("Credenciais inválidas");
        },
      }
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin} disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>

      <br /><br />

      {/* 🔗 NOVOS LINKS */}
      <p>
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/forgot-password")}
        >
          Esqueceu a senha?
        </span>
      </p>

      <p>
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/register")}
        >
          Criar conta
        </span>
      </p>
    </div>
  );
}