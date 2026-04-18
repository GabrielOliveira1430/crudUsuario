import { useTheme } from "../hooks/useTheme";

export default function SkeletonChart() {
  const { theme } = useTheme();

  return (
    <div style={{ ...wrapper, background: theme.colors.card }}>
      <div className="skeleton" style={header} />
      <div className="skeleton" style={chart} />
    </div>
  );
}

const wrapper: React.CSSProperties = {
  flex: 1,
  padding: 20,
  borderRadius: 16,
  border: "1px solid #e5e7eb",
};

const header: React.CSSProperties = {
  width: 120,
  height: 16,
  marginBottom: 20,
};

const chart: React.CSSProperties = {
  width: "100%",
  height: 220,
  borderRadius: 10,
};