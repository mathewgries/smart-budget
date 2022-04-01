import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { setupNewUser } from "../../api/users";

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const addNewUser = createAsyncThunk(
  "addNewUser/addNewUser",
  async (userInfo) => {
    return await setupNewUser(userInfo);
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export default usersSlice.reducer
