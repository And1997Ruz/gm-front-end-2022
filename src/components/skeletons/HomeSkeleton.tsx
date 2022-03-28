import React from "react";
import CategoriesSkeleton from "./CategoriesSkeleton";
import ItemsSmallContainerSkeleton from "./ItemsSmallContainerSkeleton";

const HomeSkeleton: React.FC = () => {
  return (
    <div>
      <CategoriesSkeleton />
      <ItemsSmallContainerSkeleton />
    </div>
  );
};

export default HomeSkeleton;
