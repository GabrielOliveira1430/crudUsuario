import type { CSSProperties } from "react";
import { useTheme } from "../hooks/useTheme";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  loading = false,
  fullWidth = false,
  disabled = false,
}: Props) {
  const { theme } = useTheme();

  const style: CSSProperties = {
    padding: "12px 16px",
    borderRadius: theme.radius,
    border: "none",
    background: theme.colors.primary,
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.2s ease",
  };

  return (
    <button
      style={style}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "0.9";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "1";
      }}
      onClick={onClick}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}