import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { post, get } from "../../api/investing/orders/verticalSpreads";

const vertSpreadsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.openDate.localeCompare(a.openDate),
});

const initialState = vertSpreadsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchVerticalSpreadsOrders = createAsyncThunk(
  "verticalSpreadsOrders/fetchVerticalSpreadsOrders",
  async () => {
    const results = await get();
    return results;
  }
);

export const saveNewVerticalSpreadsOrder = createAsyncThunk(
  "verticalSpreadsOrders/saveNewVerticalSpreadsOrder",
  async (newVerticalSpreadsOrder) => {
    return await post(newVerticalSpreadsOrder);
  }
);

export const verticalSpreadsOrdersSlice = createSlice({
  name: "verticalSpreadsOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchVerticalSpreadsOrders.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchVerticalSpreadsOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        vertSpreadsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchVerticalSpreadsOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewVerticalSpreadsOrder.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(saveNewVerticalSpreadsOrder.fulfilled, vertSpreadsAdapter.addOne)
      .addCase(saveNewVerticalSpreadsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default verticalSpreadsOrdersSlice.reducer;

export const selectVerticalSpreadsOrdersByAccountGSI = (state, gsi) =>
  Object.values(state.verticalSpreadsOrders.entities).filter(
    (order) => order.GSI1_PK === gsi
  );

export const selectVerticalSpreadsCountByAccountGSI = (state, gsi) =>
  Object.values(state.verticalSpreadsOrders.entities).map(
    (order) => order.GSI1_PK === gsi
  ).length;

export const selectVerticalSpreadsPLByAccountGSI = (state, gsi) => {
  const totals = Object.values(state.verticalSpreadsOrders.entities)
    .filter((order) => order.GSI1_PK === gsi)
    .map((order) => Number.parseFloat(order.profitLoss));

  let initialValue = 0;
  return totals.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
};

export const {
  selectAll: selectAllVerticalSpreadsOrders,
  selectById: selectVerticalSpreadsOrderById,
  selectIds: selectVerticalSpreadsOrdersIds,
} = vertSpreadsAdapter.getSelectors((state) => state.verticalSpreadsOrders);
