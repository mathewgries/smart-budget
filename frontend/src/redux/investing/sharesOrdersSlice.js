import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { deleteInvestingAccount } from "./investingAccountsSlice";
import { deleteStrategy } from "./strategiesSlice";
import { fetchAllData } from "../appSlice";
import { amplifyClient } from "../../api/amplifyClient";

const sharesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.openDate.toString().localeCompare(a.openDate),
});

const initialState = sharesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const getAllSharesOrders = createAsyncThunk(
  "sharesOrders/getAllSharesOrders",
  async () => {
    return await amplifyClient.get("smartbudget", "/investing/orders/shares");
  }
);

export const saveNewSharesOrder = createAsyncThunk(
  "sharesOrders/saveNewSharesOrder",
  async (newOrder) => {
    return await amplifyClient.post(
      newOrder,
      "smartbudget",
      "/investing/orders/shares"
    );
  }
);

export const updateSharesOrder = createAsyncThunk(
  "sharesOrders/updateSharesOrder",
  async ({ order, account }) => {
    await amplifyClient.put(
      { order, account },
      "smartbudget",
      `/investing/orders/shares/${order.id}`
    );
    return { order, account };
  }
);

export const deleteSharesOrder = createAsyncThunk(
  "sharesOrders/deleteSharesOrder",
  async ({ order, account }) => {
    await amplifyClient.remove(
      { order, account },
      "smartbudget",
      `/investing/orders/${order.id}`
    );
    return { order, account };
  }
);

export const sharesOrdersSlice = createSlice({
  name: "sharesOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const shares = action.payload.filter(
          (item) => item.type === "ORDER#SHARES#"
        );
        sharesAdapter.setAll(state, shares);
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(saveNewSharesOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveNewSharesOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        sharesAdapter.addOne(state, order);
      })
      .addCase(saveNewSharesOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(updateSharesOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(updateSharesOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        sharesAdapter.upsertOne(state, order);
      })
      .addCase(updateSharesOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteSharesOrder.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteSharesOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload.order;
        sharesAdapter.removeOne(state, id);
      })
      .addCase(deleteSharesOrder.rejected, (state, action) => {
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
        const shares = orders
          .filter((order) => order.type === "ORDER#SHARES#")
          .map((order) => order.id);
        sharesAdapter.removeMany(state, shares);
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
          (order) => order.type === "ORDER#SHARES#"
        );
        sharesAdapter.upsertMany(state, orders);
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.status = "failed";
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
