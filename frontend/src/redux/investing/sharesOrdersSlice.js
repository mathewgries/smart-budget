import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { post, get } from "../../api/investing/orders/shares";

const sharesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a, b) => b.openDate.localeCompare(a.openDate),
});

const initialState = sharesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchSharesOrders = createAsyncThunk(
  "sharesOrders/fetchSharesOrders",
  async () => {
    const results = await get();
    return results;
  }
);

export const saveNewSharesOrder = createAsyncThunk(
  "sharesOrders/saveNewSharesOrder",
  async (newSharesOrder) => {
    return await post(newSharesOrder);
  }
);

export const sharesOrdersSlice = createSlice({
  name: "sharesOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSharesOrders.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchSharesOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        sharesAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchSharesOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewSharesOrder.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(saveNewSharesOrder.fulfilled, sharesAdapter.upsertOne)
      .addCase(saveNewSharesOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default sharesOrdersSlice.reducer;

export const selectSharesOrdersByAccounGSI = (state, gsi) =>
  Object.values(state.sharesOrders.entities).filter(
    (order) => order.GSI1_PK === gsi
  );

export const selectSharesCountByAccountGSI = (state, gsi) =>
  Object.values(state.sharesOrders.entities).filter(
    (order) => order.GSI1_PK === gsi
  ).length;

export const selectSharesPLByAccountGSI = (state, gsi) => {
  const totals = Object.values(state.sharesOrders.entities)
    .filter((order) => order.GSI1_PK === gsi)
    .map((order) => Number.parseFloat(order.profitLoss));

  let initialValue = 0;
  return totals.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
};

export const {
  selectAll: selectAllSharesOrders,
  selectById: selectSharesOrderById,
	selectIds: selectShareOrdersIds,
} = sharesAdapter.getSelectors((state) => state.sharesOrders);
