import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { updateUser } from "../services/userService";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

type Props = {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUserModal({ user, onClose, onSuccess }: Props) {
  const { theme } = useTheme();

  const [name, setName] = useState(user?.name || "");

  const handleSave = async () => {
    await toast.promise(
      updateUser(user.id, { name }),
      {
        loading: "Salvando...",
        success: "Usuário atualizado!",
        error: "Erro ao atualizar",
      }
    );

    onSuccess();
    onClose();
  };

  return (
    <div style={overlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ ...modal, background: theme.colors.card }}
      >
        <h2 style={{ color: theme.colors.text }}>Editar Usuário</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input(theme)}
        />

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