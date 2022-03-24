import React from "react";

const CategoriesSkeleton: React.FC = () => {
  return (
    <div className="category_container">
      <h2 className="category_header">Фильтр по категориям</h2>
      <div className="category_icon_row_wrapper">
        <div
          className="category_icon_row"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "100vw",
          }}
        >
          <div
            className="category_row_skeleton"
            style={{
              minWidth: "55px",
              height: "55px",
              borderRadius: "50%",
              marginLeft: "10px",
            }}
          ></div>
          <div
            className="category_row_skeleton"
            style={{
              width: "70%",
              borderRadius: "100px",
              margin: "0 30px",
            }}
          ></div>
          <div
            className="category_row_skeleton"
            style={{
              minWidth: "55px",
              height: "55px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSkeleton;
