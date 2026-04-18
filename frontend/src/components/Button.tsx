import type { CSSProperties } from "react";
import { useTheme } from "../hooks/useTheme";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: Props) {
  const { theme } = useTheme();

  const style: CSSProperties = {
    padding: "10px 16px",
    borderRadius: theme.radius,
    border: "none",
    background: theme.colors.primary,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.2s ease",
  };

  return (
    <button
      style={style}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}