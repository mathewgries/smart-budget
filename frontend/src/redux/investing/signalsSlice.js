import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { amplifyClient } from "../../api/amplifyClient";
import { addNewUser } from "../users/usersSlice";
import { fetchAllData } from "../appSlice";

const signalsAdapter = createEntityAdapter();

const initialState = signalsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const getAllSignals = createAsyncThunk(
  "signals/getAllSignals",
  async () => {
    return await amplifyClient.get("smartbudget", "/investing/signals");
  }
);

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
      .addCase(addNewUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const signals = action.payload.find(
          (val) => val.Put.Item.type === "SIGNALS#"
        );
        signalsAdapter.upsertMany(state, signals.Put.Item.signals);
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const signals = action.payload.find(
          (item) => item.type === "SIGNALS#"
        );
        signalsAdapter.upsertMany(state, signals.signals);
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
        signalsAdapter.setAll(state, signals);
      })
      .addCase(updateSignals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default signalsSlice.reducer;

export const {
  selectAll: selectAllSignals,
  selectById: selectSignalById,
  selectIds: selectSignalIds,
} = signalsAdapter.getSelectors((state) => state.signals);
