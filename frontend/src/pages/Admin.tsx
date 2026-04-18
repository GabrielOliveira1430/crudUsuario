import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { updateUser, deleteUser } from "../services/userService";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";

import Card from "../components/Card";
import Pagination from "../components/Pagination";
import SkeletonTable from "../components/SkeletonTable";
import EditUserModal from "../components/EditUserModal";

export default function Admin() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data, isLoading } = useUsers(page, "");

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = data?.lastPage || 1;

  const totalAdmins = users.filter((u: any) => u.role === "ADMIN").length;

  // 🔥 UPDATE ROLE
  const handleRoleChange = async (id: number, role: string) => {
    await toast.promise(updateUser(id, { role }), {
      loading: "Atualizando...",
      success: "Role atualizada",
      error: "Erro ao atualizar",
    });

    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  // 🔥 DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza?")) return;

    await toast.promise(deleteUser(id), {
      loading: "Deletando...",
      success: "Usuário removido",
      error: "Erro ao deletar",
    });

    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <>
      <h1 style={title(theme)}>Painel Admin</h1>

      {/* 🔥 CARDS */}
      <div style={cardsGrid}>
        <Card title="Total Usuários" value={total} />
        <Card title="Admins" value={totalAdmins} />
        <Card title="Usuários Comuns" value={total - totalAdmins} />
      </div>

      {/* 🔥 TABELA */}
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div style={tableWrapper(theme)}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th(theme)}>Nome</th>
                  <th style={th(theme)}>Email</th>
                  <th style={th(theme)}>Role</th>
                  <th style={th(theme)}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u: any) => {
                  const isMe = user?.email === u.email;

                  return (
                    <tr key={u.id}>
                      <td style={td(theme)}>{u.name}</td>
                      <td style={td(theme)}>{u.email}</td>

                      {/* 🔥 BADGE */}
                      <td style={td(theme)}>
                        <span
                          style={{
                            ...badge,
                            background:
                              u.role === "ADMIN" ? "#ef4444" : "#3b82f6",
                            color: "#fff",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* 🔥 AÇÕES */}
                      <td style={td(theme)}>
                        <button
                          onClick={() => setSelectedUser(u)}
                          style={editBtn}
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleRoleChange(
                              u.id,
                              u.role === "ADMIN" ? "USER" : "ADMIN"
                            )
                          }
                          style={roleBtn}
                          disabled={isMe}
                        >
                          Alternar Role
                        </button>

                        <button
                          onClick={() => handleDelete(u.id)}
                          style={deleteBtn}
                          disabled={isMe}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

      {/* 🔥 MODAL */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["users"] })
          }
        />
      )}
    </>
  );
}

/* 🎨 ESTILOS */

const title = (theme: any) => ({
  marginBottom: 20,
  color: theme.colors.text,
});

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 20,
  marginBottom: 20,
};

const tableWrapper = (theme: any) => ({
  background: theme.colors.card,
  borderRadius: 14,
  overflow: "hidden",
  border: `1px solid ${theme.colors.border}`,
});

const table = { width: "100%" };

const th = (theme: any) => ({
  padding: 14,
  textAlign: "left" as const,
  color: theme.colors.subtext,
});

const td = (theme: any) => ({
  padding: 14,
  color: theme.colors.text,
});

const badge = {
  padding: "4px 10px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
};

const editBtn = {
  marginRight: 6,
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

const roleBtn = {
  marginRight: 6,
  background: "#f59e0b",
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