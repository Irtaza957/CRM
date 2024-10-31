import { createSlice } from "@reduxjs/toolkit";

const initialState: GlobalStateProps = {
  user: null,
  sidebar: false,
  date: new Date(),
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
    logout: (state) => {
      state.user = null;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const { setUser, logout, setDate, toggleSidebar } = globalSlice.actions;
export default globalSlice.reducer;
