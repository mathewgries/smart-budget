import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { get, post, put } from "../../api/investing/transaction";
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
    const result = await post(newTransaction);
    return result.transaction;
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
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const trans = action.payload.filter(
          (item) => item.type === "TRANS#INVESTING#"
        );
        investingTransactionAdapter.setAll(state, trans)
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchInvestingTransactions.pending, (state, action) => {
        state.status = "loading";
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
        state.status = "saving";
      })
      .addCase(
        saveNewInvestingTransaction.fulfilled,
        investingTransactionAdapter.addOne
      )
      .addCase(saveNewInvestingTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateInvestingTransaction.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(
        updateInvestingTransaction.fulfilled,
        investingTransactionAdapter.upsertOne
      )
      .addCase(updateInvestingTransaction.rejected, (state, action) => {
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
