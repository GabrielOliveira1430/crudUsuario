import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./hooks/useTheme";
import { BrowserRouter } from "react-router-dom"; // 🔥 IMPORTANTE

// 🔥 CONFIG REACT QUERY
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 🔥 TOASTER DINÂMICO
function ThemedToaster() {
  const { mode } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "10px",
          fontSize: "14px",
          background: mode === "dark" ? "#111827" : "#ffffff",
          color: mode === "dark" ? "#f9fafb" : "#111827",
          border: "1px solid rgba(0,0,0,0.1)",
        },
        success: {
          style: {
            background: "#16a34a",
            color: "#fff",
          },
        },
        error: {
          style: {
            background: "#dc2626",
            color: "#fff",
          },
        },
      }}
    />
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter> {/* 🔥 AQUI ESTÁ A CORREÇÃO */}
          <App />
          <ThemedToaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);