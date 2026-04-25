import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/userService";
import { getAccessToken } from "../store/auth.store";

// 🔥 versão SaaS-safe (não briga com AuthContext)
export const useMe = () => {
  const token = getAccessToken();

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 🔥 evita refetch excessivo
    refetchOnWindowFocus: false,
  });
};