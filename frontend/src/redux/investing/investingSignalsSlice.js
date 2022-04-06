import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { amplifyClient } from "../../api/amplifyClient";
import { fetchAllData } from "../users/usersSlice";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchSignals = createAsyncThunk(
  "investingSignals/fetchSignals",
  async () => {
    return amplifyClient.get("smartbudget", "/investing/signals");
  }
);

export const updateSignals = createAsyncThunk(
  "investingSignals/updateSignals",
  async (signalList) => {
    await amplifyClient.put(
			signalList,
			"smartbudget",
			"/investing/signals"
		)
  }
);

export const investingSignalsSlice = createSlice({
  name: "investingSignals",
  initialState,
  reducers: {
    addNewSignal(state, action) {
      state.items.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const signals = action.payload.filter((item) => item.type === "SIGNAL");
        state.items = signals[0];
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
      .addCase(updateSignals.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateSignals.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(updateSignals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addNewSignal } = investingSignalsSlice.actions;

export default investingSignalsSlice.reducer;

export const selectAllSignals = (state) =>
  state.investingSignals.items.signalList;
