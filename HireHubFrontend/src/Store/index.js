import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../Slices/userSlice"; // Import the default export which is the reducer
import { userAction } from "../Slices/userSlice";
const store = configureStore({
  reducer: {
    user: userSlice.reducer, // Use the reducer correctly
  },
});
export default store;