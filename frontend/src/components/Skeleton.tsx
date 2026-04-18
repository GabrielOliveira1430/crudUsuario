import { useTheme } from "../hooks/useTheme";

type Props = {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

export default function Skeleton({
  width = "100%",
  height = 16,
  style = {},
}: Props) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 6,
        background: theme.colors.border,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* shimmer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-100%",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          animation: "shimmer 1.5s infinite",
        }}
      />

      <style>
        {`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </div>
  );
}