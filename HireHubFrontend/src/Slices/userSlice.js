import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isAuthorized: false,
    users: {},
    profilee: null,
    email: null,
    isVerified: false,
  },
  reducers: {
    setIsAuthorized: (state, action) => {
      state.isAuthorized = action.payload;
    },
    setUser: (state, action) => {
      state.users = action.payload;
    },
    setProfile: (state, action) => {
      state.profilee = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
  },
});

export const userAction = userSlice.actions;
export default userSlice;
