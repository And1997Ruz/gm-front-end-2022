import React from "react";
import Carousel from "react-elastic-carousel";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCurrentCategory } from "../store/reducers/currentCategory";
import { addFilter, removeFilter } from "../store/reducers/filteredItems";
import { Category, Item } from "../types";

interface Props {
  hidden: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Categories: React.FC<Props> = ({ hidden, setCurrentPage }) => {
  const breakPoints = [
    { width: 200, itemsToShow: 2, itemsToScroll: 2 },
    { width: 400, itemsToShow: 3, itemsToScroll: 2 },
    { width: 500, itemsToShow: 4, itemsToScroll: 3 },
    { width: 600, itemsToShow: 5, itemsToScroll: 3 },
    { width: 768, itemsToShow: 6, itemsToScroll: 4 },
    { width: 900, itemsToShow: 7, itemsToScroll: 4 },
    { width: 1000, itemsToShow: 8, itemsToScroll: 4 },
  ];

  const categories = useSelector((state: RootState) => state.categories);
  const currentCategory = useSelector(
    (state: RootState) => state.currentCategory
  );
  const items = useSelector((state: RootState) => state.items);
  const dispatch = useDispatch();
  const baseUrl = process.env.REACT_APP_BASE_SERVER_URL;

  const handleCategorySelect = (category: Category) => {
    dispatch(setCurrentCategory(category.name));
    const filtered = items.filter(
      (item: Item) => item.category.name === category.name
    );
    dispatch(addFilter(filtered));
    setCurrentPage(1);
  };

  const handleCategoryReset = () => {
    dispatch(setCurrentCategory(null));
    dispatch(removeFilter());
    setCurrentPage(1);
  };

  return (
    <div className="category_container" hidden={hidden}>
      <h2 className="category_header">
        {currentCategory ? currentCategory : "Фильтр по категориям"}
      </h2>
      {currentCategory && (
        <img
          src="cross.svg"
          alt=""
          className="cross_icon"
          onClick={handleCategoryReset}
        />
      )}
      <div className="category_icon_row_wrapper">
        <div className="category_icon_row">
          <Carousel
            isRTL={false}
            pagination={true}
            disableArrowsOnEnd
            breakPoints={breakPoints}
          >
            {categories.map((category: Category) => (
              <img
                key={category.name}
                id={category.name}
                src={`${baseUrl}${category.iconPath}`}
                alt=""
                className="category_icon image_skeleton tooltip"
                onClick={() => handleCategorySelect(category)}
                draggable={false}
              />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Categories;
