import {
  createSlice,
  createAsyncThunk
} from "@reduxjs/toolkit";
import { setupNewUser, getAllData } from "../../api/users";

const initialState = {
	user: {},
  status: "idle",
  error: null,
};

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
        const data = action.payload.filter((item) => item.type === "USER#INFO");
				state.user = data[0]
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default usersSlice.reducer;
