import { useState } from "react";
import { useVerify2FA } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Verify2FA() {
  const { mutate, isPending } = useVerify2FA();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const email = localStorage.getItem("auth_email");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/");
      return;
    }

    if (!code.trim()) {
      alert("Digite o código");
      return;
    }

    mutate(
      { email, code },
      {
        onError: () => {
          alert("Código inválido");
        },
      }
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Verificar código</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Código de verificação"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <br /><br />

        <button type="submit" disabled={isPending}>
          {isPending ? "Verificando..." : "Verificar"}
        </button>
      </form>
    </div>
  );
}