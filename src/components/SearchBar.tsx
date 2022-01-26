import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCurrentCategory } from "../store/reducers/currentCategory";
import { addFilter, removeFilter } from "../store/reducers/filteredItems";
import { setSearchQuery } from "../store/reducers/searchQuery";
import SearchAutocomplete from "./SearchAutocomplete";
import { Item } from "../types";

const SearchBar: React.FC = () => {
  const items = useSelector((state: RootState) => state.items);
  const searchQuery = useSelector((state: RootState) => state.searchQuery);
  const dispatch = useDispatch();

  const [inputSearchValue, setInputSearchValue] = useState("");
  const [hasAutocompleteData, setAutocompleteData] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchValue(e.target.value);
  };

  const handleSearch = (value?: string) => {
    const filtered: Item[] = [];
    const target = value ? value : inputSearchValue;
    if (target) {
      items.forEach((item: Item) => {
        if (item.name.toLowerCase().includes(target.toLowerCase()))
          filtered.push(item);
      });
      dispatch(addFilter(filtered));
      dispatch(setSearchQuery(target));
      setInputSearchValue("");
    }
  };

  const handleSearchReset = () => {
    dispatch(removeFilter());
    dispatch(setSearchQuery(""));
    dispatch(setCurrentCategory(null));
    setInputSearchValue("");
  };

  const handleAutocompleteClick = (query: string) => {
    const input = document.getElementById("search_input");
    if (input) input.focus();
    setInputSearchValue(query);
    handleSearch(query);
  };

  return (
    <div
      className="search_bar_parent"
      style={{
        borderRadius: inputSearchValue && hasAutocompleteData ? "0px" : "15px",
      }}
    >
      <form
        autoComplete="off"
        className="search_bar_container"
        onSubmit={(e) => e.preventDefault()}
      >
        <img src="search_icon.svg" alt="search_icon" className="search_icon" />
        <input
          type="text"
          id="search_input"
          className="search_bar_input"
          placeholder="Поиск по объявлениям"
          value={inputSearchValue}
          onChange={handleChange}
        />
        {searchQuery && (
          <img
            src="cross.svg"
            alt="search_icon"
            className="cross_icon"
            onClick={handleSearchReset}
          />
        )}
        <button
          type="submit"
          onClick={() => handleSearch()}
          className="search_btn"
          style={{
            borderRadius:
              inputSearchValue && hasAutocompleteData
                ? "0px"
                : "0px 12px 12px 0px",
          }}
        >
          <p className="search_btn_text">Поиск</p>
        </button>
      </form>
      {inputSearchValue && (
        <SearchAutocomplete
          data={items}
          searchQuery={inputSearchValue}
          onChange={setAutocompleteData}
          onClick={handleAutocompleteClick}
        />
      )}
    </div>
  );
};

export default SearchBar;
