import { combineReducers } from "@reduxjs/toolkit";
import categoriesReducer from "./categoriesSlice";
import itemsReducer from "./itemsSlice";
import usersReducer from "./usersSlice";
import currentUserReducer from "./currentUserSlice";
import filteredItemsReducer from "./filteredItems";
import searchQueryReducer from "./searchQuery";
import currentCategoryReducer from "./currentCategory";

const rootReducer = combineReducers({
  categories: categoriesReducer,
  items: itemsReducer,
  filteredItems: filteredItemsReducer,
  users: usersReducer,
  currentUser: currentUserReducer,
  searchQuery: searchQueryReducer,
  currentCategory: currentCategoryReducer,
});

export default rootReducer;
