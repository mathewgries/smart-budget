import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    lastRoute: "",
    currentRoute: "",
    status: "idle",
    error: null,
  },
  reducers: {
    lastRouteUpdated(state, action) {
      state.lastRoute = action.payload;
    },
  },
});

export const { lastRouteUpdated } = historySlice.actions;

export default historySlice.reducer;
