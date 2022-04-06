import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { amplifyClient } from "../../api/amplifyClient";

const initialState = {
  user: {},
  status: "idle",
  error: null,
};

export const fetchAllData = createAsyncThunk(
	"users/fetchAllData", 
	async () => {
  	return await amplifyClient.loadAll(
			"smartbudget", 
			"/users"
		);
});

export const addNewUser = createAsyncThunk(
  "users/addNewUser",
  async (data) => {
		return await amplifyClient.newUser(
			data,
			"smartbudget",
			"/users"
		)
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
