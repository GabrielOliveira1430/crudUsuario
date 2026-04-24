import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordRequest } from "../services/auth.service";

export default function ForgotPassword() {
  const navigate = useNavigate();

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
    <div style={{ padding: 20 }}>
      <h1>Recuperar Senha</h1>

      <input
        placeholder="Seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
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