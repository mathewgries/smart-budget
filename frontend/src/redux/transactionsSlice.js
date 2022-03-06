import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post, put } from "../api/transactions";

const initialState = {
  history: [],
  items: [],
  status: "idle",
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    return await get();
  }
);

export const saveNewTransaction = createAsyncThunk(
  "transactions/saveNewTransaction",
  async (newTransaction) => {
    return await post(newTransaction);
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (updatedTransaction) => {
    await put(updatedTransaction);
    return updatedTransaction;
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTransactions.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.concat(action.payload);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder.addCase(saveNewTransaction.fulfilled, (state, action) => {
      const { transaction } = action.payload;
      state.items.push(transaction);
    });
    builder.addCase(updateTransaction.fulfilled, (state, action) => {
      console.log(action);
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

export default transactionsSlice.reducer;

export const selectAllTransactions = (state) => state.transactions.items;
export const selectTransactionsByAccountId = (state, accountId) =>
  state.transactions.items.filter(
    (transaction) => transaction.GSI1_PK === accountId
  );
export const selectTransactionById = (state, transactionId) =>
  state.transactions.items.find(
    (transaction) => transaction.id === transactionId
  );
