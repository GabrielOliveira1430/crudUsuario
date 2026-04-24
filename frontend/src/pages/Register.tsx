import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../services/auth.service";

export default function Register() {
  const navigate = useNavigate();

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
    <div style={{ padding: 20 }}>
      <h1>Criar Conta</h1>

      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

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

      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Criando..." : "Criar conta"}
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