import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { createUser } from "../services/userService";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateUserModal({ onClose, onSuccess }: Props) {
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = async () => {
    if (!name || !email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    await toast.promise(
      createUser({ name, email, password }),
      {
        loading: "Criando...",
        success: "Usuário criado!",
        error: "Erro ao criar",
      }
    );

    onSuccess();
    onClose();
  };

  return (
    <div style={overlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ ...modal, background: theme.colors.card }}
      >
        <h2 style={{ color: theme.colors.text }}>Novo Usuário</h2>

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input(theme)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input(theme)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input(theme)}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={cancelBtn}>
            Cancelar
          </button>

          <button onClick={handleCreate} style={saveBtn}>
            Criar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* 🎨 ESTILOS */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal: React.CSSProperties = {
  padding: 24,
  borderRadius: 12,
  width: 320,
};

const input = (theme: any): React.CSSProperties => ({
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.bg,
  color: theme.colors.text,
});

const cancelBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};