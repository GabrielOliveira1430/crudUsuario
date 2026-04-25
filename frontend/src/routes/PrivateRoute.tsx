import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  roles?: string[];
};

export default function PrivateRoute({ roles }: Props) {
  const { isAuthenticated, loading, user } = useAuth();

  // 🔥 evita flicker no Railway (IMPORTANTE)
  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        Carregando sessão...
      </p>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (roles && roles.length > 0) {
    const hasPermission = roles.includes(user?.role || "");

    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}