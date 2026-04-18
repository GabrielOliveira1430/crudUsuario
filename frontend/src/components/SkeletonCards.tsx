import SkeletonBox from "./SkeletonBox";
import { useTheme } from "../hooks/useTheme";

export default function SkeletonCards() {
  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            padding: 20,
            borderRadius: theme.radius,
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.card,
          }}
        >
          <SkeletonBox width="40%" height={14} />
          <SkeletonBox width="60%" height={24} style={{ marginTop: 10 }} />
        </div>
      ))}
    </div>
  );
}