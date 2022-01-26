import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";

const initialState: User[] = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    loadUsers(state, action) {
      return action.payload;
    },
  },
});

export const { loadUsers } = usersSlice.actions;
export default usersSlice.reducer;
