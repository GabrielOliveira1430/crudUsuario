import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { toggleTheme, mode, theme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const isAdmin = user?.role === "ADMIN";

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.colors.bg }}>
      
      {/* SIDEBAR */}
      <aside style={sidebar(theme)}>
        <div>
          <h2 style={logo(theme)}>🚀 SaaS</h2>

          <nav style={nav}>
            <Link
              to="/dashboard"
              style={{
                ...link(theme),
                ...(isActive("/dashboard") ? activeLink(theme) : {}),
              }}
            >
              📊 Dashboard
            </Link>

            <Link
              to="/profile"
              style={{
                ...link(theme),
                ...(isActive("/profile") ? activeLink(theme) : {}),
              }}
            >
              👤 Perfil
            </Link>

            {/* 🔐 RBAC REAL */}
            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  ...link(theme),
                  ...(isActive("/admin") ? activeLink(theme) : {}),
                }}
              >
                🔒 Admin
              </Link>
            )}
          </nav>
        </div>

        {/* USER */}
        <div style={userBox(theme)}>
          <div>
            <p style={userName(theme)}>
              {user?.name || "Usuário"}
            </p>

            <p style={userRole(theme)}>
              {user?.role === "ADMIN" ? "Administrador" : "Usuário"}
            </p>
          </div>

          <button onClick={logout} style={logoutBtn}>
            Sair
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* HEADER */}
        <header style={header(theme)}>
          <h3 style={{ margin: 0, color: theme.colors.text }}>
            Painel
          </h3>

          <button onClick={toggleTheme} style={themeBtn(theme)}>
            {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        {/* CONTENT */}
        <main style={main(theme)}>
          <div style={contentWrapper}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* estilos */

const sidebar = (theme: any): React.CSSProperties => ({
  width: 260,
  background: theme.colors.card,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRight: `1px solid ${theme.colors.border}`,
});

const logo = (theme: any): React.CSSProperties => ({
  marginBottom: 30,
  color: theme.colors.text,
});

const nav: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const link = (theme: any): React.CSSProperties => ({
  padding: "12px 14px",
  borderRadius: 10,
  color: theme.colors.subtext,
  textDecoration: "none",
  fontWeight: 500,
});

const activeLink = (theme: any): React.CSSProperties => ({
  background: theme.colors.primary,
  color: "#fff",
});

const userBox = (theme: any): React.CSSProperties => ({
  borderTop: `1px solid ${theme.colors.border}`,
  paddingTop: 15,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const userName = (theme: any): React.CSSProperties => ({
  margin: 0,
  fontWeight: 600,
  color: theme.colors.text,
});

const userRole = (theme: any): React.CSSProperties => ({
  margin: 0,
  fontSize: 12,
  color: theme.colors.subtext,
});

const logoutBtn: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 12px",
  cursor: "pointer",
};

const header = (theme: any): React.CSSProperties => ({
  height: 60,
  borderBottom: `1px solid ${theme.colors.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  background: theme.colors.card,
  color: theme.colors.text, // 🔥 ajuste aplicado
});

const main = (theme: any): React.CSSProperties => ({
  flex: 1,
  background: theme.colors.bg,
  overflowY: "auto",
});

const contentWrapper: React.CSSProperties = {
  padding: 30,
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
};

const themeBtn = (theme: any): React.CSSProperties => ({
  padding: "6px 12px",
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.card,
  color: theme.colors.text,
  cursor: "pointer",
});