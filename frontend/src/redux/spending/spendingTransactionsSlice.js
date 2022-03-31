import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { get, post, put } from "../../api/spending/transactions";

const spendingTransactionsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createDate.toString().localeCompare(a.createDate),
});

const initialState = spendingTransactionsAdapter.getInitialState({
  status: "idle",
  error: null,
});

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
        spendingTransactionsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchSpendingTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewSpendingTransaction.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(
        saveNewSpendingTransaction.fulfilled,
        spendingTransactionsAdapter.addOne
      );
    builder
      .addCase(updateSpendingTransaction.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(
        updateSpendingTransaction.fulfilled,
        spendingTransactionsAdapter.upsertOne
      );
  },
});

export default spendingTransactionsSlice.reducer;

export const selectSpendingTransactionsByGSI = (state, gsi) =>
  Object.values(state.spendingTransactions.entities).filter(
    (transaction) => transaction.GSI1_PK === gsi
  );

export const {
  selectAll: selectAllSpendingTransactions,
  selectById: selectSpendingTransactionById,
} = spendingTransactionsAdapter.getSelectors(
  (state) => state.spendingTransactions
);
