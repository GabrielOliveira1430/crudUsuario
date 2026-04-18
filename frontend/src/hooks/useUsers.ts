import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/userService";

export const useUsers = (page: number, search: string) => {
  return useQuery({
    queryKey: ["users", page, search],

    queryFn: async () => {
      const res = await getUsers({
        page: page || 1,
        limit: 10,
        search: search || "",
      });

      let users: any[] = [];
      let total = 0;
      let lastPage = 1;

      // 🧠 FORMATO 1 → array direto
      if (Array.isArray(res)) {
        users = res;
        total = res.length;
      }

      // 🧠 FORMATO 2 → { users, total }
      else if (Array.isArray(res?.users)) {
        users = res.users;
        total = res.total || users.length;
        lastPage = res.lastPage || 1;
      }

      // 🧠 FORMATO 3 → { data: [] }
      else if (Array.isArray(res?.data)) {
        users = res.data;
        total = res?.meta?.total || users.length;
        lastPage = res?.meta?.lastPage || 1;
      }

      // 🧠 FORMATO 4 → { data: { users: [] } }
      else if (Array.isArray(res?.data?.users)) {
        users = res.data.users;
        total = res.data.total || users.length;
        lastPage = res.data.lastPage || 1;
      }

      else {
        console.warn("Formato inesperado:", res);
      }

      return { users, total, lastPage };
    },

    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};