import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { get, post, put, remove } from "../../api/spending/transactions";
import { fetchAllData } from "../users/usersSlice";

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
    const result = await post(newTransaction);
    return result;
  }
);

export const updateSpendingTransaction = createAsyncThunk(
  "spendingTransactions/updateSpendingTransaction",
  async (updatedTransaction) => {
    await put(updatedTransaction);
    return updatedTransaction;
  }
);

export const deleteSpendingTransaction = createAsyncThunk(
  "spendingTransactions/deleteSpendingTransaction",
  async (data) => {
    await remove(data);
    return data;
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
        const trans = action.payload.filter(
          (item) => item.type === "TRANS#SPENDING#"
        );
        spendingTransactionsAdapter.setAll(state, trans);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchSpendingTransactions.pending, (state, action) => {
        state.status = "pending";
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
        state.status = "pending";
      })
      .addCase(saveNewSpendingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        spendingTransactionsAdapter.addOne(state, action.payload.transaction);
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
        const { id, } = action.payload.transaction;
        spendingTransactionsAdapter.removeOne(state, id);
      })
      .addCase(deleteSpendingTransaction.rejected, (state, action) => {
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

export const {
  selectAll: selectAllSpendingTransactions,
  selectById: selectSpendingTransactionById,
} = spendingTransactionsAdapter.getSelectors(
  (state) => state.spendingTransactions
);
