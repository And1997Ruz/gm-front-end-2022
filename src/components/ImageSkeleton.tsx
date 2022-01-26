import React from "react";

const ImageSkeleton = () => {
  return (
    <div
      style={{
        width: "100px",
        borderRadius: "50%",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <img
        src="/loading_placeholder.png"
        alt=""
        style={{ width: 60, height: 60 }}
      />
    </div>
  );
};

export default ImageSkeleton;
