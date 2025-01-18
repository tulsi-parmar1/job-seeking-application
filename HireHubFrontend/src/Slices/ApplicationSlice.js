import { createSlice } from "@reduxjs/toolkit";

const ApplicationSlice = createSlice({
  name: "Application",
  initialState: {
    ApplicationNumber: 0,
  },
  reducers: {
    setApplication: (state, action) => {
      state.ApplicationNumber = action.payload;
    },
  },
});
export default ApplicationSlice;
export const applicationAction = ApplicationSlice.actions;
