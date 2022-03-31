import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { get, post, put } from "../../api/investing/accounts";

const investingAccountsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createDate.toString().localeCompare(a.createDate),
});

const initialState = investingAccountsAdapter.getInitialState({
  status: "idle",
  error: null,
});

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
    await put(updatedAccount);
    return updatedAccount;
  }
);

export const investingAccountsSlice = createSlice({
  name: "investingAccounts",
  initialState,
  reducers: {
    updateInvestingAccountBalance: investingAccountsAdapter.upsertOne,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInvestingAccounts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchInvestingAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        investingAccountsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchInvestingAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(addNewInvestingAccount.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(
        addNewInvestingAccount.fulfilled,
        investingAccountsAdapter.addOne
      )
      .addCase(addNewInvestingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateInvestingAccount.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(
        updateInvestingAccount.fulfilled,
        investingAccountsAdapter.upsertOne
      )
      .addCase(updateInvestingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateInvestingAccountBalance } = investingAccountsSlice.actions;

export default investingAccountsSlice.reducer;

export const selectInvestingAccountByGSI = (state, accountGSI) =>
  Object.values(state.investingAccounts.entities).find(
    (account) => account.GSI1_PK === accountGSI
  );

export const {
  selectAll: selectAllInvestingAccounts,
  selectById: selectInvestingAccountById,
} = investingAccountsAdapter.getSelectors((state) => state.investingAccounts);
