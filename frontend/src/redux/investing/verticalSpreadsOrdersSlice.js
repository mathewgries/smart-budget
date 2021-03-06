import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { deleteInvestingAccount } from "./investingAccountsSlice";
import { deleteStrategy } from "./strategiesSlice";
import { fetchAllData } from "../appSlice";
import { amplifyClient } from "../../api/amplifyClient";

const vertSpreadsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.openDate.toString().localeCompare(a.openDate),
});

const initialState = vertSpreadsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const getAllVerticalSpreadsOrders = createAsyncThunk(
  "verticalSpreadsOrders/getAllVerticalSpreadsOrders",
  async () => {
    return await amplifyClient.get(
      "smartbudget",
      "/investing/orders/spreads/vertical"
    );
  }
);

export const saveNewVerticalSpreadsOrder = createAsyncThunk(
  "verticalSpreadsOrders/saveNewVerticalSpreadsOrder",
  async (newOrder) => {
    return await amplifyClient.post(
      newOrder,
      "smartbudget",
      "/investing/orders/spreads/vertical"
    );
  }
);

export const updateVerticalSpreadOrder = createAsyncThunk(
  "verticalSpreadsOrders/updateVerticalSpreadOrder",
  async ({ order, account }) => {
    await amplifyClient.put(
      { order, account },
      "smartbudget",
      `/investing/orders/spreads/vertical/${order.id}`
    );
    return { order, account };
  }
);

export const deleteVerticalSpreadOrder = createAsyncThunk(
  "verticalSpreadsOrders/deleteVerticalSpreadOrder",
  async ({ order, account }) => {
    await amplifyClient.remove(
      { order, account },
      "smartbudget",
      `/investing/orders/${order.id}`
    );
    return { order, account };
  }
);

export const verticalSpreadsOrdersSlice = createSlice({
  name: "verticalSpreadsOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const verts = action.payload.filter(
          (item) => item.type === "	ORDER#VERTSPREADS#"
        );
        vertSpreadsAdapter.setAll(state, verts);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(saveNewVerticalSpreadsOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewVerticalSpreadsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        vertSpreadsAdapter.addOne(state, order);
      })
      .addCase(saveNewVerticalSpreadsOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateVerticalSpreadOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateVerticalSpreadOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        vertSpreadsAdapter.upsertOne(state, order);
      })
      .addCase(updateVerticalSpreadOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteVerticalSpreadOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteVerticalSpreadOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload.order;
        vertSpreadsAdapter.removeOne(state, id);
      })
      .addCase(deleteVerticalSpreadOrder.rejected, (state, action) => {
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
        const spreads = orders
          .filter((order) => order.type === "ORDER#VERTSPREADS#")
          .map((order) => order.id);
        vertSpreadsAdapter.removeMany(state, spreads);
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
        const orders = action.payload.orders.filter(
          (order) => order.type === "ORDER#VERTSPREADS#"
        );
        vertSpreadsAdapter.upsertMany(state, orders);
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.status = "failed";
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
