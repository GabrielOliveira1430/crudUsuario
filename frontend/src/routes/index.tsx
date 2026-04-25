import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Verify2FA from "../pages/Verify2FA";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";

import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/verify-2fa" element={<Verify2FA />} />

      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* usuário logado */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* admin */}
      <Route element={<RoleRoute roles={["ADMIN"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}