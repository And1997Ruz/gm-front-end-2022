import React, { useState } from "react";
import { useSelector } from "react-redux";
import NavBar from "./NavBar";
import ItemSmallContainer from "./ItemSmallContainer";
import SearchBar from "./SearchBar";
import Categories from "./Categories";
import NothingFound from "./NothingFound";
import { RootState } from "../store";
import { Item } from "../types";

export default function HomePage() {
  const items = useSelector((state: RootState) => state.items);
  const filtered = useSelector((state: RootState) => state.filteredItems);
  const searchQuery = useSelector((state: RootState) => state.searchQuery);
  const currentCategory = useSelector(
    (state: RootState) => state.currentCategory
  );

  const [currentPage, setCurrentPage] = useState<number>(1);

  const filterItems = (items: Item[], searchQuery: string) => {
    if (currentCategory && filtered) {
      return filtered;
    }
    if (searchQuery && filtered) {
      return filtered;
    }
    if (searchQuery && !filtered) {
      return [];
    } else {
      return items;
    }
  };
  return (
    <div className="home_page">
      <NavBar />
      <SearchBar />
      {filterItems(items, searchQuery).length === 0 ? (
        <NothingFound hidden={searchQuery ? false : true} />
      ) : (
        <>
          <Categories hidden={!!searchQuery} setCurrentPage={setCurrentPage} />
          <ItemSmallContainer
            pageLimit={21}
            items={filterItems(items, searchQuery)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
