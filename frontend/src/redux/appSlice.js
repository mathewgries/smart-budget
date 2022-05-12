import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { amplifyClient } from "../api/amplifyClient";

export const fetchAllData = createAsyncThunk("app/fetchAllData", async () => {
  return await amplifyClient.get("smartbudget", "/load_all");
});

export const appSlice = createSlice({
  name: "app",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default appSlice.reducer;
