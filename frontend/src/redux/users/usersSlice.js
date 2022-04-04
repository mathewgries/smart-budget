import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      .addCase(addNewUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.status = "success";
        const data = action.payload.find(
          (item) => item.Put.Item.type === "USER#INFO"
        );
        state.user = data.Put.Item;
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
        const data = action.payload.filter((item) => item.type === "USER#INFO");
        state.user = data[0];
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default usersSlice.reducer;