import { createSlice } from "@reduxjs/toolkit";
import { Item } from "../../types";

const initialState: Item[] | null = null;

const filteredItemsSlice = createSlice({
  name: "filteredItems",
  initialState,
  reducers: {
    addFilter(state, action) {
      return action.payload;
    },
    removeFilter() {
      return initialState;
    },
  },
});

export const { addFilter, removeFilter } = filteredItemsSlice.actions;
export default filteredItemsSlice.reducer;
