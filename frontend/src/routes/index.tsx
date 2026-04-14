import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Verify2FA from "../pages/Verify2FA";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import { useState } from "react";

export const AppRoutes = () => {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 LOGIN */}
        <Route path="/" element={<Login onSuccess={setEmail} />} />

        {/* 🔢 2FA */}
        <Route
          path="/verify-2fa"
          element={<Verify2FA email={email} />}
        />

        {/* 🛡️ ROTA PROTEGIDA */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};