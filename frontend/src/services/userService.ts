import api from "./api";

// 🔐 PEGAR USUÁRIO LOGADO
export const getMe = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

// 📊 LISTAGEM (já usada no dashboard)
export const getUsers = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const response = await api.get("/users", {
    params: { page, limit, search },
  });

  return response.data;
};