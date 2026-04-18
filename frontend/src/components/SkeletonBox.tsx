import "../styles/skeleton.css";

type Props = {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
};

export default function SkeletonBox({
  width = "100%",
  height = 20,
  style,
}: Props) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: 8,
        ...style,
      }}
    />
  );
}