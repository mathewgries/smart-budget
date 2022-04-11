import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { amplifyClient } from "../../api/amplifyClient";
import { fetchAllData } from "../users/usersSlice";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchSignals = createAsyncThunk(
  "signals/fetchSignals",
  async () => {
    return amplifyClient.get("smartbudget", "/investing/signals");
  }
);

export const saveSignal = createAsyncThunk(
  "signals/saveSignal",
  async (signals) => {
    await amplifyClient.put(signals, "smartbudget", "/investing/signals");
    return signals;
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
      .addCase(fetchSignals.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchSignals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.signalList;
      })
      .addCase(fetchSignals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveSignal.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveSignal.fulfilled, (state, action) => {
        state.status = "succeeded";
				state.items = action.payload
      })
      .addCase(saveSignal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default signalsSlice.reducer;

export const selectAllSignals = (state) =>
  state.signals.items;
