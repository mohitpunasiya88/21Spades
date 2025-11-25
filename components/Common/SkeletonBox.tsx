import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}

const SkeletonBox: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 50,
  radius = 10,
}) => {
  return (
    <div
      className="relative overflow-hidden bg-gray-700/40"
      style={{
        width,
        height,
        borderRadius: typeof radius === "number" ? `${radius}px` : radius,
      }}
    >
      <div className="absolute inset-0 -translate-x-full shimmer-animation" />
    </div>
  );
};

export default SkeletonBox;
