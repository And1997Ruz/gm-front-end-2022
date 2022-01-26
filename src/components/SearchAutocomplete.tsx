import React, { useEffect } from "react";
import { Item } from "../types";

interface Props {
  data: Item[];
  searchQuery: string;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: (query: string) => void;
}

const SearchAutocomplete: React.FC<Props> = ({
  data,
  searchQuery,
  onChange,
  onClick,
}) => {
  const itemNames = data.map((item: Item) => item.name);

  const filteredItems = itemNames.filter((name: string) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    filteredItems.length > 0 ? onChange(true) : onChange(false);
  }, [filteredItems, onChange]);

  const sorted = filteredItems.sort((a: string, b: string) => {
    if (a.toLowerCase().startsWith(searchQuery.toLowerCase())) {
      return -1;
    }
    if (!a.toLowerCase().startsWith(searchQuery.toLowerCase())) {
      return +1;
    }
    return 0;
  });

  const removeDuplicates = (data: string[]) => {
    const unique: string[] = [];
    data.forEach((item: string) => {
      if (!unique.includes(item.toLowerCase())) {
        unique.push(item.toLowerCase());
      }
    });
    return unique;
  };

  const finalArray: string[] = [];

  const getFinalArray = () => {
    const unique = removeDuplicates(sorted);
    unique.forEach((item: string) => {
      const words = item.split(" ");
      for (let i = 0; i < words.length; i++) {
        if (!words[i][0]) return;
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }

      finalArray.push(words.join(" "));
    });
  };
  getFinalArray();
  return (
    <div
      className="search_autocomplete_container"
      style={{
        boxShadow:
          filteredItems.length > 0 ? "0 0 3px 2px rgb(194, 194, 194)" : "",
      }}
    >
      {filteredItems.length > 0 ? (
        <div>
          {finalArray.map((item: string, idx: number) => (
            <div
              key={idx}
              className="search_autocomplete_item_container"
              onClick={() => onClick(item)}
            >
              <p className="search_autocomplete_item">{item}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SearchAutocomplete;
