import { api } from "../api/client";

// 🔐 USUÁRIO LOGADO
export const getMe = async () => {
  const { data } = await api.get("/users/me");
  return data ?? null;
};

// 📊 LISTAGEM
export const getUsers = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const { data } = await api.get("/users", {
    params: { page, limit, search },
  });

  return (
    data ?? {
      users: [],
      total: 0,
      page: 1,
      lastPage: 1,
    }
  );
};

// 📈 STATS
export const getUserStats = async () => {
  const { data } = await api.get("/users/stats");

  return (
    data ?? {
      growth: [],
      roles: { ADMIN: 0, USER: 0 },
    }
  );
};

// 🆕 CREATE USER (AGORA CORRETO)
export const createUser = async (body: any) => {
  const { data } = await api.post("/users/register", body);
  return data;
};

// ✏️ UPDATE
export const updateUser = async (id: number, body: any) => {
  const { data } = await api.put(`/users/${id}`, body);
  return data;
};

// 🔁 ROLE
export const updateUserRole = async (
  id: number,
  body: { role: string }
) => {
  const { data } = await api.patch(`/users/${id}/role`, body);
  return data;
};

// 🗑 DELETE
export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

// 🚀 UPGRADE
export const upgradePlan = async () => {
  const { data } = await api.patch("/users/upgrade");
  return data;
};