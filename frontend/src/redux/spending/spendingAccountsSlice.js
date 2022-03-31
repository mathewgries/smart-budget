import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { get, post, put } from "../../api/spending/accounts";

const spendingAccountsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createDate.toString().localeCompare(a.createDate),
});

const initialState = spendingAccountsAdapter.getInitialState({
  status: "idle",
  error: null,
});

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
  async (updatedAccount) => {
    await put(updatedAccount);
    return updatedAccount;
  }
);

export const spendingAccountsSlice = createSlice({
  name: "spendingAccounts",
  initialState,
  reducers: {
    updateSpendingAccountBalance: spendingAccountsAdapter.upsertOne
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSpendingAccounts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchSpendingAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        spendingAccountsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchSpendingAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(addNewSpendingAccount.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(addNewSpendingAccount.fulfilled, spendingAccountsAdapter.addOne);
    builder
      .addCase(updateSpendingAccount.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(
        updateSpendingAccount.fulfilled,
        spendingAccountsAdapter.upsertOne
      );
  },
});

export const { updateSpendingAccountBalance } = spendingAccountsSlice.actions;

export default spendingAccountsSlice.reducer;

export const selectSpendingAccountByGSI = (state, accountGSI) =>
  Object.values(state.spendingAccounts.entities).find(
    (account) => account.GSI1_PK === accountGSI
  );

export const {
  selectAll: selectAllSpendingAcounts,
  selectById: selectSpendingAccountById,
} = spendingAccountsAdapter.getSelectors((state) => state.spendingAccounts);
