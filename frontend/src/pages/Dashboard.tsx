import { useState, useMemo } from "react";
import { useUsers } from "../hooks/useUsers";
import { useUserStats } from "../hooks/useUserStats";
import { deleteUser } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useDebounce } from "../hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "../hooks/useMe";

import toast from "react-hot-toast";

import Card from "../components/Card";
import UserCharts from "../components/UserCharts";
import EditUserModal from "../components/EditUserModal";
import CreateUserModal from "../components/CreateUserModal";
import Pagination from "../components/Pagination";

import SkeletonCards from "../components/SkeletonCards";
import SkeletonTable from "../components/SkeletonTable";
import SkeletonChart from "../components/SkeletonChart";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [sortField, setSortField] = useState<"name" | "email" | "role">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const debouncedSearch = useDebounce(search, 500);

  const { can, user } = useAuth();
  const { theme } = useTheme();
  const { data: me } = useMe();

  const { data, isLoading } = useUsers(page, debouncedSearch);
  const { data: statsData, isLoading: statsLoading } = useUserStats();

  const users = Array.isArray(data?.users) ? data.users : [];
  const total = data?.total || 0;
  const totalPages = data?.lastPage || 1;

  const canCreateUser = user?.role === "ADMIN";

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aVal = a[sortField]?.toString().toLowerCase();
      const bVal = b[sortField]?.toString().toLowerCase();

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, sortField, sortOrder]);

  const totalAdmins = users.filter((u: any) => u.role === "ADMIN").length;

  const growth = statsData?.growth || [];
  const roles = statsData?.roles || { ADMIN: 0, USER: 0 };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    const queryKey = ["users", page, debouncedSearch];
    const previous = queryClient.getQueryData(queryKey);

    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old?.users) return old;

      return {
        ...old,
        users: old.users.filter((u: any) => u.id !== id),
      };
    });

    await toast
      .promise(deleteUser(id), {
        loading: "Deletando...",
        success: "Usuário removido",
        error: "Erro ao deletar",
      })
      .catch(() => {
        queryClient.setQueryData(queryKey, previous);
      });
  };

  const handleSort = (field: "name" | "email" | "role") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <div style={headerBox(theme)}>
        <div>
          <h1 style={title(theme)}>Dashboard</h1>
          <p style={subtitle(theme)}>
            Bem-vindo, {me?.data?.name || "Usuário"} 👋
          </p>
        </div>

        <div style={actions}>
          {canCreateUser && (
            <button style={primaryBtn} onClick={() => setCreateOpen(true)}>
              + Novo usuário
            </button>
          )}

          <button
            style={secondaryBtn}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["users"] })
            }
          >
            Atualizar
          </button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonCards />
      ) : (
        <div style={cardsGrid}>
          <Card title="Usuários" value={total} />
          <Card title="Ativos" value={users.length} />
          <Card title="Admins" value={totalAdmins} />
        </div>
      )}

      {statsLoading ? (
        <div style={{ display: "flex", gap: 20 }}>
          <SkeletonChart />
          <SkeletonChart />
        </div>
      ) : (
        <UserCharts growth={growth} roles={roles} />
      )}

      <div style={{ marginTop: 30 }}>
        <input
          placeholder="Buscar usuário..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={input(theme)}
        />
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div style={tableWrapper(theme)}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th(theme)} onClick={() => handleSort("name")}>
                    Nome
                  </th>
                  <th style={th(theme)} onClick={() => handleSort("email")}>
                    Email
                  </th>
                  <th style={th(theme)} onClick={() => handleSort("role")}>
                    Role
                  </th>
                  <th style={th(theme)}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {sortedUsers.map((u: any) => (
                  <tr key={u.id} style={row(theme)}>
                    <td style={td(theme)}>{u.name}</td>
                    <td style={td(theme)}>{u.email}</td>
                    <td style={td(theme)}>{u.role}</td>
                    <td style={td(theme)}>
                      {can("user.update") && (
                        <button
                          onClick={() => setSelectedUser(u)}
                          style={editBtn}
                        >
                          Editar
                        </button>
                      )}

                      {can("user.delete") && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          style={deleteBtn}
                        >
                          Excluir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}

      {selectedUser && can("user.update") && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["users"] })
          }
        />
      )}

      {createOpen && canCreateUser && (
        <CreateUserModal
          onClose={() => setCreateOpen(false)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["users"] })
          }
        />
      )}
    </>
  );
}

/* estilos iguais */

const headerBox = (theme: any) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
});

const title = (theme: any) => ({
  margin: 0,
  color: theme.colors.text,
});

const subtitle = (theme: any) => ({
  color: theme.colors.subtext,
});

const actions = {
  display: "flex",
  gap: 10,
};

const primaryBtn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const secondaryBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 20,
};

const input = (theme: any) => ({
  padding: 10,
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.card,
  color: theme.colors.text,
});

const tableWrapper = (theme: any) => ({
  marginTop: 20,
  background: theme.colors.card,
  borderRadius: 10,
  overflow: "hidden",
});

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = (theme: any) => ({
  padding: 12,
  cursor: "pointer",
  color: theme.colors.subtext,
});

const td = (theme: any) => ({
  padding: 12,
  color: theme.colors.text,
});

const row = (theme: any) => ({
  borderTop: `1px solid ${theme.colors.border}`,
});

const editBtn = {
  marginRight: 6,
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};