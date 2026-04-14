import { useState } from "react";
import { useVerify2FA } from "../hooks/useAuth";

export default function Verify2FA() {
  const { mutate, isPending } = useVerify2FA();

  const [code, setCode] = useState("");

  const email = localStorage.getItem("auth_email");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Email não encontrado. Faça login novamente.");
      window.location.href = "/";
      return;
    }

    if (!code) {
      alert("Digite o código");
      return;
    }

    mutate({ email, code });
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

        <button type="submit" disabled={isPending}>
          {isPending ? "Verificando..." : "Verificar"}
        </button>
      </form>
    </div>
  );
}