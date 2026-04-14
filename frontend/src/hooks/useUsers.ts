import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/userService";

export const useUsers = (page: number, search: string) => {
  return useQuery({
    queryKey: ["users", page, search],
    queryFn: () => getUsers({ page, limit: 10, search }),

    // 🔥 substitui keepPreviousData
    placeholderData: (prev) => prev,
  });
};