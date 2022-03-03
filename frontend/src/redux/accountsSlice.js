import { createSlice } from "@reduxjs/toolkit";

export const accountsSlice = createSlice({
  name: "accounts",
  initialState: {
    accountId: null,
    accountName: "",
    accountBalance: 0.0,
    accountCreateDate: null,
  },
	reducers: {

	}
});

export default accountsSlice.reducer
