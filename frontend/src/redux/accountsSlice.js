import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post, put } from "../api/accounts";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async () => {
    return await get();
  }
);

export const addNewAccount = createAsyncThunk(
  "accounts/addNewAccount",
  async (initialAccount) => {
    return await post(initialAccount);
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async (updatedAccount) => {
    const results = await put(updatedAccount);
    return results.Attributes;
  }
);

export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAccounts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.concat(action.payload);
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder.addCase(addNewAccount.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(updateAccount.fulfilled, (state, action) => {
      const { id, accountName, accountBalance } = action.payload;
      const existingAccount = state.items.find((account) => account.id === id);
      existingAccount.accountName = accountName;
      existingAccount.accountBalance = accountBalance;
    });
  },
});

export default accountsSlice.reducer;

export const selectAllAcounts = (state) => state.accounts.items;

export const selectAccountById = (state, accountId) =>
  state.accounts.items.find((account) => account.id === accountId);
