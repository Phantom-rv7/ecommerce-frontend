// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState: UserReducerInitialState = {
  user: null,
  loading: true,
  token: null,
  isAuthenticated: false,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.token = action.payload.token || null; // adjust if token is separate
      state.isAuthenticated = true;
      state.loading = false;
    },
    userNotExist: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { userExist, userNotExist } = userReducer.actions;
export default userReducer.reducer;


