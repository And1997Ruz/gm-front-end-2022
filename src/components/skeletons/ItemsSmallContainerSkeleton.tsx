import React from "react";
import ItemSmallSkeleton from "./ItemSmallSkeleton";

const ItemsSmallContainerSkeleton: React.FC = () => {
  return (
    <div>
      <div className="grid_wrapper">
        <div className="items_small_container">
          <ItemSmallSkeleton />
          <ItemSmallSkeleton />
          <ItemSmallSkeleton />
          <ItemSmallSkeleton />
          <ItemSmallSkeleton />
          <ItemSmallSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ItemsSmallContainerSkeleton;
