import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../../types";

const initialState: Category[] = [];

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    loadCategories(state, action) {
      return action.payload;
    },
  },
});

export const { loadCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;
