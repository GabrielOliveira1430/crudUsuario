import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  roles: string[];
};

export default function RoleRoute({ roles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        Carregando sessão...
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}