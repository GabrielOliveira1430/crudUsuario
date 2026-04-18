import { useState, useEffect } from "react";
import { lightTheme, darkTheme } from "../styles/theme";

export function useTheme() {
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  const theme = mode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem("theme", mode);

    // 🔥 APLICA CLASSE NO BODY (ESSENCIAL)
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, mode, toggleTheme };
}