import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../Slices/userSlice"; // Import the default export which is the reducer
import ApplicationSlice from "../Slices/ApplicationSlice";
const store = configureStore({
  reducer: {
    user: userSlice.reducer, // Use the reducer correctly
    application: ApplicationSlice.reducer,
  },
});
export default store;
