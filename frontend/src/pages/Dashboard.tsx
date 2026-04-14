import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useUsers(page, search);

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const totalPages = total > 0 ? Math.ceil(total / 10) : 1;

  // 🔒 USER NORMAL → só vê perfil
  if (user?.role !== "ADMIN") {
    return (
      <Layout>
        <div style={{ padding: 20 }}>
          <h1>Meu Perfil</h1>

          <p><strong>Nome:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>

          <button onClick={logout}>Sair</button>
        </div>
      </Layout>
    );
  }

  // 🔥 ADMIN → vê tabela completa
  return (
    <Layout>
      <div style={{ padding: 20 }}>
        <h1>Dashboard (Admin)</h1>

        <p>Bem-vindo, {user?.name}</p>
        <p><strong>Role:</strong> {user?.role}</p>

        <button onClick={logout}>Sair</button>

        <hr />

        {/* 🔍 BUSCA */}
        <input
          placeholder="Buscar usuário..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ marginBottom: 10 }}
        />

        {/* 📊 CONTEÚDO */}
        {isLoading ? (
          <p>Carregando...</p>
        ) : users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table border={1} cellPadding={10} style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u: any) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 📄 PAGINAÇÃO */}
        <div style={{ marginTop: 10 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Voltar
          </button>

          <span style={{ margin: "0 10px" }}>
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages || users.length === 0}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </button>
        </div>
      </div>
    </Layout>
  );
}