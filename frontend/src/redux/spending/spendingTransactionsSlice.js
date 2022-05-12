import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { deleteSpendingAccount } from "./spendingAccountsSlice";
import { deleteCategory, deleteSubcategory } from "./categoriesSlice";
import { amplifyClient } from "../../api/amplifyClient";
import { fetchAllData } from "../appSlice";

const spendingTransactionsAdapter = createEntityAdapter();

const initialState = spendingTransactionsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const getAllSpendingTransactions = createAsyncThunk(
  "spendingTransactions/getAllSpendingTransactions",
  async () => {
    return await amplifyClient.get("smartbudget", "/spending/transactions");
  }
);

export const saveNewSpendingTransaction = createAsyncThunk(
  "spendingTransactions/saveNewSpendingTransaction",
  async (newTransaction) => {
    const result = await amplifyClient.post(
      newTransaction,
      "smartbudget",
      "/spending/transactions"
    );
    return result;
  }
);

export const updateSpendingTransaction = createAsyncThunk(
  "spendingTransactions/updateSpendingTransaction",
  async ({ transaction, account }) => {
    await amplifyClient.put(
      { transaction, account },
      "smartbudget",
      `/spending/transactions/${transaction.id}`
    );
    return { transaction, account };
  }
);

export const deleteSpendingTransaction = createAsyncThunk(
  "spendingTransactions/deleteSpendingTransaction",
  async ({ transaction, account }) => {
    await amplifyClient.remove(
      { transaction, account },
      "smartbudget",
      `/spending/transactions/${transaction.id}`
    );
    return { transaction, account };
  }
);

export const spendingTransactionsSlice = createSlice({
  name: "spendingTransactions",
  initialState,
  reducers: {
    spendingTransactionStatusUpdated(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const transactions = action.payload.filter(
          (item) => item.type === "TRANS#SPENDING#"
        );
        spendingTransactionsAdapter.setAll(state, transactions);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(saveNewSpendingTransaction.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewSpendingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { transaction } = action.payload;
        spendingTransactionsAdapter.addOne(state, transaction);
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
        const { transaction } = action.payload;
        spendingTransactionsAdapter.upsertOne(state, transaction);
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
        const { id } = action.payload.transaction;
        spendingTransactionsAdapter.removeOne(state, id);
      })
      .addCase(deleteSpendingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteSpendingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteSpendingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { transactions } = action.payload;
        spendingTransactionsAdapter.removeMany(
          state,
          transactions.map((transaction) => transaction.id)
        );
      })
      .addCase(deleteSpendingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteCategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { transactions } = action.payload;
        spendingTransactionsAdapter.upsertMany(state, transactions);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteSubcategory.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { transactions } = action.payload;
        spendingTransactionsAdapter.upsertMany(state, transactions);
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { spendingTransactionStatusUpdated } =
  spendingTransactionsSlice.actions;

export default spendingTransactionsSlice.reducer;

export const selectSpendingTransactionsByGSI = (state, gsi) =>
  Object.values(state.spendingTransactions.entities).filter(
    (transaction) => transaction.GSI1_PK === gsi
  );

export const selectSpendingTransactionsByCategoryId = (state, id) =>
  Object.values(state.spendingTransactions.entities).filter(
    (transaction) => transaction.categoryId === id
  );

export const {
  selectAll: selectAllSpendingTransactions,
  selectById: selectSpendingTransactionById,
} = spendingTransactionsAdapter.getSelectors(
  (state) => state.spendingTransactions
);
