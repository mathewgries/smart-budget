import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post, put } from "../../api/spending/accounts";

const initialState = {
	history: [],
  items: [],
  status: "idle",
  error: null,
};

export const fetchSpendingAccounts = createAsyncThunk(
  "spendingAccounts/fetchSpendingAccounts",
  async () => {
    return await get();
  }
);

export const addNewSpendingAccount = createAsyncThunk(
  "spendingAccounts/addNewSpendingAccount",
  async (initialSpendingAccount) => {
    return await post(initialSpendingAccount);
  }
);

export const updateSpendingAccount = createAsyncThunk(
  "spendingAccounts/updateSpendingAccount",
  async (updatedSpendingAccount) => {
    const results = await put(updatedSpendingAccount);
    return results.Attributes;
  }
);

export const spendingAccountsSlice = createSlice({
  name: "spendingAccounts",
  initialState,
  reducers: {
    updateSpendingAccountBalance(state, action) {
			state.history = { ...state, history: state.history };
			const {accountBalance, accountId} = action.payload
			const existingAccount = state.items.find((account) => account.id === accountId)
			existingAccount.accountBalance = accountBalance
		},
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSpendingAccounts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchSpendingAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.concat(action.payload);
      })
      .addCase(fetchSpendingAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
			.addCase(addNewSpendingAccount.pending, (state, action) => {
				state.status = "loading"
			})
			.addCase(addNewSpendingAccount.fulfilled, (state, action) => {
      	state.items.push(action.payload);
    	});
    builder.addCase(updateSpendingAccount.fulfilled, (state, action) => {
      const { id, accountName, accountBalance } = action.payload;
      const existingAccount = state.items.find((account) => account.id === id);
      existingAccount.accountName = accountName;
      existingAccount.accountBalance = accountBalance;
    });
  },
});

export const { updateSpendingAccountBalance } = spendingAccountsSlice.actions;

export default spendingAccountsSlice.reducer;

export const selectAllSpendingAcounts = (state) => state.spendingAccounts.items;

export const selectSpendingAccountById = (state, accountId) =>
  state.spendingAccounts.items.find((account) => account.id === accountId);
