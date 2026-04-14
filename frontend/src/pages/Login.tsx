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
    mutate(
      { email, password },
      {
        onSuccess: () => {
          // 🔥 SALVA EMAIL (ESSENCIAL)
          localStorage.setItem("auth_email", email);

          // opcional (caso ainda use em outro lugar)
          onSuccess?.(email);

          // 🔥 REDIRECIONA
          navigate("/verify-2fa");
        },
      }
    );
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </div>
  );
}