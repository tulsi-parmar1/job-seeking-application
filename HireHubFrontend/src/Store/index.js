import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../Slices/userSlice";
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
export default store;
