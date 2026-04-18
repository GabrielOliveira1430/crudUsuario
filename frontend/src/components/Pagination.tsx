import { useTheme } from "../hooks/useTheme";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {
  const { theme } = useTheme();

  if (totalPages <= 1) return null;

  return (
    <div style={container}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        style={btn(theme, page === 1)}
      >
        ←
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={pageBtn(theme, p === page)}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        style={btn(theme, page === totalPages)}
      >
        →
      </button>
    </div>
  );
}

const container: React.CSSProperties = {
  display: "flex",
  gap: 6,
  marginTop: 20,
  flexWrap: "wrap",
};

const btn = (theme: any, disabled: boolean): React.CSSProperties => ({
  padding: "6px 10px",
  borderRadius: 6,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.card,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
});

const pageBtn = (theme: any, active: boolean): React.CSSProperties => ({
  padding: "6px 10px",
  borderRadius: 6,
  border: `1px solid ${theme.colors.border}`,
  background: active ? theme.colors.primary : theme.colors.card,
  color: active ? "#fff" : theme.colors.text,
  cursor: "pointer",
});