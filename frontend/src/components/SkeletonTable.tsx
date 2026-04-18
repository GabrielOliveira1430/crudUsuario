import SkeletonBox from "./SkeletonBox";

export default function SkeletonTable() {
  return (
    <div style={{ marginTop: 20 }}>
      {[1, 2, 3, 4, 5].map((row) => (
        <div
          key={row}
          style={{
            display: "flex",
            gap: 20,
            padding: 12,
          }}
        >
          <SkeletonBox width="25%" />
          <SkeletonBox width="35%" />
          <SkeletonBox width="15%" />
          <SkeletonBox width="25%" />
        </div>
      ))}
    </div>
  );
}