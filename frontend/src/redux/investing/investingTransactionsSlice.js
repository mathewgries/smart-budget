import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { get, post, put, remove } from "../../api/investing/transaction";
import { fetchAllData } from "../users/usersSlice";

const investingTransactionAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createDate.toString().localeCompare(a.createDate),
});

const initialState = investingTransactionAdapter.getInitialState({
  status: "idle",
  error: null,
});

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

export const deleteInvestingTransaction = createAsyncThunk(
  "investingTransactions/deleteInvestingTransaction",
  async (data) => {
    await remove(data);
    return data;
  }
);

export const investingTransactionsSlice = createSlice({
  name: "investingTransactions",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const trans = action.payload.filter(
          (item) => item.type === "TRANS#INVESTING#"
        );
        investingTransactionAdapter.setAll(state, trans);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchInvestingTransactions.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(
        fetchInvestingTransactions.fulfilled,
        investingTransactionAdapter.upsertMany
      )
      .addCase(fetchInvestingTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewInvestingTransaction.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewInvestingTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        investingTransactionAdapter.addOne(state, action.payload.transaction);
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
        investingTransactionAdapter.upsertOne(
          state,
          action.payload.transaction
        );
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
        const { id } = action.payload.transaction;
        investingTransactionAdapter.removeOne(state, id);
      })
      .addCase(deleteInvestingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default investingTransactionsSlice.reducer;

export const selectInvestingTransactionsByGSI = (state, gsi) =>
  Object.values(state.investingTransactions.entities).filter(
    (transaction) => transaction.GSI1_PK === gsi
  );

export const {
  selectAll: selectAllInvestingTransactions,
  selectById: selectInvestingTransactionById,
} = investingTransactionAdapter.getSelectors(
  (state) => state.investingTransactions
);
