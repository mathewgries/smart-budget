import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { amplifyClient } from "../../api/amplifyClient";
import { fetchAllData } from "../appSlice";
import {
  saveNewSpendingTransaction,
  updateSpendingTransaction,
  deleteSpendingTransaction,
} from "./spendingTransactionsSlice";

const spendingAccountsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createDate.toString().localeCompare(a.createDate),
});

const initialState = spendingAccountsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const getAllSpendingAccounts = createAsyncThunk(
  "spendingAccounts/getAllSpendingAccounts",
  async () => {
    return await amplifyClient.get("smartbudget", "/spending/accounts");
  }
);

export const addNewSpendingAccount = createAsyncThunk(
  "spendingAccounts/addNewSpendingAccount",
  async ({ account }) => {
    const result = await amplifyClient.post(
      account,
      "smartbudget",
      "/spending/accounts"
    );
    return { account: result };
  }
);

export const updateSpendingAccount = createAsyncThunk(
  "spendingAccounts/updateSpendingAccount",
  async (data) => {
    await amplifyClient.put(
      data,
      "smartbudget",
      `/spending/accounts/${data.id}`
    );
    return data;
  }
);

export const deleteSpendingAccount = createAsyncThunk(
  "spendingAccounts/deleteSpendingAccount",
  async ({ account, transactions }) => {
    await amplifyClient.remove(
      { account, transactions },
      "smartbudget",
      `/spending/accounts/${account.id}`
    );
    return { account, transactions };
  }
);

export const spendingAccountsSlice = createSlice({
  name: "spendingAccounts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const accounts = action.payload.filter(
          (items) => items.type === "ACCT#SPENDING#"
        );
        spendingAccountsAdapter.setAll(state, accounts);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(addNewSpendingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addNewSpendingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        spendingAccountsAdapter.addOne(state, account);
      })
      .addCase(addNewSpendingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateSpendingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateSpendingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        spendingAccountsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateSpendingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteSpendingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteSpendingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload.account;
        spendingAccountsAdapter.removeOne(state, id);
      })
      .addCase(deleteSpendingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewSpendingTransaction.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewSpendingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        spendingAccountsAdapter.upsertOne(state, action.payload.account);
      })
      .addCase(saveNewSpendingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateSpendingTransaction.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateSpendingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        spendingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(updateSpendingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteSpendingTransaction.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteSpendingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        spendingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(deleteSpendingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
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
