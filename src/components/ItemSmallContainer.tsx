import React, { useState, useEffect } from "react";
import { Item } from "../types";
import ItemSmall from "./ItemSmall";
import Pagination from "./Pagination";

interface Props {
  items: Item[] | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageLimit: number;
}

const ItemSmallContainer: React.FC<Props> = ({
  items,
  currentPage,
  setCurrentPage,
  pageLimit,
}) => {
  const [paginatedData, setPaginatedData] = useState<Item[]>([]);
  const pageAmount = items ? Math.ceil(items.length / pageLimit) : 0;

  useEffect(() => {
    const getPaginatedData = (
      pageLimit: number,
      pageAmount: number,
      currentPage: number
    ) => {
      if (pageAmount < 2 && items) {
        return setPaginatedData(items);
      }
      if (items) {
        const startIdx = (currentPage - 1) * pageLimit;
        const endIdx = startIdx + pageLimit;
        const paginated = items.slice(startIdx, endIdx);
        return setPaginatedData(paginated);
      }
    };

    getPaginatedData(pageLimit, pageAmount, currentPage);
  }, [currentPage, items, pageAmount, pageLimit]);

  return (
    <div>
      <div className="grid_wrapper">
        <div className="items_small_container">
          {paginatedData &&
            paginatedData.map((item: Item, idx: number) => {
              return (
                <ItemSmall
                  key={item._id}
                  itemId={item._id}
                  name={item.name}
                  price={`${item.price} руб.`}
                  description={item.description}
                  pictures={item.itemPicture ? item.itemPicture : undefined}
                />
              );
            })}
        </div>
      </div>
      {pageAmount > 1 && (
        <Pagination
          currentPage={currentPage}
          pagesAmount={pageAmount}
          setCurrentPage={setCurrentPage}
          pageAmountLimit={5}
        />
      )}
    </div>
  );
};

export default ItemSmallContainer;
