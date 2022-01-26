import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";

const initialState: User | undefined | null = null;

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      if (action.payload) {
        return action.payload;
      } else {
        return null;
      }
    },
  },
});

export const { setCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
