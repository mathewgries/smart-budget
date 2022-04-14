import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { amplifyClient } from "../../api/amplifyClient";
import { fetchAllData } from "../users/usersSlice";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const updateSignals = createAsyncThunk(
  "signals/updateSignals",
  async ({ signals, strategies }) => {
    await amplifyClient.put(
      { signals, strategies },
      "smartbudget",
      "/investing/signals"
    );
    return { signals, strategies };
  }
);

export const signalsSlice = createSlice({
  name: "signals",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const signals = action.payload.find((item) => item.type === "SIGNALS#");
        state.items = signals.signalList;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(updateSignals.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateSignals.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { signals } = action.payload;
        state.items = signals;
      })
      .addCase(updateSignals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default signalsSlice.reducer;

export const selectAllSignals = (state) => state.signals.items;
