// src/hooks/useUserStats.ts

import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "../services/userService";

export const useUserStats = () => {
  return useQuery({
    queryKey: ["user-stats"],

    queryFn: async () => {
      const res = await getUserStats();

      const growth = Array.isArray(res?.data?.growth)
        ? res.data.growth
        : Array.isArray(res?.growth)
        ? res.growth
        : [];

      const roles = {
        ADMIN:
          Number(res?.data?.roles?.ADMIN) ||
          Number(res?.roles?.ADMIN) ||
          0,

        USER:
          Number(res?.data?.roles?.USER) ||
          Number(res?.roles?.USER) ||
          0,
      };

      return {
        growth,
        roles,
      };
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};