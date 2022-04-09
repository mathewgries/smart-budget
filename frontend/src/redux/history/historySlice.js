import { createSlice } from "@reduxjs/toolkit";
import { addNewSpendingAccount } from "../spending/spendingAccountsSlice";

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
  extraReducers(builder) {
    builder
      .addCase(addNewSpendingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addNewSpendingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        // const { history } = action.payload;
        // console.log(history);
      })
      .addCase(addNewSpendingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { lastRouteUpdated } = historySlice.actions;

export default historySlice.reducer;
