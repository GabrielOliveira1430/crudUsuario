// src/pages/Profile.tsx

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

export default function Profile() {
  const { user } = useAuth();
  const { theme } = useTheme();

  if (!user) {
    return (
      <p style={{ color: theme.colors.text }}>
        Carregando usuário...
      </p>
    );
  }

  return (
    <div style={container(theme)}>
      <h1 style={title(theme)}>Meu Perfil</h1>

      <div style={card(theme)}>
        <p style={text(theme)}>
          <strong>Nome:</strong> {user.name}
        </p>

        <p style={text(theme)}>
          <strong>Email:</strong> {user.email}
        </p>

        <p style={text(theme)}>
          <strong>Role:</strong> {user.role}
        </p>

        {/* 🔥 NOVO CAMPO */}
        <p style={text(theme)}>
          <strong>Plano:</strong>{" "}
          {user.plan === "PRO" ? "PRO 🚀" : "FREE"}
        </p>
      </div>
    </div>
  );
}

const container = (theme: any) => ({
  padding: 20,
});

const title = (theme: any) => ({
  marginBottom: 20,
  color: theme.colors.text,
});

const card = (theme: any) => ({
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: 14,
  padding: 24,
  maxWidth: 500,
});

const text = (theme: any) => ({
  color: theme.colors.text,
  marginBottom: 12,
});