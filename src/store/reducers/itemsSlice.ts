import { createSlice } from "@reduxjs/toolkit";
import { Item } from "../../types";

const initialState: Item[] = [];

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    loadItems(state, action) {
      return action.payload.reverse();
    },
  },
});

export const { loadItems } = itemsSlice.actions;
export default itemsSlice.reducer;
