import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post, put } from "../../api/investing/accounts";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchInvestingAccounts = createAsyncThunk(
  "investingAccounts/fetchInvestingAccounts",
  async () => {
    return get();
  }
);

export const addNewInvestingAccount = createAsyncThunk(
  "investingAccounts/addNewInvestingAccount",
  async (initialAccount) => {
    return await post(initialAccount);
  }
);

export const updateInvestingAccount = createAsyncThunk(
	"investingAccounts/updateInvestingAccount",
	async (updatedAccount) => {
		const results = await put(updatedAccount);
    return results.Attributes;
	}
)

export const investingAccountsSlice = createSlice({
  name: "investingAccounts",
  initialState,
	reducers: {
    updateInvestingAccountBalance(state, action) {
			state.history = { ...state, history: state.history };
			const {accountBalance, accountId} = action.payload
			const existingAccount = state.items.find((account) => account.id === accountId)
			existingAccount.accountBalance = accountBalance
		},
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInvestingAccounts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchInvestingAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.concat(action.payload);
      })
      .addCase(fetchInvestingAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder.addCase(addNewInvestingAccount.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
		builder.addCase(updateInvestingAccount.fulfilled, (state, action) => {
      const { id, accountName, accountBalance } = action.payload;
      const existingAccount = state.items.find((account) => account.id === id);
      existingAccount.accountName = accountName;
      existingAccount.accountBalance = accountBalance;
    });
  },
});

export const { updateInvestingAccountBalance } = investingAccountsSlice.actions;

export default investingAccountsSlice.reducer;

export const selectAllInvestingAccounts = (state) =>
  state.investingAccounts.items;

export const selectInvestingAccountById = (state, accountId) => 
  state.investingAccounts.items.find((account) => account.id === accountId);
