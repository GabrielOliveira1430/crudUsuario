import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// 🔧 cria instância do React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 🔥 React Query GLOBAL */}
    <QueryClientProvider client={queryClient}>
      
      {/* 🔐 Auth GLOBAL */}
      <AuthProvider>

        {/* 🔔 App + Toasts */}
        <>
          <App />
          <Toaster position="top-right" reverseOrder={false} />
        </>

      </AuthProvider>

    </QueryClientProvider>
  </React.StrictMode>
);