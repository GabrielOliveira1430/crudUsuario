export type ThemeType = {
  colors: {
    bg: string;
    card: string;
    primary: string;
    text: string;
    subtext: string;
    border: string;
    success: string;
    danger: string;
  };
  radius: string;
  shadow: string;
};

export const lightTheme: ThemeType = {
  colors: {
    bg: "#f9fafb",
    card: "#ffffff",
    primary: "#4f46e5",
    text: "#111827",
    subtext: "#6b7280",
    border: "#e5e7eb",
    success: "#16a34a",
    danger: "#dc2626",
  },
  radius: "12px",
  shadow: "0 4px 20px rgba(0,0,0,0.05)",
};

export const darkTheme: ThemeType = {
  colors: {
    bg: "#0b1220",        // 🔥 mais escuro e elegante
    card: "#111827",
    primary: "#6366f1",
    text: "#f8fafc",      // 🔥 branco suave (melhor leitura)
    subtext: "#94a3b8",
    border: "#1f2937",
    success: "#22c55e",
    danger: "#ef4444",
  },
  radius: "12px",
  shadow: "0 8px 30px rgba(0,0,0,0.6)", // 🔥 sombra mais forte
};

const savedTheme = localStorage.getItem("theme");

export const theme: ThemeType =
  savedTheme === "dark" ? darkTheme : lightTheme;