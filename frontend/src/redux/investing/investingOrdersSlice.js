import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrders } from "../../api/investing/orders/shared";
import { postShares } from "../../api/investing/orders/shares";
import { postOptions } from "../../api/investing/orders/options";
import { postVerticalSpread } from "../../api/investing/orders/verticalSpreads";

const initialState = {
  items: {
    shares: [],
    options: [],
    verticalSpreads: [],
  },
  status: "idle",
  error: null,
};

export const fetchAllOrders = createAsyncThunk(
  "investingOrders/fetchAllOrders",
  async () => {
    const results = await getAllOrders();
    return results;
  }
);

export const saveNewSharesOrder = createAsyncThunk(
  "investingOrders/saveNewSharesOrder",
  async (newSharesOrder) => {
    return await postShares(newSharesOrder);
  }
);

export const saveNewOptionsOrder = createAsyncThunk(
  "investingOrders/saveNewOptionsOrder",
  async (newOptionsOrder) => {
    return await postOptions(newOptionsOrder);
  }
);

export const saveNewVerticalSpreadsOrder = createAsyncThunk(
  "investingOrders/saveNewVerticalSpreadsOrder",
  async (newVerticalSpreadsOrder) => {
    return await postVerticalSpread(newVerticalSpreadsOrder);
  }
);

export const investingOrdersSlice = createSlice({
  name: "investingOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllOrders.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.shares = action.payload.filter(
          (order) => order.type === "ORDER#SHARES#"
        );
        state.items.options = action.payload.filter(
          (order) => order.type === "ORDER#OPTIONS#"
        );
        state.items.verticalSpreads = action.payload.filter(
          (order) => order.type === "ORDER#VERTSPREADS#"
        );
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(saveNewSharesOrder.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(saveNewSharesOrder.fulfilled, (state, action) => {
				state.status = "succeeded";
        const { order } = action.payload;
        state.items.shares.push(order);
      });
    builder
      .addCase(saveNewOptionsOrder.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(saveNewOptionsOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { order } = action.payload;
        state.items.options.push(order);
      });
    builder
      .addCase(saveNewVerticalSpreadsOrder.pending, (state, action) => {
        state.status = "saving";
      })
      .addCase(saveNewVerticalSpreadsOrder.fulfilled, (state, action) => {
				state.status = "succeeded";
        const { order } = action.payload;
        state.items.verticalSpreads.push(order);
      });
  },
});

export default investingOrdersSlice.reducer;

export const selectSharesOrdersByAccountId = (state, accountId) =>
  state.investingOrders.items.shares.filter(
    (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
  );

export const selectOptionsOrdersByAccountId = (state, accountId) =>
  state.investingOrders.items.options.filter(
    (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
  );

export const selectVerticalSpreadsOrdersByAccountId = (state, accountId) =>
  state.investingOrders.items.verticalSpreads.filter(
    (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
  );

export const selectOrderCountByTypeAndAccountId = (state, type, accountId) =>
  state.investingOrders.items[type].filter(
    (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
  ).length;

export const selectProfitLossByAccountId = (state, accountId) => {
  let totals = state.investingOrders.items.shares
    .map((order) => Number.parseFloat(order.profitLoss))
    .concat(
      state.investingOrders.items.options.map((order) =>
        Number.parseFloat(order.profitLoss)
      )
    )
    .concat(
      state.investingOrders.items.verticalSpreads.map((order) =>
        Number.parseFloat(order.profitLoss)
      )
    );

  let initialValue = 0;
  return totals.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
};

export const selectOrdersByAccountId = (state, accountId) => {
  return {
    options: state.investingOrders.items.options.filter(
      (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
    ),
    shares: state.investingOrders.items.shares.filter(
      (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
    ),
    verticalSpreads: state.investingOrders.items.verticalSpreads.filter(
      (order) => order.GSI1_PK.replace("ACCT#INVESTING#", "") === accountId
    ),
  };
};
