import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  items: [
    "expirationDate",
    "daysToExpiration",
    "deltaAtOpen",
    "deltaAtClose",
    "thetaAtOpen",
    "thetaAtClose",
  ],
  status: "idle",
  error: null,
};

export const investingCustomFieldsSlice = createSlice({
  name: "investingCustomFields",
  initialState,
  reducers: {},
});

export default investingCustomFieldsSlice.reducer;
