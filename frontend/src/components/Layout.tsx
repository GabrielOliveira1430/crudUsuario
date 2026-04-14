import { useAuth } from "../context/AuthContext";

export default function Layout({ children }: any) {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 🧭 SIDEBAR */}
      <aside
        style={{
          width: 220,
          background: "#111",
          color: "#fff",
          padding: 20,
        }}
      >
        <h2>Sistema</h2>

        <p style={{ marginTop: 20 }}>Olá, {user?.name}</p>

        <hr />

        <button onClick={logout}>Sair</button>
      </aside>

      {/* 📄 CONTEÚDO */}
      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}