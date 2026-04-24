import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordRequest } from "../services/auth.service";

export default function ResetPassword() {
  const navigate = useNavigate();
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
    <div style={{ padding: 20 }}>
      <h1>Nova Senha</h1>

      <input
        placeholder="Nova senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Confirmar senha"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleReset} disabled={loading}>
        {loading ? "Salvando..." : "Redefinir senha"}
      </button>

      <br /><br />

      <span
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/")}
      >
        Voltar para login
      </span>
    </div>
  );
}