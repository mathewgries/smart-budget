import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { post, put, get } from "../../api/investing/orders/options";
import { fetchAllData } from "../users/usersSlice";

const optionsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.openDate.localeCompare(a.openDate),
});

const initialState = optionsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchOptionsOrders = createAsyncThunk(
  "optionsOrders/fetchOptionsOrders",
  async () => {
    const results = await get();
    return results;
  }
);

export const saveNewOptionsOrder = createAsyncThunk(
  "optionsOrders/saveNewOptionsOrder",
  async (newOptionsOrder) => {
    const result = await post(newOptionsOrder);
    return result.order;
  }
);

export const updateOptionsOrder = createAsyncThunk(
  "optionsOrders/updateOptionsOrder",
  async (updatedOrder) => {
    await put(updatedOrder);
    delete updatedOrder.accountId;
    delete updatedOrder.accountBalance;
    return updatedOrder;
  }
);

export const optionsOrdersSlice = createSlice({
  name: "optionsOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const options = action.payload.filter(
          (item) => item.type === "ORDER#OPTIONS#"
        );
        optionsAdapter.setAll(state, options);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(fetchOptionsOrders.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOptionsOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        optionsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchOptionsOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewOptionsOrder.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(saveNewOptionsOrder.fulfilled, optionsAdapter.addOne)
      .addCase(saveNewOptionsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateOptionsOrder.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(updateOptionsOrder.fulfilled, optionsAdapter.upsertOne)
      .addCase(updateOptionsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default optionsOrdersSlice.reducer;

export const selectOptionsOrdersByAccountGSI = (state, gsi) =>
  Object.values(state.optionsOrders.entities).filter(
    (order) => order.GSI1_PK === gsi
  );

export const selectOptionsCountByAccountGSI = (state, gsi) =>
  Object.values(state.optionsOrders.entities).map(
    (order) => order.GSI1_PK === gsi
  ).length;

export const selectOptionsPLByAccountGSI = (state, gsi) => {
  const totals = Object.values(state.optionsOrders.entities)
    .filter((order) => order.GSI1_PK === gsi)
    .map((order) => Number.parseFloat(order.profitLoss));

  let initialValue = 0;
  return totals.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
};

export const {
  selectAll: selectAllOptionsOrders,
  selectById: selectOptionsOrderById,
  selectIds: selectOptionsOrdersIds,
} = optionsAdapter.getSelectors((state) => state.optionsOrders);
