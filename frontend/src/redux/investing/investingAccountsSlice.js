import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { get, post, put } from "../../api/investing/accounts";
import { fetchAllData } from "../users/usersSlice";
import {
  saveNewInvestingTransaction,
  updateInvestingTransaction,
  deleteInvestingTransaction,
} from "./investingTransactionsSlice";
import { saveNewOptionsOrder, updateOptionsOrder } from "./optionsOrdersSlice";
import { saveNewSharesOrder, updateSharesOrder } from "./sharesOrdersSlice";
import {
  saveNewVerticalSpreadsOrder,
  updateVerticalSpreadOrder,
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
        state.status = "saving";
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
        state.status = "saving";
      })
      .addCase(deleteInvestingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { account } = action.payload
        investingAccountsAdapter.upsertOne(state, account);
      })
      .addCase(deleteInvestingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewOptionsOrder.pending, (state, action) => {
        state.status = "saving";
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
        state.status = "saving";
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
      .addCase(saveNewSharesOrder.pending, (state, action) => {
        state.status = "saving";
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
        state.status = "saving";
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
      .addCase(saveNewVerticalSpreadsOrder.pending, (state, action) => {
        state.status = "saving";
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
        state.status = "saving";
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
