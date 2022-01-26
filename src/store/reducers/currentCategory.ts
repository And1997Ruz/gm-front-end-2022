import { createSlice } from "@reduxjs/toolkit";

const initialState: string | null = null;

const currentCategorySlice = createSlice({
  name: "currentCategory",
  initialState,
  reducers: {
    setCurrentCategory(state, action) {
      return action.payload;
    },
  },
});

export const { setCurrentCategory } = currentCategorySlice.actions;
export default currentCategorySlice.reducer;
