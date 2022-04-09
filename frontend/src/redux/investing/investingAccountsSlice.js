import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { fetchAllData } from "../users/usersSlice";
import { amplifyClient } from "../../api/amplifyClient";
import {
  saveNewInvestingTransaction,
  updateInvestingTransaction,
  deleteInvestingTransaction,
} from "./investingTransactionsSlice";
import {
  saveNewOptionsOrder,
  updateOptionsOrder,
  deleteOptionsOrder,
} from "./optionsOrdersSlice";
import {
  saveNewSharesOrder,
  updateSharesOrder,
  deleteSharesOrder,
} from "./sharesOrdersSlice";
import {
  saveNewVerticalSpreadsOrder,
  updateVerticalSpreadOrder,
  deleteVerticalSpreadOrder,
} from "./verticalSpreadsOrdersSlice";

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
    return amplifyClient.get("smartbudget", "/investing/accounts");
  }
);

export const addNewInvestingAccount = createAsyncThunk(
  "investingAccounts/addNewInvestingAccount",
  async ({ account }) => {
    const result = await amplifyClient.post(
      account,
      "smartbudget",
      "/investing/accounts"
    );
    return { account: result };
  }
);

export const updateInvestingAccount = createAsyncThunk(
  "investingAccounts/updateInvestingAccount",
  async (data) => {
    await amplifyClient.put(
      data,
      "smartbudget",
      `/investing/accounts/${data.id}`
    );
    return data;
  }
);

export const deleteInvestingAccount = createAsyncThunk(
  "spendingAccounts/deleteInvestingAccount",
  async ({ account, transactions, orders }) => {
    await amplifyClient.remove(
      { account, transactions, orders },
      "smartbudget",
      `/investing/accounts/${account.id}`
    );
    return { account, transactions, orders };
  }
);

export const investingAccountsSlice = createSlice({
  name: "investingAccounts",
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
          (items) => items.type === "ACCT#INVESTING#"
        );
        investingAccountsAdapter.setAll(state, accounts);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchInvestingAccounts.pending, (state, action) => {
        state.status = "pending";
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
        state.status = "pending";
      })
      .addCase(addNewInvestingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.addOne(state, account);
      })
      .addCase(addNewInvestingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateInvestingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateInvestingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        investingAccountsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateInvestingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteInvestingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteInvestingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload.account;
        investingAccountsAdapter.removeOne(state, id);
      })
      .addCase(deleteInvestingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewInvestingTransaction.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewInvestingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        investingAccountsAdapter.upsertOne(state, action.payload.account);
      })
      .addCase(saveNewInvestingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateInvestingTransaction.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateInvestingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        investingAccountsAdapter.upsertOne(state, action.payload.account);
      })
      .addCase(updateInvestingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteInvestingTransaction.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteInvestingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(deleteInvestingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewOptionsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewOptionsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(saveNewOptionsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateOptionsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateOptionsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(updateOptionsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteOptionsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteOptionsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(deleteOptionsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewSharesOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewSharesOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(saveNewSharesOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateSharesOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateSharesOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(updateSharesOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteSharesOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteSharesOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(deleteSharesOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewVerticalSpreadsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewVerticalSpreadsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(saveNewVerticalSpreadsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateVerticalSpreadOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateVerticalSpreadOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(updateVerticalSpreadOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteVerticalSpreadOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteVerticalSpreadOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload;
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(deleteVerticalSpreadOrder.rejected, (state, action) => {
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
