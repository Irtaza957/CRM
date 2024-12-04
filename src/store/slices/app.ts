import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const { setDate } = appSlice.actions;
export default appSlice.reducer;