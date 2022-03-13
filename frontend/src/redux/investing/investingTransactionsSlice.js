import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post, put } from "../../api/investing/transaction";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchInvestingTransactions = createAsyncThunk(
  "investingTransactions/fetchInvestingTransactions",
  async () => {
    return await get();
  }
);

export const saveNewInvestingTransaction = createAsyncThunk(
  "investingTransactions/saveNewInvestingTransaction",
  async (newTransaction) => {
    return await post(newTransaction);
  }
);

export const updateInvestingTransaction = createAsyncThunk(
  "investingTransactions/updateInvestingTransaction",
  async (updatedTransaction) => {
    await put(updatedTransaction);
    return updatedTransaction;
  }
);

export const investingTransactionsSlice = createSlice({
  name: "investingTransactions",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchInvestingTransactions.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchInvestingTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.concat(action.payload);
      })
      .addCase(fetchInvestingTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder.addCase(saveNewInvestingTransaction.fulfilled, (state, action) => {
      const { transaction } = action.payload;
      state.items.push(transaction);
    });
    builder.addCase(updateInvestingTransaction.fulfilled, (state, action) => {
      const {
        id,
        transactionAmount,
        transactionDate,
        transactionNote,
        transactionType,
      } = action.payload;
      const existingTransaction = state.items.find(
        (transaction) => transaction.id === id
      );
      existingTransaction.transactionAmount = transactionAmount;
      existingTransaction.transactionDate = transactionDate;
      existingTransaction.transactionNote = transactionNote;
      existingTransaction.transactionType = transactionType;
    });
  },
});

export default investingTransactionsSlice.reducer;

export const selectInvestingTransactionsByAccountId = (state, accountId) =>
  state.investingTransactions.items.filter(
    (transaction) => transaction.GSI1_PK === accountId
  );
export const selectInvestingTransactionById = (state, transactionId) =>
  state.investingTransactions.items.find(
    (transaction) => transaction.id === transactionId
  );
