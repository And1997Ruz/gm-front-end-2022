import React from "react";

export default function ItemSmallSkeleton() {
  return (
    <div className="item_small">
      <div className="item_small_picture_container">
        <div className="item_small_picture image_skeleton" />
      </div>
      <div
        className="item_small_info"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div
          className="item_small_text_skeleton"
          style={{ width: "200px", height: "15px" }}
        ></div>
        <div
          className="item_small_text_skeleton"
          style={{ width: "100px", marginTop: "10px", height: "15px" }}
        ></div>
        <div
          className="item_small_text_skeleton"
          style={{ width: "100%", marginTop: "30px" }}
        ></div>
        <div
          className="item_small_text_skeleton"
          style={{ width: "100%", marginTop: "5px" }}
        ></div>
        <div
          className="item_small_text_skeleton"
          style={{ width: "80%", marginTop: "5px" }}
        ></div>
      </div>
    </div>
  );
}
