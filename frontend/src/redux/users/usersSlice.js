import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { setupNewUser, getAllData } from "../../api/users";

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchAllData = createAsyncThunk("users/fetchAllData", async () => {
  const results = await getAllData();
  return results;
});

export const addNewUser = createAsyncThunk(
  "users/addNewUser",
  async (userInfo) => {
    return await setupNewUser(userInfo);
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const user = action.payload.filter((item) => item.type === "USER#INFO");
				console.log("US: ", user)
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default usersSlice.reducer;
