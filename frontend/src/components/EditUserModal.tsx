import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import {
  updateUser,
  updateUserRole,
} from "../services/userService";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

type Props = {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUserModal({
  user,
  onClose,
  onSuccess,
}: Props) {
  const { theme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "USER");

  const handleSave = async () => {
    try {
      // 🔹 1. Atualiza nome e email (SEM role)
      await updateUser(user.id, {
        name,
        email,
      });

      // 🔹 2. Atualiza role separado (se mudou)
      if (role !== user.role) {
        await updateUserRole(user.id, { role });
      }

      toast.success("Usuário atualizado!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erro update user:", err);

      toast.error(
        err?.response?.data?.error || "Erro ao atualizar usuário"
      );
    }
  };

  return (
    <div style={overlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ ...modal, background: theme.colors.card }}
      >
        <h2 style={{ color: theme.colors.text }}>
          Editar Usuário
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          style={input(theme)}
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={input(theme)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={input(theme)}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={cancelBtn}>
            Cancelar
          </button>

          <button onClick={handleSave} style={saveBtn}>
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= ESTILOS ================= */

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