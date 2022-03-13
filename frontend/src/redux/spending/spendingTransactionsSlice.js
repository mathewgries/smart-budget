import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post, put } from "../../api/spending/transactions";

const initialState = {
  history: [],
  items: [],
  status: "idle",
  error: null,
};

export const fetchSpendingTransactions = createAsyncThunk(
  "spendingTransactions/fetchSpendingTransactions",
  async () => {
    return await get();
  }
);

export const saveNewSpendingTransaction = createAsyncThunk(
  "spendingTransactions/saveNewSpendingTransaction",
  async (newTransaction) => {
    return await post(newTransaction);
  }
);

export const updateSpendingTransaction = createAsyncThunk(
  "spendingTransactions/updateSpendingTransaction",
  async (updatedTransaction) => {
    await put(updatedTransaction);
    return updatedTransaction;
  }
);

export const spendingTransactionsSlice = createSlice({
  name: "spendingTransactions",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSpendingTransactions.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchSpendingTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.concat(action.payload);
      })
      .addCase(fetchSpendingTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder.addCase(saveNewSpendingTransaction.fulfilled, (state, action) => {
      const { transaction } = action.payload;
      state.items.push(transaction);
    });
    builder.addCase(updateSpendingTransaction.fulfilled, (state, action) => {
      const {
        id,
        category,
        subCategory,
        transactionAmount,
        transactionDate,
        transactionNote,
        transactionType,
      } = action.payload;
      const existingTransaction = state.items.find((transaction) => transaction.id === id);
      existingTransaction.category = category;
      existingTransaction.subCategory = subCategory;
			existingTransaction.transactionAmount = transactionAmount;
			existingTransaction.transactionDate = transactionDate;
			existingTransaction.transactionNote = transactionNote;
			existingTransaction.transactionType = transactionType;
    });
  },
});

export default spendingTransactionsSlice.reducer;

export const selectAllSpendingTransactions = (state) => state.spendingTransactions.items;
export const selectSpendingTransactionsByAccountId = (state, accountId) =>
  state.spendingTransactions.items.filter(
    (transaction) => transaction.GSI1_PK === accountId
  );
export const selectSpendingTransactionById = (state, transactionId) =>
  state.spendingTransactions.items.find(
    (transaction) => transaction.id === transactionId
  );
