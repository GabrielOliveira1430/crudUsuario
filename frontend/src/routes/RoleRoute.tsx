import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  roles: string[];
};

export default function RoleRoute({ roles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  // ❌ não logado
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ sem permissão
  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ autorizado
  return <Outlet />;
}