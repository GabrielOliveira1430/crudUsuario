import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getMe } from "../services/userService";
import type { User } from "../types/auth.types";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext({} as AuthContextType);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 NORMALIZADOR (AGORA COM PERMISSIONS)
  const normalizeUser = (res: any): User | null => {
    if (!res) return null;

    let userData = null;

    if (res?.role) userData = res;
    else if (res?.data?.role) userData = res.data;

    if (!userData) return null;

    return {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      permissions: userData.permissions || [], // 🔥 aqui entra RBAC real
    };
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();
        const userData = normalizeUser(response);

        console.log("USER NORMALIZED:", userData);

        setUser(userData);
      } catch (error) {
        console.error("Erro ao validar token", error);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    try {
      const response = await getMe();
      const userData = normalizeUser(response);

      setUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário após login", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);

    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);