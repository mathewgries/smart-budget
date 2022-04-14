import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { deleteInvestingAccount } from "./investingAccountsSlice";
import { deleteStrategy } from "./strategiesSlice";
import { fetchAllData } from "../users/usersSlice";
import { amplifyClient } from "../../api/amplifyClient";

const optionsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.openDate.toString().localeCompare(a.openDate),
});

const initialState = optionsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const saveNewOptionsOrder = createAsyncThunk(
  "optionsOrders/saveNewOptionsOrder",
  async (newOrder) => {
    return await amplifyClient.post(
      newOrder,
      "smartbudget",
      "/investing/orders/options"
    );
  }
);

export const updateOptionsOrder = createAsyncThunk(
  "optionsOrders/updateOptionsOrder",
  async ({ order, account }) => {
    await amplifyClient.put(
      { order, account },
      "smartbudget",
      `/investing/orders/options/${order.id}`
    );
    return { order, account };
  }
);

export const deleteOptionsOrder = createAsyncThunk(
  "optionsOrders/deleteOptionsOrder",
  async ({ order, account }) => {
    await amplifyClient.remove(
      { order, account },
      "smartbudget",
      `/investing/orders/${order.id}`
    );
    return { order, account };
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
      .addCase(saveNewOptionsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewOptionsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        optionsAdapter.addOne(state, order);
      })
      .addCase(saveNewOptionsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateOptionsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateOptionsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        optionsAdapter.upsertOne(state, order);
      })
      .addCase(updateOptionsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteOptionsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteOptionsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload.order;
        optionsAdapter.removeOne(state, id);
      })
      .addCase(deleteOptionsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteInvestingAccount.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteInvestingAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { orders } = action.payload;
        const options = orders
          .filter((order) => order.type === "ORDER#OPTIONS#")
          .map((order) => order.id);
        optionsAdapter.removeMany(state, options);
      })
      .addCase(deleteInvestingAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteStrategy.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.status = "succeeded";
        const orders = action.payload.orders.filter((order) => order.type === "ORDER#OPTIONS#");
        optionsAdapter.upsertMany(state, orders);
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.status = "failed";
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
