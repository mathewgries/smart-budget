import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { get } from "../../api/spending/accounts";
import { amplifyClient } from "../../api/amplifyClient";
import { fetchAllData } from "../users/usersSlice";
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

export const fetchSpendingAccounts = createAsyncThunk(
  "spendingAccounts/fetchSpendingAccounts",
  async () => {
    return await get();
  }
);

export const addNewSpendingAccount = createAsyncThunk(
  "spendingAccounts/addNewSpendingAccount",
  async (data) => {
    return await amplifyClient.post(
      data,
      "smartbudget",
      "/spending/accounts"
    );
  }
);

export const updateSpendingAccount = createAsyncThunk(
  "spendingAccounts/updateSpendingAccount",
  async (data) => {
		await amplifyClient.put(
			data,
			"smartbudget",
      `/spending/accounts/${data.id}`
		)
    return data;
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
      .addCase(fetchSpendingAccounts.pending, (state, action) => {
        state.status = "pending";
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
        state.status = "pending";
      })
      .addCase(addNewSpendingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        spendingAccountsAdapter.addOne(state, action.payload);
      })
      .addCase(addNewSpendingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateSpendingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(
        updateSpendingAccount.fulfilled,
        spendingAccountsAdapter.upsertOne
      )
      .addCase(updateSpendingAccount.rejected, (state, action) => {
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
